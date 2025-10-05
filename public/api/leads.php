<?php
// /api/leads.php
require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

switch ($method) {
    case 'GET':
        $stmt = $conn->prepare("
            SELECT 
                l.*, 
                (SELECT COUNT(b.id) FROM Admin_Bookings b WHERE b.client_email = l.email) as booking_count
            FROM 
                Admin_Leads l 
            ORDER BY 
                l.created_at DESC
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        $leads = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($leads);
        $stmt->close();
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'));

        if ($action === 'convert') {
            $bookingData = $data->booking;
            $leadData = $data->lead;
            $leadId = $leadData->id;

            if (empty($leadId) || empty($bookingData->start_time) || empty($bookingData->end_time)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing data for conversion.']);
                exit;
            }

            // 1. Insert into Admin_Clients
            $clientStmt = $conn->prepare("INSERT INTO Admin_Clients (name, email, phone, source, contact_date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone)");
            $clientStmt->bind_param("sssss", $leadData->name, $leadData->email, $leadData->phone, $leadData->source, $leadData->contact_date);
            
            if ($clientStmt->execute()) {
                $clientStmt->close();

                // 2. Insert into Admin_Bookings
                $bookingStmt = $conn->prepare("INSERT INTO Admin_Bookings (client_name, client_email, client_phone, start_time, end_time, event_type, package, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
                $status = 'Confirmed';
                $bookingStmt->bind_param("sssssssss", $leadData->name, $leadData->email, $leadData->phone, $bookingData->start_time, $bookingData->end_time, $bookingData->event_type, $bookingData->package, $bookingData->notes, $status);

                if ($bookingStmt->execute()) {
                    $bookingId = $conn->insert_id;
                    $bookingStmt->close();

                    // 3. Delete the original lead
                    $deleteStmt = $conn->prepare("DELETE FROM Admin_Leads WHERE id = ?");
                    $deleteStmt->bind_param("i", $leadId);
                    $deleteStmt->execute();
                    $deleteStmt->close();

                    echo json_encode(['success' => true, 'bookingId' => $bookingId]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to create booking: ' . $bookingStmt->error]);
                }
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create client from lead: ' . $clientStmt->error]);
            }
        } 
        else {
            if (empty($data->name) || empty($data->email)) {
                http_response_code(400);
                echo json_encode(['error' => 'Name and Email are required for a new lead.']);
                exit;
            }
            $stmt = $conn->prepare("INSERT INTO Admin_Leads (name, email, phone, event_date, source, contact_date, status, follow_up_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            if (!$stmt) {
                 http_response_code(500);
                 echo json_encode(['error' => 'SQL Prepare failed: ' . $conn->error]);
                 exit;
            }
            $status = $data->status ?? 'New';
            $source = $data->source ?? 'Manual Entry';
            $stmt->bind_param("sssssssss", $data->name, $data->email, $data->phone, $data->event_date, $source, $data->contact_date, $status, $data->follow_up_date, $data->notes);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $conn->insert_id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to add lead: ' . $stmt->error]);
            }
            $stmt->close();
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Lead ID is required for an update.']);
            exit;
        }
        $stmt = $conn->prepare("UPDATE Admin_Leads SET name=?, email=?, phone=?, event_date=?, source=?, contact_date=?, status=?, follow_up_date=?, notes=? WHERE id=?");
        if (!$stmt) {
             http_response_code(500);
             echo json_encode(['error' => 'SQL Prepare failed: ' . $conn->error]);
             exit;
        }
        $stmt->bind_param("sssssssssi", $data->name, $data->email, $data->phone, $data->event_date, $data->source, $data->contact_date, $data->status, $data->follow_up_date, $data->notes, $data->id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Lead updated successfully.']);
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
?>