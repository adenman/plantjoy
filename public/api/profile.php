<?php
// /api/profile.php
require_once 'db.php';
session_start();

// Always send a JSON header, even for errors
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in.']);
    exit;
}

$userId = $_SESSION['user_id'];
$conn->set_charset('utf8mb4'); // Good practice to set charset

// --- GET Request: Fetch user data ---
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare("SELECT username, email FROM Admin_Users WHERE id = ?");
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    // Send username as 'name' for frontend consistency
    echo json_encode(['name' => $user['username'], 'email' => $user['email']]);
}

// --- POST Request: Update user data ---
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'));
    
    try {
        // Update Username and Email
        if (isset($data->name) && isset($data->email)) {
            $stmt = $conn->prepare("UPDATE Admin_Users SET username = ?, email = ? WHERE id = ?");
            if ($stmt === false) throw new Exception('SQL Prepare failed: ' . $conn->error);

            $stmt->bind_param("ssi", $data->name, $data->email, $userId);
            if (!$stmt->execute()) throw new Exception('Execute failed: ' . $stmt->error);
            
            $_SESSION['user_name'] = $data->name; // Update session
            echo json_encode(['success' => true, 'message' => 'Profile updated.']);
        }

        // Update Password
        else if (isset($data->currentPassword) && isset($data->newPassword)) {
            $stmt = $conn->prepare("SELECT password FROM Admin_Users WHERE id = ?");
            if ($stmt === false) throw new Exception('SQL Prepare failed: ' . $conn->error);

            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($user = $result->fetch_assoc()) {
                if (password_verify($data->currentPassword, $user['password'])) {
                    $newPasswordHash = password_hash($data->newPassword, PASSWORD_BCRYPT);
                    $updateStmt = $conn->prepare("UPDATE Admin_Users SET password = ? WHERE id = ?");
                    if ($updateStmt === false) throw new Exception('SQL Prepare failed: ' . $conn->error);

                    $updateStmt->bind_param("si", $newPasswordHash, $userId);
                    if (!$updateStmt->execute()) throw new Exception('Execute failed: ' . $updateStmt->error);

                    echo json_encode(['success' => true, 'message' => 'Password updated.']);
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'Incorrect current password.']);
                }
            }
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
    }
}
$conn->close();
?>