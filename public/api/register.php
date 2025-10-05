<?php
// /api/register.php
require_once 'db.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'));

    $username = $data->name; 
    $email = $data->email;
    $password = $data->password;

    if (empty($username) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username, email, and password are required.']);
        exit;
    }

    try {
        // --- FIX IS HERE: Proactively check if the email already exists ---
        $checkStmt = $conn->prepare("SELECT id FROM Admin_Users WHERE email = ?");
        if ($checkStmt === false) {
            throw new Exception('Prepare failed (check): ' . htmlspecialchars($conn->error));
        }
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows > 0) {
            // If we found a user, throw the specific error.
            throw new Exception('This email address is already registered.');
        }
        $checkStmt->close();

        // If the email is not found, proceed with creating the new user
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        
        $stmt = $conn->prepare("INSERT INTO Admin_Users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
        if ($stmt === false) {
            throw new Exception('Prepare failed (insert): ' . htmlspecialchars($conn->error));
        }

        $role = 'user'; 
        
        $stmt->bind_param("ssss", $username, $email, $passwordHash, $role);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registration successful.']);
        } else {
            throw new Exception('Execute failed: ' . htmlspecialchars($stmt->error));
        }
        $stmt->close();
        
    } catch (Exception $e) {
        http_response_code(400); // Use 400 for client errors like duplicate emails
        echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
    }
    
    $conn->close();
}
?>