<?php
require 'vendor/simple_html_dom.php';
include "globals.php";

$html = file_get_html($_BASE . "/");
$listHTML = $html->find('#paperslist > li > a');
$items = array();
$contents = [];

foreach ($listHTML as $value) {
    $url = ($value->getAttribute("href")[0] === "/" ? $value->getAttribute("href") : '/' . $value->getAttribute("href"));
    $url = $url[-1] === "/" ? $url : $url . "/";
    $contents[] = array(
        "name" => $value->plaintext,
        "type" => "CAT",
        "@type" => array("raw" => $value->getAttribute("class"), "mapping" => $_MAPPINGS['classes'][$value->getAttribute("class")] || null),
        "slug" => $url,
        "url" => $_BASE . $url
    );
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($contents, JSON_PRETTY_PRINT);
