<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$input = json_decode(file_get_contents("php://input"), true);

$url = "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/comments";

$options = [
  "http" => [
    "header"  => "Content-Type: application/json\r\n",
    "method"  => "POST",
    "content" => json_encode($input)
  ]
];

$context  = stream_context_create($options);
$response = file_get_contents($url, false, $context);

echo $response;
