# CSS Group admin panel – setup and daily use
Address: **https://admin.cssgroup.com.ng** (a separate sign-in page for management).

## What management can do from it
| Screen | What it does | Who |
|---|---|---|
| **News** | Write, edit, publish/unpublish and delete articles: headline, date, short summary, article text (blank line = paragraph, `## ` = sub-heading), cover photo, a photo gallery (many at once, reorder, remove, pick cover), optional video (upload or YouTube/Vimeo). The News page lists all published articles and the **home page shows the latest 3**. Each article gets its own address (`article.html?a=…`). Drafts stay hidden. | owner, editor |
| **Photos** | Replace the other photos on the website (hero, welcome section, service cards and pages, Chairman portrait, both news galleries…). Upload several to a library and reuse them. Photos are resized/optimised automatically; "Restore original" brings the first one back. | owner, editor |
| **Videos** | Replace the ISAC Resort video: upload an MP4/WebM or paste a YouTube/Vimeo link. | owner, editor |
| **Page texts** | Edit 21 main wordings: top bar, hero tagline and paragraph, welcome text, vision/mission, Chairman quote/name/title, the 6 service descriptions, careers text, call-back banner, footer text. | owner, editor |
| **Contact details** | Phone, email, opening hours, both offices. Changing them once updates header, footer, contact page and every page. Also the **announcement banner** (coloured strip on every page). | owner, editor |
| **Form messages** | Everything sent through the website forms; download as spreadsheet; delete. (Also emailed to the company inbox.) | owner, editor |
| **Website mode** | **Maintenance ON/OFF.** ON shows a branded "We will be back soon" page (you set the headline, message, expected time, email) with the correct HTTP 503 status so Google does not de-list the site. "Preview live site" lets you browse the real site while visitors still see the maintenance page. | owner only |
| **Users** | Add owners/editors, reset passwords. | owner |
| **History** | Automatic copy of your settings before every change (last 40). One-click restore. Full activity log (who changed what, when, from which IP). | owner |
| **Health check** | Green/red checks that everything is installed correctly. | everyone |
| **My account** | Change password; turn on two-step sign-in (Google/Microsoft Authenticator). | everyone |

Not included (phase 2): adding brand-new pages, editing wording other than the 21 blocks above, cropping photos, scheduling articles or maintenance in advance.

## One-time installation (about 20 minutes)
**You need:** `cssgroup-admin.zip` and the updated `css-group-site.zip` (both delivered with this guide).

1. **Create the admin address.** cPanel → **Domains** → *Create A New Domain* → `admin.cssgroup.com.ng`.
   Untick "Share document root". Set **Document Root** to `cssgroup-admin/public` (this folder is created in the next step; the admin
   programme itself stays outside `public_html`, so nobody can browse its data). Then cPanel → **SSL/TLS Status** → *Run AutoSSL* for the new address.
2. **Upload the admin panel.** File Manager → your home folder `/home/cssgroup` → Upload `cssgroup-admin.zip` → Extract. You should now have
   `/home/cssgroup/cssgroup-admin/` containing `app`, `data`, `public`.
3. **PHP settings.** cPanel → **MultiPHP Manager**: set PHP **8.1 or newer** for `admin.cssgroup.com.ng` (and for the main site). cPanel → **Select PHP Version → Extensions**:
   make sure `gd`, `fileinfo`, `mbstring` are ticked. cPanel → **MultiPHP INI Editor** (for the admin address): `upload_max_filesize = 128M`, `post_max_size = 128M`,
   `max_execution_time = 300`, `memory_limit = 256M` (needed for large photos and short videos).
4. **Update the public website.** Upload and extract the new `css-group-site.zip` into `/home/cssgroup/public_html` (overwrite when asked), as in `DEPLOY-CSSGROUP.md`.
   This version contains the maintenance-mode rules (`.htaccess`), the protected `images/uploads` folder, and the pieces the admin panel controls. **Do not skip it.**
5. **Create the owner account.** Open https://admin.cssgroup.com.ng. In File Manager open `/home/cssgroup/cssgroup-admin/data/setup.key`, copy the text, paste it on the page,
   choose a username and a strong password (12+ characters). The key file is deleted automatically.
6. **Health check** (opens automatically): everything should be green. If a line is red, follow its hint. If your public site is not in `/home/cssgroup/public_html`,
   edit `/home/cssgroup/cssgroup-admin/app/config.php` → `site_root`.
7. **Turn on two-step sign-in** (My account) for every user and add your colleagues under **Users** (give *Editor* to staff who only change photos/texts).
8. **Test:** change the phone number, refresh the public site; replace one photo; turn maintenance ON, open the site in a private window (you should see the maintenance page), use
   "Preview live site", then **Go LIVE**.

## How the pieces fit (so you can trust it)
- The public website stays plain HTML/CSS (fast, safe). The admin panel writes one generated file, `public_html/config.js`, plus uploaded files in `public_html/images/uploads/`.
  Visitors' browsers read `config.js`, so a saved change is live immediately (refresh once).
- Maintenance mode = a file `maintenance.flag` in `public_html`. The `.htaccess` rules in the website check for it. Other websites on your account (cssfarms, cssenergy, isac…) are never affected.
- Edited texts are applied by a few lines of script in `config.js`; the original wording stays in the HTML as a fallback and for search engines.
- Everything is stored in plain files (no database): `cssgroup-admin/data/` (users, settings, history, activity log). It is included in your normal cPanel backups. **Download `data/site.json` now and then as an extra copy.**

## Security built in
Separate address and its own HTTPS · passwords hashed · lock-out after 5 wrong tries (15 minutes) · optional two-step codes · sign-out after 60 idle minutes · every form protected against forged requests (CSRF) ·
strict browser security headers · uploaded photos are re-encoded (hidden code is removed) and uploaded files can never run as programmes · only the owner can change maintenance mode, users or restore · full activity log.
Tips: use long passwords, switch on two-step codes, give *Editor* instead of *Owner* wherever possible, and (optional) restrict the admin address to your office IP in cPanel → **IP Blocker**.

## Common problems
- **Forgot the owner password / locked out:** in File Manager delete `cssgroup-admin/data/users.json`, create a new `cssgroup-admin/data/setup.key` containing any random text, then open the admin address and do the first-time setup again (your photos, texts and settings are kept).
- **"Too many attempts":** wait 15 minutes, or delete `cssgroup-admin/data/ratelimit.json`.
- **Photo/video upload fails:** the file is bigger than the server allows – raise the limits in step 3 or compress the file. Videos: use MP4 (H.264), keep them under 1–2 minutes.
- **A change does not show:** hard refresh (Ctrl+F5). `config.js` is sent with "no-cache", so this should only be a one-time refresh.
- **Health check says "Maintenance rules present" is red:** upload the new `css-group-site.zip` (step 4).
- **Moved to another server / folder:** edit `site_root` and `site_url` in `app/config.php`.

## Files
```
/home/cssgroup/
  cssgroup-admin/
    public/   ← the admin address points here (index.php, admin.css, admin.js, .htaccess)
    app/      ← programme code + config.php (private)
    data/     ← settings, users, history, logs (private, also blocked by .htaccess)
  public_html/ ← your website (+ config.js, maintenance.html/flag, images/uploads written by the admin)
```
