<?php
require 'vendor/simple_html_dom.php';
include "globals.php";

$year = $_GET['year'];
if (!isset($_GET['year'])) {
    echo "Provide ?year param";
    exit(0);
}
$html = file_get_html($_BASE . $year);
$listHTML = $html->find('#paperslist > li.file,p');
$items = array();
$contents = []; //array
$sessions = [];
$current_session = "";
foreach ($listHTML as $value) {
    if ($value->tag === "p") $current_session = $value->plaintext;
    else if ($value->tag === "li") {
        $li = $value->find("a");
        $url = ($li->getAttribute("href")[0] === "/" ? $year . $li->getAttribute("href") : $year . '/' . $li->getAttribute("href"));
        $url = $url[-1] === "/" ? $url : $url . "/";
        $name_exploded = (explode("_", $li->plaintext));
        $contents[] = array(
            "@file"=> array(
                "name" => $li->plaintext,
                "location" => $_BASE . $url . $li->plaintext,
            ),
            "@meta" => array(
                "inferred" => array(
                    "session" => ($name_exploded[1])[0],
                    "year" => ($name_exploded[1])[1],
                    "paper_number" => ($name_exploded[-1])[0],
                    "variant_number" => ($name_exploded[-1])[1]
                )
            ),
            "type" => "DOCUMENT",
            "slug" => $url,
            "url" => $_BASE . $url
        );
    }
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($contents, JSON_PRETTY_PRINT);
