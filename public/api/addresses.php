<?php
// /api/addresses.php
require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in.']);
    exit;
}
$userId = $_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'));

// --- GET Request: Fetch addresses ---
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare("SELECT id, address_line1, city, state, zip_code FROM user_addresses WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $addresses = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($addresses);
}

// --- POST Request: Add new address ---
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $stmt = $conn->prepare("INSERT INTO user_addresses (user_id, address_line1, city, state, zip_code) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $userId, $data->address_line1, $data->city, $data->state, $data->zip_code);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add address.']);
    }
}

// --- DELETE Request: Remove address ---
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $addressId = basename($_SERVER['REQUEST_URI']);
    $stmt = $conn->prepare("DELETE FROM user_addresses WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $addressId, $userId);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete address.']);
    }
}
$conn->close();
?>