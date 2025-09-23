<?php
// This line includes your database connection and headers
require_once 'db.php';

// This code will now run automatically when the file is requested
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $cartItems = $data['PcartItems'];
    $tip = isset($data['tip']) ? floatval($data['tip']) : 0;

    $subtotal = 0;
    foreach ($cartItems as $item) {
        $subtotal += $item['price'];
    }

    $taxRate = 0.079; // 7.9% Milwaukee Sales Tax
    $tax = $subtotal * $taxRate;
    $total = $subtotal + $tax + $tip;

    // This is the only thing that should be output
    echo json_encode([
        'subtotal' => $subtotal,
        'tax' => $tax,
        'tip' => $tip,
        'total' => $total
    ]);
}

$conn->close();
?>