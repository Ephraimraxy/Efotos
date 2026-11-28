# CSS Group admin panel – setup and daily use
Address: **https://admin.cssgroup.com.ng** (a separate sign-in page for management).

## What management can do from it
| Screen | What it does | Who |
|---|---|---|
| **Websites** | Keep several websites side by side and choose which one visitors see: the old WordPress site, the new CSS Group site, and any others you add later (upload a .zip, or copy a folder with File Manager). **Make live** switches instantly; **Make live** on the Old website goes back. **Preview** shows you only (2 hours). Replace a website's files with a new zip (the previous files are kept as a backup), rename, or delete (not the live one). | owner |
| **News** | Write, edit, publish/unpublish and delete articles: headline, date, short summary, article text (blank line = paragraph, `## ` = sub-heading), cover photo, a photo gallery (many at once, reorder, remove, pick cover), optional video (upload or YouTube/Vimeo). The News page lists all published articles and the **home page shows the latest 3**. Each article gets its own address (`article.html?a=…`). Drafts stay hidden. | owner, editor |
| **Chairman** | Replace the Chairman's portrait (with a choice of how it is cropped), and edit the quote, name and title shown on the home and About pages. | owner, editor |
| **Service photos** | Each of the six services (Agriculture, Construction, Energy, Aviation, Real Estate, ICT) shows a photo slideshow on its card and on its own page. Upload as many photos as you like per service, reorder or remove them, and set the speed. On hover (tap on a phone) the service description slides up and stays while you keep the pointer on the card. Edit that wording in Page texts. | owner, editor |
| **Gallery sliders** | The photo cards under "From CSS Farms and ISAC Resort" on the home page: each card is a slider with as many photos as you want (optional title and small text per photo), with arrows, dots and swipe. Add up to 6 cards. | owner, editor |
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

## One-time installation (about 15 minutes)
**You need:** `cssgroup-admin.zip`, `css-group-site.zip` and `deploy-cssgroup.sh`.
The old website is **not changed**: the new one is installed next to it in `public_html/_sites/css-new` and visitors keep seeing the old one until you press **Make live**.

1. **Create the admin address.** cPanel → **Domains** → *Create A New Domain*: Domain `admin.cssgroup.com.ng`, **untick** "Share document root", Document Root `cssgroup-admin/public` (outside `public_html`, so nobody can browse the admin's data). Submit, then cPanel → **SSL/TLS Status** → *Run AutoSSL*.
2. **Upload** the two zips and `deploy-cssgroup.sh` to `/home/cssgroup` (File Manager → Upload).
3. **Run** cPanel → **Terminal**: `bash deploy-cssgroup.sh`. It installs the new website and the admin, writes the upload limits and installs the switch rules. Read any `[FAIL]` lines.
4. **PHP:** cPanel → **MultiPHP Manager**: PHP **8.1 or newer** for `admin.cssgroup.com.ng` and `cssgroup.com.ng`. Select PHP Version → Extensions: `gd`, `fileinfo`, `mbstring`, `zip` ticked.
5. **Create the owner account.** Open https://admin.cssgroup.com.ng, paste the text from `/home/cssgroup/cssgroup-admin/data/setup.key` (File Manager), choose a username and a strong password. The key file is deleted automatically.
6. **Health check** opens: everything should be green.
7. **Turn on two-step sign-in** (My account) and add colleagues under **Users** (*Editor* for people who only change photos/texts).
8. **Go live:** **Websites** → *Preview* the new site (open it on phone too) → **Make live**. To go back: **Websites** → Old website → **Make live**.

Emergency rollback (if the main site ever misbehaves): File Manager → `public_html` → copy `.htaccess.before-css-switch` over `.htaccess`.

## How the pieces fit (so you can trust it)
- The public website stays plain HTML/CSS (fast, safe). The admin panel writes one generated file, `_sites/css-new/config.js`, plus uploaded files in `_sites/css-new/images/uploads/`.
  Visitors' browsers read `config.js`, so a saved change is live immediately (refresh once).
- Which website is live is decided by one managed block at the top of `public_html/.htaccess` (the admin rewrites it when you press Make live; the rest of that file, e.g. WordPress, is kept). Each website lives in `public_html/_sites/<name>`. Maintenance mode = a file `maintenance.flag` in the new website's folder; it applies to the new site only. Other websites on your account (cssfarms, cssenergy, isac…) are never affected.
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
  public_html/ ← the old website + the switch rules (.htaccess)
    _sites/css-new/ ← the new website (+ config.js, maintenance files, images/uploads written by the admin)
    _sites/<other>/ ← any other website you add
```
