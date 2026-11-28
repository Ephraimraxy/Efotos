#!/bin/bash
# CSS Group: install the NEW website (side by side with the old one) + admin panel on cPanel. Paste/run in cPanel > Terminal.
# BEFORE running: upload css-group-site.zip and cssgroup-admin.zip into /home/cssgroup (File Manager > Upload).
# Safe to re-run. The old website is NOT changed: it stays live until you press "Make live" in the admin (Websites).
set -u
cd ~ || exit 1
D=$(date +%Y%m%d-%H%M)
ok(){ echo "  [OK]   $*"; }; bad(){ echo "  [FAIL] $*"; FAIL=1; }; FAIL=0

echo "1/6 Checking the uploads"
for z in css-group-site.zip cssgroup-admin.zip; do [ -f "$z" ] && ok "$z found" || bad "$z missing in $(pwd)"; done
[ $FAIL = 1 ] && { echo "Upload the missing zip(s) to $(pwd) and run again."; exit 1; }
[ -d public_html ] || { echo "public_html not found"; exit 1; }

echo "2/6 Backing up the main .htaccess (the old site is not changed)"
[ -f public_html/.htaccess ] && cp public_html/.htaccess "public_html/.htaccess.backup-$D" && ok "backup: public_html/.htaccess.backup-$D"
echo "  Folders inside public_html (other sites may live here, they are NOT touched):"; ls -d public_html/*/ 2>/dev/null | sed 's/^/    /'

echo "3/6 Installing the NEW website next to the old one (public_html/_sites/css-new)"
mkdir -p public_html/_sites/css-new
# keep what the admin already wrote (config.js, uploaded photos) when re-running
unzip -oq css-group-site.zip -x 'config.js' 'images/uploads/*' -d public_html/_sites/css-new
[ -f public_html/_sites/css-new/config.js ] || unzip -oq css-group-site.zip 'config.js' 'images/uploads/*' -d public_html/_sites/css-new
ok "new website extracted (visitors still see the OLD site until you press Make live)"
chmod 755 public_html/_sites public_html/_sites/css-new public_html/_sites/css-new/images/uploads 2>/dev/null

echo "4/6 Installing the admin panel (outside public_html)"
if [ -d cssgroup-admin/data ] && [ -f cssgroup-admin/data/users.json ]; then
  # already set up before: update code only, keep users/settings/history
  unzip -oq cssgroup-admin.zip 'public/*' 'app/lib.php' 'app/install_switch.php' -d cssgroup-admin && ok "admin code updated, your data kept"
else
  unzip -oq cssgroup-admin.zip -d cssgroup-admin && ok "admin extracted to ~/cssgroup-admin"
fi
chmod 700 cssgroup-admin/data; chmod 600 cssgroup-admin/data/* 2>/dev/null
# upload limits for photos/videos (works on LiteSpeed/lsphp; MultiPHP INI Editor can also set these)
cat > cssgroup-admin/public/.user.ini <<'I'
upload_max_filesize = 128M
post_max_size = 128M
max_execution_time = 300
memory_limit = 256M
I
ok "upload limits file written"

echo "5/6 Installing the website switch and the admin address"
php cssgroup-admin/app/install_switch.php && ok "switch rules installed in public_html/.htaccess" || bad "switch install failed (see message above)"
ADM_URL=admin.cssgroup.com.ng
DR=""
if command -v uapi >/dev/null; then
  DR=$(uapi --output=json DomainInfo single_domain_data domain=$ADM_URL 2>/dev/null | grep -o '"documentroot":"[^"]*"' | head -1 | sed 's/.*:"//; s/"$//; s#\\/#/#g')
  if [ -z "$DR" ]; then
    R=$(uapi --output=json SubDomain addsubdomain domain=admin rootdomain=cssgroup.com.ng dir=cssgroup-admin/public 2>&1)
    echo "$R" | grep -q '"status":1' && { ok "admin.cssgroup.com.ng created (document root cssgroup-admin/public)"; DR="$HOME/cssgroup-admin/public"; } || echo "  [INFO] create admin.cssgroup.com.ng in cPanel > Domains first (see ADMIN-SETUP.md step 1), then run this script again"
  fi
fi
if [ -n "$DR" ]; then
  echo "  admin address folder: $DR"
  case "$DR" in
    "$HOME/cssgroup-admin/public") ok "document root is cssgroup-admin/public - nothing more to do" ;;
    "$HOME/public_html/"*|"$HOME/"*)
      mkdir -p "$DR" && cp -a cssgroup-admin/public/. "$DR/" && ok "admin web files copied to $DR (the admin's code and data stay private in ~/cssgroup-admin)" || bad "could not copy the admin web files to $DR" ;;
    *) bad "unexpected document root $DR" ;;
  esac
fi

echo "6/6 Checks"
php -v | head -1
V=$(php -r 'echo PHP_VERSION_ID>=80100?"ok":"old";'); [ "$V" = ok ] && ok "PHP 8.1+" || bad "PHP older than 8.1 in this terminal; set 8.1+ in cPanel > MultiPHP Manager for the site and admin address"
for m in gd fileinfo mbstring json; do php -m | grep -qix "$m" && ok "php ext $m" || bad "php ext $m missing: cPanel > Select PHP Version > Extensions"; done
[ -f public_html/_sites/css-new/index.html ] && [ -f public_html/_sites/css-new/config.js ] && ok "new website files present" || bad "new website files missing"
[ -f cssgroup-admin/data/setup.key ] && echo "  First-time setup key: ~/cssgroup-admin/data/setup.key (open it in File Manager, paste it on the admin page)"
echo
echo "NEXT: cPanel > SSL/TLS Status > Run AutoSSL, open https://admin.cssgroup.com.ng, create the owner account (key: ~/cssgroup-admin/data/setup.key),"
echo "      then Websites > Preview the new site > Make live. Rollback any time: Websites > Old website > Make live."
echo "      Emergency rollback if the main site ever breaks: cp ~/public_html/.htaccess.before-css-switch ~/public_html/.htaccess"
[ $FAIL = 1 ] && echo "Some checks failed - read the [FAIL] lines above." || echo "All checks passed."
