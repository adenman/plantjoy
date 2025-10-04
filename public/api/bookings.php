<?php
// /api/bookings.php

require_once 'db.php';
header('Content-Type: application/json');
session_start();

// GET: Fetch all bookings
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare("SELECT id, client_name, client_email, client_phone, venue, package, status, start_time, end_time, event_type, notes FROM Admin_Bookings ORDER BY start_time DESC");
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to prepare SQL query for fetching bookings.']);
        exit;
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $bookings = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($bookings);
    
    $stmt->close();
}

// POST: Add a new event
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // A simple check for admin, you might want more robust role management later
    if (!isset($_SESSION['user_id'])) { // For now, let any logged-in user add events
        http_response_code(403);
        echo json_encode(['error' => 'You must be logged in to add a booking.']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'));

    if (empty($data->event_type) || empty($data->start_time) || empty($data->end_time) || empty($data->client_name)) {
        http_response_code(400);
        echo json_encode(['error' => 'Event Type, Start Time, End Time, and Client Name are required.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO Admin_Bookings (client_name, client_email, client_phone, venue, package, status, start_time, end_time, event_type, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to prepare SQL query for adding an event.']);
        exit;
    }

    $status = $data->status ?? 'Lead';

    $stmt->bind_param("ssssssssss", 
        $data->client_name, 
        $data->client_email, 
        $data->client_phone, 
        $data->venue, 
        $data->package, 
        $status, 
        $data->start_time,
        $data->end_time, 
        $data->event_type, 
        $data->notes
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add event: ' . $stmt->error]);
    }
    
    $stmt->close();
}

$conn->close();
?>