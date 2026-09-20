<?php
// proxy.php - CORS Fix for Cobalt Tunnel
$url = $_GET['url']?? '';
if (!$url) { http_response_code(400); exit('No URL'); }

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_BUFFERSIZE, 256 * 1024);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0");
curl_setopt($ch, CURLOPT_REFERER, "https://www.youtube.com/");

header("Content-Type: video/mp4");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Disposition: inline; filename=\"video.mp4\"");

curl_exec($ch);
curl_close($ch);
