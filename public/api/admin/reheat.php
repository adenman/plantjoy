<?php
// /api/admin/reheat.php
require_once '../db.php';
session_start();

// Security Check
if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied.']);
    exit;
}

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// POST: Create a new reheat item
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $stmt = $conn->prepare("INSERT INTO preheat (title, methods, notes) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $data['title'], $data['methods'], $data['notes']);
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

// PUT: Update an existing reheat item
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $stmt = $conn->prepare("UPDATE preheat SET title = ?, methods = ?, notes = ? WHERE id = ?");
    $stmt->bind_param("sssi", $data['title'], $data['methods'], $data['notes'], $data['id']);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

// DELETE: Delete a reheat item
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $id = intval($_GET['id']);
    $stmt = $conn->prepare("DELETE FROM preheat WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

$conn->close();
?>