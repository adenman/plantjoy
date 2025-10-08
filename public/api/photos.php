<?php
// /api/photos.php

require_once 'db.php';
header('Content-Type: application/json');
session_start();

// 1. Authentication Check
if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to view photos.']);
    exit;
}

// 2. Ensure it's a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// 3. Get and validate the event_code from query parameter
// --- CORRECTION IS HERE ---
// Replaced deprecated FILTER_SANITIZE_STRING with a modern, secure equivalent.
$event_code_raw = filter_input(INPUT_GET, 'event_code', FILTER_UNSAFE_RAW);
$event_code = $event_code_raw ? htmlspecialchars($event_code_raw, ENT_QUOTES, 'UTF-8') : null;


if (!$event_code) {
    http_response_code(400);
    echo json_encode(['error' => 'An event_code is required.']);
    exit;
}

// 4. Prepare and execute the database query
$stmt = $conn->prepare("SELECT id, event_code, base_filename, bordered_photo_path, borderless_photo_path, created_at FROM `Photo Links` WHERE event_code = ? ORDER BY created_at ASC");
$stmt->bind_param("s", $event_code);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    $photos = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($photos);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch photos: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>