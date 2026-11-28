<?php
// Run once from the cPanel Terminal:  php ~/cssgroup-admin/app/install_switch.php
// Registers the new website and installs the website-switch rules in public_html/.htaccess.
// The OLD site stays live until you press "Make live" in the admin (Websites). Safe to run again.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/lib.php';
if (!is_dir(root_dir())) { fwrite(STDERR, "Main web folder not found: " . root_dir() . "\n"); exit(1); }
if (!is_dir(site_root())) { fwrite(STDERR, "New site folder not found: " . site_root() . "\n"); exit(1); }
@chmod(sites_dir(), 0755);
if (!site_register(managed_id(), 'New CSS Group website')) { fwrite(STDERR, "Could not register the new website.\n"); exit(1); }
if (!switch_install()) { fwrite(STDERR, "Could not write " . root_dir() . "/.htaccess\n"); exit(1); }
echo "Switch rules installed. Visitors see: " . (live_id() ? site_label((string)live_id()) : 'the OLD site') . "\n";
