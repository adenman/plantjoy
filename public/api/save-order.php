<?php
// /api/save-order.php

require_once 'db.php'; // Your database connection
session_start(); // Start session to check for a logged-in user

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json');

    try {
        $jsonStr = file_get_contents('php://input');
        $data = json_decode($jsonStr, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON received for saving order.");
        }

        // --- THE CRUCIAL UPDATE IS HERE ---
        // Check if a user is logged in and get their ID
        $userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

        $paymentIntentId = $data['paymentIntentId'];
        $customerName = $data['customerName'];
        $customerEmail = $data['customerEmail'];
        $orderType = $data['orderType'];
        $deliveryAddress = $data['orderType'] === 'delivery' ? $data['address'] : ($data['orderType'] === 'pickup' ? $data['address'] : null);
        $zipCode = $data['zipCode'];
        $cartItemsJson = json_encode($data['cartItems']);
        $subtotal = $data['subtotal'];
        $tax = $data['tax'];
        $tip = $data['tip'];
        $totalAmount = $data['total'];
        
        // Updated INSERT statement to include the user_id
        $stmt = $conn->prepare(
            "INSERT INTO orders (user_id, stripe_payment_intent_id, customer_name, customer_email, order_type, delivery_address, zip_code, cart_items, subtotal, tax, tip, total_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'succeeded')"
        );
        
        // Updated bind_param: i=integer, s=string, d=decimal
        $stmt->bind_param("issssssdddds", 
            $userId,
            $paymentIntentId, 
            $customerName, 
            $customerEmail, 
            $orderType, 
            $deliveryAddress, 
            $zipCode, 
            $cartItemsJson, 
            $subtotal, 
            $tax, 
            $tip, 
            $totalAmount
        );

        if (!$stmt->execute()) {
             throw new Exception("Failed to save order to database: " . $stmt->error);
        }

        $stmt->close();
        $conn->close();

        echo json_encode(['status' => 'success', 'message' => 'Order saved successfully.']);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => ['message' => $e->getMessage()]]);
    }
}
?>