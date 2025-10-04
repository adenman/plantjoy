<?php
// /api/login.php
require_once 'db.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'));
    
    $email = $data->email;
    $password = $data->password;

    // Select from the Admin_Users table
    $stmt = $conn->prepare("SELECT id, username, email, password, role FROM Admin_Users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            // Password is correct, store user data in session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['username']; // Use 'username' column
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role']; // Store role in session
            
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['username'], // Send username as 'name' for frontend consistency
                    'email' => $user['email'],
                    'role' => $user['role'] // Send role to frontend
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password.']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password.']);
    }
    $stmt->close();
    $conn->close();
}
?>