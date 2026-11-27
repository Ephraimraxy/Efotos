# Replace cssgroup.com.ng with the new CSS Group site (cPanel guide)

You have: `css-group-site.zip` (about 30 files, 1 MB: HTML pages, CSS/JS, images, `forms.php`, `.htaccess`).
It is a plain static site plus one PHP file for the forms, so it runs on your cPanel with nothing to install.


## What I found on the live cssgroup.com.ng (checked today)
- It is a **WordPress** site (theme "Consulting", Elementor, WooCommerce shop, Contact Form 7, Revolution Slider, Instagram feed).
- Real company details were reused in the new site: both offices (20 Thomas Sankara Street, Asokoro, Abuja; Km 10 Abuja–Keffi Road,
  Gora, Nasarawa), phone +234 702 603 3333, info@cssgroup.com.ng, hours Mon–Sat 8:00–6:00, the Chairman's quote
  (Prof. John Kennedy Opara), vision, mission, the four core values, the six sector descriptions, the two news headlines,
  and the company's own photos and logo (training events, estate, sector images).
- NOT carried over: the **Shop** (WooCommerce), the **job listings** (they are template placeholders: Houston, Toronto, etc.), the
  homepage **hero video** (`/wp-content/uploads/2024/11/CSS_Slider_1.mp4`, 22 MB), and the full text of the two news articles.
  Before you remove WordPress, download from `wp-content/uploads` anything you still want (File Manager → select → Download),
  e.g. the video; then drop it into `/public_html/images/` and tell me if you want it added as a hero video.
- Old addresses (`/about-css-group/`, `/our-services/`, `/blog/`, `/contact-us/`, `/company-overview/careers/`) are redirected to
  the new pages by `.htaccess`, so existing links and Google results keep working.
- Claims taken from the old site and shown as their own words: "500+ employees", "thousands of projects / satisfied customers".
  Please confirm they are still accurate.
- The old contact email in the page header was misspelled (`info@cssroup.com.ng`); the new site uses `info@cssgroup.com.ng`.
- The photo of the Chairman on the old site was only a 48 px thumbnail, so the new site shows his quote without a portrait.
  Send a larger photo and I will add it.

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
- Photos: the company's own photos are in `/images/`. A few pictures (energy, construction, aviation, ICT, the services page) are
  free Unsplash stock photos until you provide your own. To swap one, upload your file to `/public_html/images/` and in `config.js`
  change that key's `src` to `'images/your-file.jpg'`. Keys: `hero`, `co1`–`co6` (cards), `r1`–`r6` (services page), `a1`–`a3`, `n1`, `n2`.

## Step 4 – Test
1. Open https://cssgroup.com.ng (hard refresh: Ctrl+F5). The `.htaccess` forces HTTPS.
2. Click through every menu item (they switch pages without a full reload, that is normal).
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
- `index.html, about.html, companies.html, careers.html, contact.html` – the five pages
- `config.js` – phone/email/address and all photo links (one file to edit)
- `theme.css, base.css, fx*.css/js, engine.js, pjax.js` – design and behaviour (leave as is)
- `forms.php` – receives form posts, emails them, saves a copy, blocks spam (honeypot + 8 per hour per visitor)
- `.htaccess` – HTTPS, caching, blocks private files

## Content to review before going live
Text comes from your current website. Real estate and a few other descriptions were lightly rewritten; please read every page once.
