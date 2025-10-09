<?php
// /api/bookings.php

require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to manage bookings.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'));

switch ($method) {
    case 'GET':
        $stmt = $conn->prepare("SELECT id, client_name, client_email, client_phone, package, status, start_time, end_time, event_type, notes, created_at FROM Admin_Bookings ORDER BY start_time ASC");
        $stmt->execute();
        $result = $stmt->get_result();
        $bookingsData = $result->fetch_all(MYSQLI_ASSOC);
        
        $bookings = [];
        foreach ($bookingsData as $booking) {
            if (!empty($booking['start_time'])) $booking['start_time'] = date('c', strtotime($booking['start_time']));
            if (!empty($booking['end_time'])) $booking['end_time'] = date('c', strtotime($booking['end_time']));
            $bookings[] = $booking;
        }
        echo json_encode($bookings);
        $stmt->close();
        break;

    case 'POST':
        // Logic for adding a new booking
        if (empty($data->event_type) || empty($data->start_time) || empty($data->end_time) || empty($data->client_name)) {
            http_response_code(400);
            echo json_encode(['error' => 'Event Type, Start Time, End Time, and Client Name are required.']);
            exit;
        }
        $stmt = $conn->prepare("INSERT INTO Admin_Bookings (client_name, client_email, client_phone, package, status, start_time, end_time, event_type, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $status = $data->status ?? 'Confirmed';
        $stmt->bind_param("sssssssss", $data->client_name, $data->client_email, $data->client_phone, $data->package, $status, $data->start_time, $data->end_time, $data->event_type, $data->notes);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add booking: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Logic for updating a booking
        if (empty($data->id)) { /* ... */ }
        $stmt = $conn->prepare("UPDATE Admin_Bookings SET client_name=?, client_email=?, client_phone=?, package=?, status=?, start_time=?, end_time=?, event_type=?, notes=? WHERE id=?");
        $stmt->bind_param("sssssssssi", $data->client_name, $data->client_email, $data->client_phone, $data->package, $data->status, $data->start_time, $data->end_time, $data->event_type, $data->notes, $data->id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update booking: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // --- NEW: Logic for deleting a booking ---
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'A valid Booking ID is required.']);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM Admin_Bookings WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Booking deleted successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete booking: ' . $stmt->error]);
        }
        $stmt->close();
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

$conn->close();
?>