<?php
// /api/admin/menu.php
require_once '../db.php';
session_start();

// Security Check: Ensure user is logged in and is an admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'Access denied.']);
    exit;
}

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// POST: Create a new menu item
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $stmt = $conn->prepare("INSERT INTO Pmenu_items (name, price, image, type) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sdss", $data['name'], $data['price'], $data['image'], $data['type']);
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

// PUT: Update an existing menu item
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $stmt = $conn->prepare("UPDATE Pmenu_items SET name = ?, price = ?, image = ?, type = ? WHERE id = ?");
    $stmt->bind_param("sdssi", $data['name'], $data['price'], $data['image'], $data['type'], $data['id']);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

// DELETE: Delete a menu item
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $id = intval($_GET['id']);
    $stmt = $conn->prepare("DELETE FROM Pmenu_items WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

$conn->close();
?>