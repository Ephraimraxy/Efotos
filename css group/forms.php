<?php
// Form handler for cPanel hosting (replaces the Node server). Edit the two lines below.
$MAIL_TO   = 'info@cssgroup.com.ng';          // where enquiries are emailed
$MAIL_FROM = 'website@cssgroup.com.ng';       // must be a mailbox on your domain (improves delivery)

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }

$raw = file_get_contents('php://input');
if (strlen($raw) > 20000) { http_response_code(413); echo '{"ok":false}'; exit; }
$d = json_decode($raw, true);
if (!is_array($d)) { http_response_code(400); echo '{"ok":false}'; exit; }

// honeypot: bots fill the hidden "website" field; pretend it worked
if (!empty($d['website'])) { echo '{"ok":true}'; exit; }

function clean($v, $max = 2000) { $v = is_scalar($v) ? (string)$v : ''; $v = str_replace(["\r", "\0"], '', $v); return mb_substr(trim($v), 0, $max); }
$type  = preg_replace('/[^a-z0-9_-]/i', '', clean($d['type'] ?? 'form', 40));
$name  = clean($d['name'] ?? '', 120);
$email = clean($d['email'] ?? '', 160);
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); echo '{"ok":false,"error":"invalid"}'; exit; }

// simple rate limit: 8 submissions per IP per hour
$dir = __DIR__ . '/submissions';
if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
@file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
@file_put_contents($dir . '/index.html', '');
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0';
$rl = $dir . '/rl-' . md5($ip) . '.txt';
$now = time(); $hits = [];
if (is_file($rl)) { foreach (explode("\n", (string)@file_get_contents($rl)) as $t) { if ($t && $now - (int)$t < 3600) $hits[] = (int)$t; } }
if (count($hits) >= 8) { http_response_code(429); echo '{"ok":false,"error":"rate"}'; exit; }
$hits[] = $now; @file_put_contents($rl, implode("\n", $hits));

// collect all fields
$fields = [];
foreach ($d as $k => $v) { if (in_array($k, ['website', 'type'], true)) continue; $fields[clean($k, 40)] = clean($v); }
$record = ['time' => date('c'), 'type' => $type, 'ip' => $ip, 'fields' => $fields];
@file_put_contents($dir . '/forms.jsonl', json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n", FILE_APPEND | LOCK_EX);

// email notification
$body = "New website form: $type\nTime: " . date('Y-m-d H:i:s') . "\nIP: $ip\n\n";
foreach ($fields as $k => $v) { $body .= ucfirst($k) . ": " . $v . "\n"; }
$subject = 'Website enquiry – ' . $type . ' – ' . mb_substr($name, 0, 60);
$headers = "From: CSS Group Website <$MAIL_FROM>\r\nReply-To: " . str_replace(["\r", "\n"], '', $email) . "\r\nContent-Type: text/plain; charset=utf-8\r\n";
@mail($MAIL_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

echo '{"ok":true}';
