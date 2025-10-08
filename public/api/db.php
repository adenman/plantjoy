<?php
// Ensure no blank lines or spaces are before this line

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$servername = "localhost";
$username   = "ocbenjic_YHTSAPP";
$password   = "god578aden";
$dbname     = "ocbenjic_YHTS_App";

try {
    mysqli_report(MYSQLI_REPORT_OFF);

    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");

} catch (Exception $e) {
    http_response_code(500);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit();
}

?>