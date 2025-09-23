<?php
// Ensure no blank lines or spaces are before this line

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// These headers MUST be sent before any other output
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

// --- IMPORTANT: VERIFY THESE DETAILS IN YOUR BLUEHOST CPANEL ---
$servername = "localhost";
$username   = "ocbenjic_aden"; // This was in your error log.
$password   = "Xyzp9036!";    // Double-check the password for this specific user.
$dbname     = "ocbenjic_Aden";    // This was in your error log. Make sure this is the correct database.

// Use a try-catch block for better error handling
try {
    // Turn off error reporting temporarily to handle connection errors manually
    mysqli_report(MYSQLI_REPORT_OFF);

    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    // If connection fails, send a JSON error response and stop the script
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit(); // Stop the script immediately
}
?>