<?php
header("Access-Control-Allow-Origin: *");

$item_id = isset($_GET["item_id"]) ? $_GET["item_id"] : "";
if (!$item_id) {
  http_response_code(400);
  echo json_encode([]);
  exit;
}

$url = "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/comments?item_id=" . urlencode($item_id);

$response = file_get_contents($url);
if ($response === false) {
  http_response_code(200);
  echo json_encode([]); // treat as empty
  exit;
}

echo $response;
