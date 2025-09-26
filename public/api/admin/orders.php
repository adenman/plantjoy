<?php
// /api/admin/orders.php
require_once '../db.php';
session_start();

// Always send a JSON header, even for errors
header('Content-Type: application/json');

// Security Check
if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        // This is the query to check against your database structure
        $stmt = $conn->prepare(
            "SELECT id, order_date, customer_name, customer_email, order_type, delivery_address, total_amount, cart_items 
             FROM Porders 
             ORDER BY order_date DESC"
        );

        // If prepare() fails, it's a structural problem with the SQL (bad table/column name)
        if ($stmt === false) {
            throw new Exception('SQL Prepare failed: ' . htmlspecialchars($conn->error));
        }
        
        if (!$stmt->execute()) {
             throw new Exception('SQL Execute failed: ' . htmlspecialchars($stmt->error));
        }

        $result = $stmt->get_result();
        $orders = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode($orders);
        
        $stmt->close();

    } catch (Exception $e) {
        // This will catch the database error and send it back as clean JSON
        http_response_code(500);
        echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
    }
    
    $conn->close();
}
?>