<?php
// /api/check_session.php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'isLoggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'], // Corresponds to username
            'email' => $_SESSION['user_email'],
            'role' => $_SESSION['user_role'] // Add role to session check
        ]
    ]);
} else {
    echo json_encode(['isLoggedIn' => false]);
}
?>