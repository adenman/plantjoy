<?php
// /api/register.php
require_once __DIR__ . '/../vendor/autoload.php';
require_once 'db.php';
require_once 'config.php';
// Make sure error reporting is on to catch everything
ini_set('display_errors', 1);
error_reporting(E_ALL);
 // 1. Include the new config file

// 2. Use the key from the config file
\Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);  // Your Stripe Secret Key

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'));

    $name = $data->name;
    $email = $data->email;
    $password = $data->password;

    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required.']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    try {
        \Stripe\Stripe::setApiKey($stripeSecretKey);
        $customer = \Stripe\Customer::create(['email' => $email, 'name' => $name]);
        $stripeCustomerId = $customer->id;

        // --- THE FIX IS HERE ---
        // Added the `is_admin` column to the INSERT statement
        $stmt = $conn->prepare("INSERT INTO Pusers (name, email, password, stripe_customer_id, is_admin) VALUES (?, ?, ?, ?, ?)");

        if ($stmt === false) {
            throw new Exception('Prepare failed: ' . htmlspecialchars($conn->error));
        }

        // Set the default value for is_admin to 0
        $isAdmin = 0; 
        
        // Updated bind_param with 5 parameters (s for string, i for integer)
        $stmt->bind_param("ssssi", $name, $email, $passwordHash, $stripeCustomerId, $isAdmin);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registration successful.']);
        } else {
            throw new Exception('Execute failed: ' . htmlspecialchars($stmt->error));
        }
        $stmt->close();
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
    }
    
    $conn->close();
}
?>