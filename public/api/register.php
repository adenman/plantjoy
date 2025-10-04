<?php
// /api/register.php
require_once 'db.php';

// Make sure error reporting is on to catch everything
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'));

    // Use 'username' from the form, which corresponds to your 'name' state in React
    $username = $data->name; 
    $email = $data->email;
    $password = $data->password;

    if (empty($username) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username, email, and password are required.']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Prepare statement for the Admin_Users table
        $stmt = $conn->prepare("INSERT INTO Admin_Users (username, email, password, role) VALUES (?, ?, ?, ?)");

        if ($stmt === false) {
            throw new Exception('Prepare failed: ' . htmlspecialchars($conn->error));
        }

        // Set the default role for new users
        $role = 'user'; 
        
        // Bind parameters: s = string
        $stmt->bind_param("ssss", $username, $email, $passwordHash, $role);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registration successful.']);
        } else {
            // Check for duplicate email
            if ($conn->errno === 1062) {
                 throw new Exception('This email address is already registered.');
            }
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