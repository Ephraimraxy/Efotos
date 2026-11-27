# Replace cssgroup.com.ng with the new CSS Group site (cPanel guide)

You have: `css-group-site.zip` (about 70 files, 3 MB: HTML pages, CSS/JS, images, `forms.php`, `.htaccess`).
It is a plain static site plus one PHP file for the forms, so it runs on your cPanel with nothing to install.


## What this new site is
- **Design:** the Agrigo template (your sample, web 25) with everything kept the same: top bar, rounded green layout, card grids,
  green "why choose us" band, statistics band, gallery cards, news, call-back banner, dark footer.
- **Content, logo and navigation come from the live cssgroup.com.ng** (WordPress). Menu order is the same as the old site:
  Home · About CSS Group · Careers · Services (Agriculture, Construction, Energy, Aviation, Real Estate, ICT) · News · Contact,
  plus the "Request a call back" button (opens the call-back form, as the old homepage had).
- **Pages (14):** Home, About, Services, one page for each of the 6 services, News + the two news articles, Careers, Contact.
- **Real content reused:** both offices and hours (Mon–Sat 8:00–6:00), phone +234 702 603 3333, info@cssgroup.com.ng,
  the Chairman's quote (Prof. John Kennedy Opara), vision, mission, the four core values (Excellence, Passion, Creativity, Integrity),
  "Visioneers / Implementers / Value driven", the six service descriptions, "500+ employees", "thousands of projects and customers",
  both news headlines, your logo, and about 45 of your own photographs (CSS Farms training events, ISAC Resort, sector images).
- **Left out on purpose:** the Shop (it only held the template's demo books), the job listings (template placeholders: Houston,
  Toronto…), the "company overview/history" page (template text about "Consulting WP"), and all other demo pages from the old theme.
- **Not available on the old site, so not invented:** body text of the two news articles (they are photo galleries only) and
  detail text for each service (the old service pages were empty); each service page uses the same description as the old site.
  Send me the real wording and I will add it.
- **Video:** the very large homepage video backdrop (`CSS_Slider_1.mp4`, 22 MB) was NOT added, as requested. The 9 MB
  **ISAC Resort** video from your media library *is* included (home page → "Watch: ISAC Resort" opens it in a pop-up, file
  `images/isac-resort.mp4`). Other media added from your library: the Chairman's full portrait, the office/gate photos,
  the campus aerial view, the ISAC Resort rooms and restaurant, and the October 2025 event photos (News page).
- Please confirm "500+ employees" and "award-winning group" are still accurate (they came from the old site).
- The old header listed a mistyped email (`info@cssroup.com.ng`); the new site uses `info@cssgroup.com.ng`.

## Before you start: protect what already exists
Your DNS shows these subdomains on the same server: `cssfarms`, `cssenergy`, `cssconstruction`, `cssaviation`,
`cssict`, `cssrealestate`, `groovefmowerri.ng`, `isac.ng`, `cssfarms.ng`. Some of them may keep their files
**inside `public_html`** (for example `public_html/cssfarms`). Check this before deleting anything.

1. cPanel → **Domains**: look at the "Document Root" column. Note every folder that starts with `public_html/`.
   Those folders must NOT be deleted when you replace the main site.
2. cPanel → **Backup** (or File Manager → select `public_html` → Compress). Download the zip. This is your undo button.
3. If the old site is WordPress (cPanel → **WordPress Management** lists it): also back up its database
   (cPanel → **Backup** → "Download a MySQL Database Backup") before removing it.

## Step 1 – Move the old site aside (don't delete yet)
cPanel → **File Manager** → open `public_html`.
1. Create a folder `old-site-backup` (outside web access is better: use the top-level `/home/cssgroup/old-site-backup`).
2. Move the OLD site's files into it: `index.php`, `index.html`, `wp-*` folders, `.htaccess`, `wp-config.php`, etc.
3. **Leave alone** any subfolder that is a subdomain/addon-domain document root (see "Before you start").
   Tip: in File Manager open Settings → tick "Show Hidden Files (dotfiles)" so you see `.htaccess`.

## Step 2 – Upload the new site
1. In `public_html`, click **Upload** → choose `css-group-site.zip`.
2. Right-click the zip → **Extract** (extract into `/public_html`). Files must sit directly in `public_html`
   (you should see `index.html`, `forms.php`, `.htaccess` there, not inside another folder).
3. Delete the zip.
4. Check permissions: folders `755`, files `644` (File Manager → right-click → Change Permissions).

## Step 3 – Set your real details (2 minutes)
Edit with File Manager → **Edit**:
- `config.js` → `window.SITE`: phone, address and email are already the real ones; change only if needed.
- `forms.php` (top lines): `$MAIL_TO` = the inbox that should receive enquiries (default `info@cssgroup.com.ng`),
  `$MAIL_FROM` = a real mailbox on the domain (default `website@cssgroup.com.ng` – create it in cPanel → Email Accounts,
  or change it to an existing one). This improves delivery and keeps messages out of spam.
- Photos: the company's own photos are in `/images/`. Construction, energy, aviation and ICT use the small sector images from the old site (350 px wide, a little soft when enlarged). To swap one, upload your file to `/public_html/images/` and in `config.js`
  change that key's `src` to `'images/your-file.jpg'`. Keys: `hero`, `about1`, `about2`, `c1`–`c6` (service cards), `sv1`–`sv6` (service pages), `bay1`–`bay12` and `ebo1`–`ebo12` (news galleries).

## Step 4 – Test
1. Open https://cssgroup.com.ng (hard refresh: Ctrl+F5). The `.htaccess` forces HTTPS.
2. Click through every menu item and the six service pages (pages switch without a full reload, that is normal).
3. Send a test message on **Contact** and **Careers**. You should see "Thank you…", receive an email, and a line is
   saved in `public_html/submissions/forms.jsonl` (private; web access is blocked).
4. If no email arrives: check spam; confirm `$MAIL_FROM` exists as a mailbox; cPanel → **Track Delivery** shows the attempt.
   The message is still saved in `submissions/forms.jsonl` either way.

## Step 5 – "Point an extension / another domain to this site"
Choose the case that matches:

**A. A subdomain (e.g. `group.cssgroup.com.ng` or `www`)**
- cPanel → **Domains** → *Create A New Domain* → enter the subdomain, untick "Share document root", or set the
  document root to `public_html` to show the same site. cPanel adds the DNS record automatically.
- `www.cssgroup.com.ng` already points to the main domain (CNAME exists), so nothing to do.

**B. Another domain you own (e.g. `cssgroup.ng` or `cssgroup.com`)**
1. cPanel → **Domains** → *Create A New Domain* → enter it. Document root: `public_html` (same site) or a new folder.
2. At the registrar, set that domain's nameservers to `ns27.doveserver.com` and `ns28.doveserver.com`
   (the same nameservers your zone shows), or add an **A record** `@` → `147.124.220.188`.
3. Wait for DNS (minutes to a few hours), then cPanel → **SSL/TLS Status** → *Run AutoSSL* for the new domain.
4. Optional redirect so only one address is "main": cPanel → **Redirects** → Permanent (301) from the extra domain to
   `https://cssgroup.com.ng`.

**C. Your own mailboxes** are unaffected. Do not touch the `MX`, `TXT` (SPF/DKIM) records in Zone Editor.

## Rolling back
Move the new files out of `public_html` and move your `old-site-backup` files back (or restore the cPanel backup zip).

## What each file does
- 14 `.html` pages (home, about, services, six service pages, news, two news articles, careers, contact)
- `config.js` – phone/email/address and all photo links (one file to edit)
- `theme.css, base.css, fx*.css/js, engine.js, pjax.js` – design and behaviour (leave as is)
- `forms.php` – receives form posts, emails them, saves a copy, blocks spam (honeypot + 8 per hour per visitor)
- `.htaccess` – HTTPS, caching, blocks private files

## Content to review before going live
Text comes from your current website. Please read every page once, especially Real Estate (the old site repeated the construction wording there, kept as is).
