<?php
// /api/leads.php

require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to manage leads.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;
$data = json_decode(file_get_contents('php://input'));

if ($method == 'POST' && $action == 'convert') {
    handleLeadConversion($conn);
    exit;
}

if ($method == 'POST' && $action == 'bulk-import') {
    handleBulkImport($conn);
    exit;
}

switch ($method) {
    case 'GET':
        $stmt = $conn->prepare("SELECT id, name, email, phone, status, event_date, contact_date, follow_up_date, source, notes FROM Admin_Leads ORDER BY contact_date DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        $leads = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($leads);
        $stmt->close();
        break;

    case 'POST':
        if (empty($data->name) || empty($data->email)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and Email are required.']);
            exit;
        }
        $stmt = $conn->prepare("INSERT INTO Admin_Leads (name, email, phone, status, event_date, contact_date, follow_up_date, source, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $status = $data->status ?? 'New';
        $stmt->bind_param("sssssssss", $data->name, $data->email, $data->phone, $status, $data->event_date, $data->contact_date, $data->follow_up_date, $data->source, $data->notes);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add lead: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        if (empty($data->id)) { http_response_code(400); echo json_encode(['error' => 'Lead ID is required for updates.']); exit; }
        $stmt = $conn->prepare("UPDATE Admin_Leads SET name=?, email=?, phone=?, status=?, event_date=?, contact_date=?, follow_up_date=?, source=?, notes=? WHERE id=?");
        $stmt->bind_param("sssssssssi", $data->name, $data->email, $data->phone, $data->status, $data->event_date, $data->contact_date, $data->follow_up_date, $data->source, $data->notes, $data->id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update lead: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'A valid Lead ID is required.']);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM Admin_Leads WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Lead deleted successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete lead: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

$conn->close();

function handleLeadConversion($conn) {
    $data = json_decode(file_get_contents('php://input'));
    $lead = $data->lead;
    $booking = $data->booking;
    if (empty($lead) || empty($booking)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid lead or booking data provided.']);
        return;
    }
    $conn->begin_transaction();
    try {
        $client_id = null;
        $stmt = $conn->prepare("SELECT id FROM Admin_Clients WHERE email = ?");
        $stmt->bind_param("s", $lead->email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $client_id = $result->fetch_assoc()['id'];
        } else {
            $stmt = $conn->prepare("INSERT INTO Admin_Clients (name, email, phone, source, contact_date) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $lead->name, $lead->email, $lead->phone, $lead->source, $lead->contact_date);
            $stmt->execute();
            $client_id = $conn->insert_id;
        }
        $stmt->close();
        $stmt = $conn->prepare(
            "INSERT INTO Admin_Bookings (client_name, client_email, client_phone, package, status, start_time, end_time, event_type, notes, event_code, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
        );
        $booking_status = 'Confirmed';
        $event_code = $booking->event_code ?? null;
        $stmt->bind_param("ssssssssss", $lead->name, $lead->email, $lead->phone, $booking->package, $booking_status, $booking->start_time, $booking->end_time, $booking->event_type, $booking->notes, $event_code);
        $stmt->execute();
        $booking_id = $conn->insert_id;
        $stmt->close();
        $stmt = $conn->prepare("DELETE FROM Admin_Leads WHERE id = ?");
        $stmt->bind_param("i", $lead->id);
        $stmt->execute();
        $stmt->close();
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Lead converted successfully.', 'bookingId' => $booking_id]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Conversion failed: ' . $e->getMessage()]);
    }
}

// --- UPDATED FUNCTION for Bulk Import ---
function handleBulkImport($conn) {
    $data = json_decode(file_get_contents('php://input'));

    if (empty($data) || !is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or empty lead data provided.']);
        return;
    }

    $conn->begin_transaction();

    try {
        // Updated INSERT statement to include event_date
        $stmt = $conn->prepare("INSERT INTO Admin_Leads (name, email, phone, source, status, event_date) VALUES (?, ?, ?, ?, ?, ?)");
        
        $imported_count = 0;
        foreach ($data as $lead) {
            if (!empty($lead->name) && !empty($lead->email)) {
                $name = $lead->name;
                $email = $lead->email;
                $phone = $lead->phone ?? null;
                $source = $lead->source ?? 'File Import';
                $status = 'New';
                $event_date = $lead->event_date ?? null; // Get event_date
                
                // Updated bind_param to include event_date
                $stmt->bind_param("ssssss", $name, $email, $phone, $source, $status, $event_date);
                $stmt->execute();
                $imported_count++;
            }
        }
        
        $stmt->close();
        $conn->commit();
        echo json_encode(['success' => true, 'message' => "Successfully imported {$imported_count} leads into the database."]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Bulk import failed: ' . $e->getMessage()]);
    }
}

?>