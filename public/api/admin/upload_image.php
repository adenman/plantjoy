<?php
// /api/admin/upload_image.php
session_start();

// Security Check: Ensure user is logged in and is an admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied.']);
    exit;
}

header('Content-Type: application/json');

if (isset($_FILES['menuImage'])) {
    $file = $_FILES['menuImage'];
    
    // File validation
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, and WEBP are allowed.']);
        exit;
    }

    $uploadDir = '../../uploads/'; // Relative path to the uploads folder
    // Create a unique filename to prevent overwriting
    $filename = uniqid() . '-' . basename($file['name']);
    $uploadPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        // IMPORTANT: The URL must be the public-facing path to the image
        $fileUrl = '/plantjoy/uploads/' . $filename;
        echo json_encode(['success' => true, 'filePath' => $fileUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded.']);
}
?>