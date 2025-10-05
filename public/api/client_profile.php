<?php
// /api/client_profile.php
require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to view client profiles.']);
    exit;
}

$email = filter_input(INPUT_GET, 'email', FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'A valid client email is required.']);
    exit;
}

try {
    // --- FIX IS HERE: Query the correct Admin_Clients table first ---
    $profileStmt = $conn->prepare("SELECT name, email, phone FROM Admin_Clients WHERE email = ? LIMIT 1");
    $profileStmt->bind_param("s", $email);
    $profileStmt->execute();
    $profile = $profileStmt->get_result()->fetch_assoc();
    $profileStmt->close();

    // Fallback to bookings table if they weren't a lead/client first (e.g., manual entry)
    if (!$profile) {
        $profileStmt = $conn->prepare("SELECT client_name as name, client_email as email, client_phone as phone FROM Admin_Bookings WHERE client_email = ? LIMIT 1");
        $profileStmt->bind_param("s", $email);
        $profileStmt->execute();
        $profile = $profileStmt->get_result()->fetch_assoc();
        $profileStmt->close();
    }
    
    // Fetch all bookings associated with that client's email
    $bookingsStmt = $conn->prepare("SELECT id, event_type, status, start_time, end_time FROM Admin_Bookings WHERE client_email = ? ORDER BY start_time DESC");
    $bookingsStmt->bind_param("s", $email);
    $bookingsStmt->execute();
    $bookings = $bookingsStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $bookingsStmt->close();

    echo json_encode([
        'profile' => $profile,
        'bookings' => $bookings
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred while fetching the client profile: ' . $e->getMessage()]);
}

$conn->close();
?>