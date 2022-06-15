<?php
require 'vendor/simple_html_dom.php';
include "globals.php";

$topic = $_GET['topic'];
if (!isset($_GET['topic'])) {
    echo "Provide ?topic param";
    exit(0);
}
$html = file_get_html($_BASE . $topic);
$listHTML = $html->find('#paperslist > li > a');
$items = array();
$contents = [];

foreach ($listHTML as $value) {
    $url = ($value->getAttribute("href")[0] === "/" ? $topic . $value->getAttribute("href") : $topic . '/' . $value->getAttribute("href"));
    $url = $url[-1] === "/" ? $url : $url . "/";
    $contents[] = array(
        "name" => $value->plaintext,
        "integer" => strlen($value->plaintext) === 4 ? (int)$value->plaintext : "Other Repository",
        "type" => strlen($value->plaintext) === 4 ? "YEAR" : "DIR",
        "slug" => $url,
        "url" => $_BASE . $url
    );
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($contents, JSON_PRETTY_PRINT);
