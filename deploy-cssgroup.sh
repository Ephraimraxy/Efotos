#!/bin/bash
# CSS Group: install the website + admin panel on cPanel. Paste/run in cPanel > Terminal.
# BEFORE running: upload css-group-site.zip and cssgroup-admin.zip into /home/cssgroup (File Manager > Upload).
# Safe to re-run. Backs up every website file it would overwrite.
set -u
cd ~ || exit 1
D=$(date +%Y%m%d-%H%M)
ok(){ echo "  [OK]   $*"; }; bad(){ echo "  [FAIL] $*"; FAIL=1; }; FAIL=0

echo "1/6 Checking the uploads"
for z in css-group-site.zip cssgroup-admin.zip; do [ -f "$z" ] && ok "$z found" || bad "$z missing in $(pwd)"; done
[ $FAIL = 1 ] && { echo "Upload the missing zip(s) to $(pwd) and run again."; exit 1; }
[ -d public_html ] || { echo "public_html not found"; exit 1; }

echo "2/6 Backing up the files the new site will replace"
LIST=$(unzip -Z1 css-group-site.zip | grep -v '/$' | while read -r f; do [ -e "public_html/$f" ] && echo "$f"; done)
if [ -n "$LIST" ]; then echo "$LIST" | tar czf "css-site-backup-$D.tgz" -C public_html -T - && ok "backup: ~/css-site-backup-$D.tgz"; else ok "nothing to back up"; fi
echo "  Folders inside public_html (other sites may live here, they are NOT touched):"; ls -d public_html/*/ 2>/dev/null | sed 's/^/    /'

echo "3/6 Installing the website"
unzip -oq css-group-site.zip -d public_html && ok "website files extracted to public_html"
chmod 755 public_html/images/uploads 2>/dev/null; chmod 644 public_html/.htaccess

echo "4/6 Installing the admin panel (outside public_html)"
if [ -d cssgroup-admin/data ] && [ -f cssgroup-admin/data/users.json ]; then
  # already set up before: update code only, keep users/settings/history
  unzip -oq cssgroup-admin.zip 'public/*' 'app/lib.php' -d cssgroup-admin && ok "admin code updated, your data kept"
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

echo "5/6 Creating admin.cssgroup.com.ng"
if command -v uapi >/dev/null; then
  R=$(uapi --output=json SubDomain addsubdomain domain=admin rootdomain=cssgroup.com.ng dir=cssgroup-admin/public 2>&1)
  echo "$R" | grep -q '"status":1' && ok "subdomain created (document root cssgroup-admin/public)" || {
    echo "$R" | grep -qi "already" && ok "subdomain already exists" || bad "could not create it here. Do it in cPanel > Domains > Create A New Domain: admin.cssgroup.com.ng, document root cssgroup-admin/public"; }
else bad "uapi not available: create the subdomain in cPanel > Domains (document root cssgroup-admin/public)"; fi

echo "6/6 Checks"
php -v | head -1
V=$(php -r 'echo PHP_VERSION_ID>=80100?"ok":"old";'); [ "$V" = ok ] && ok "PHP 8.1+" || bad "PHP older than 8.1 in this terminal; set 8.1+ in cPanel > MultiPHP Manager for the site and admin address"
for m in gd fileinfo mbstring json; do php -m | grep -qix "$m" && ok "php ext $m" || bad "php ext $m missing: cPanel > Select PHP Version > Extensions"; done
[ -f public_html/index.html ] && [ -f public_html/config.js ] && ok "website files present" || bad "website files missing"
[ -f cssgroup-admin/data/setup.key ] && echo "  First-time setup key: ~/cssgroup-admin/data/setup.key (open it in File Manager, paste it on the admin page)"
echo
echo "NEXT in cPanel: SSL/TLS Status > Run AutoSSL (so admin.cssgroup.com.ng gets https), then open https://admin.cssgroup.com.ng"
[ $FAIL = 1 ] && echo "Some checks failed - read the [FAIL] lines above." || echo "All checks passed."
