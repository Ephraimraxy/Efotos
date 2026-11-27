<?php
// Settings for the admin panel. Edit only if the guide tells you to.
return [
    // Folder of the PUBLIC website (the one that contains index.html). cPanel default for your account:
    'site_root'     => '/home/cssgroup/public_html',
    'site_url'      => 'https://cssgroup.com.ng',
    'cookie_domain' => '.cssgroup.com.ng',
    // Secret that lets the admin preview the site while maintenance mode is on. Must match the website's .htaccess.
    'preview_token' => '__PREVIEW_TOKEN__',
    'timezone'      => 'Africa/Lagos',
    'idle_minutes'  => 60,      // automatic sign-out after this many idle minutes
    'max_image_px'  => 2000,    // photos are resized so the longest side is at most this
    'max_video_mb'  => 100,     // largest video you may upload (also limited by the server)
    'force_https'   => true,
];
