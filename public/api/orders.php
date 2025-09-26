<?php
// /api/orders.php

require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'User not logged in.']);
    exit;
}

header('Content-Type: application/json');
$userId = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare(
        "SELECT id, order_date, total_amount, cart_items, payment_status 
         FROM Porders 
         WHERE user_id = ? 
         ORDER BY order_date DESC"
    );

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to prepare SQL query.']);
        exit;
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $orders = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($orders);
    
    $stmt->close();
    $conn->close();
}
?>