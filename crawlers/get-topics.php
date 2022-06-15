<?php
require 'vendor/simple_html_dom.php';
include "globals.php";

$cat = $_GET['cat'];
if (!isset($_GET['cat'])) {
    echo "Provide ?cat param";
    exit(0);
}
$html = file_get_html($_BASE . $cat);
$listHTML = $html->find('#paperslist > li > a');
$items = array();
$contents = [];

foreach ($listHTML as $value) {
    $url = ($value->getAttribute("href")[0] === "/" ? $cat . $value->getAttribute("href") : $cat . '/' . $value->getAttribute("href"));
    $url = $url[-1] === "/" ? $url : $url . "/";
    $contents[] = array(
        "name" => $value->plaintext,
        "@meta" => array(
            "name_full" => $value->plaintext,
            "name" => substr($value->plaintext, 0, -6),
            "code" => substr($value->plaintext, -5, -1)
        ),
        "type" => "TOPIC",
        "@type" => array("raw" => $value->getAttribute("class"), "mapping" => $_MAPPINGS['classes'][$value->getAttribute("class")] || null),
        "slug" => $url,
        "url" => $_BASE . $url
    );
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($contents, JSON_PRETTY_PRINT);
