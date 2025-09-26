<?php
// /api/create-payment-intent.php

require_once __DIR__ . '/../vendor/autoload.php';

require_once 'config.php'; // 1. Include the new config file

// 2. Use the key from the config file
\Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY); 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json');

    try {
        \Stripe\Stripe::setApiKey($stripeSecretKey);

        $jsonStr = file_get_contents('php://input');
        $jsonObj = json_decode($jsonStr);

        if (json_last_error() !== JSON_ERROR_NONE) {
             throw new Exception("Invalid JSON received.");
        }
        
        // --- Calculate Totals ---
        $subtotal = 0;
        foreach ($jsonObj->items as $item) {
            $subtotal += $item->price;
        }
        $taxRate = (substr($jsonObj->zipCode, 0, 3) === '532' || substr($jsonObj->zipCode, 0, 3) === '531') ? 0.079 : 0.05;
        $tax = $subtotal * $taxRate;
        $total = $subtotal + $tax + floatval($jsonObj->tip);
        $amountInCents = round($total * 100);

        if ($amountInCents < 50) {
            throw new Exception("Order total must be at least $0.50.");
        }
        
        // --- Add Customer & Address Info to Stripe ---
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $amountInCents,
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
            'receipt_email' => $jsonObj->customerEmail, // For Stripe to email a receipt
            'shipping' => [ // You can use this for both delivery/pickup details
                'name' => $jsonObj->customerName,
                'address' => [
                    'line1' => $jsonObj->address,
                    'postal_code' => $jsonObj->zipCode,
                ],
            ],
            // Add metadata for your own reference
            'metadata' => [
                'order_type' => $jsonObj->orderType,
                'cart_items' => json_encode($jsonObj->items) // Store cart snapshot
            ]
        ]);

        echo json_encode(['clientSecret' => $paymentIntent->client_secret]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => ['message' => $e->getMessage()]]);
    }
}
?>