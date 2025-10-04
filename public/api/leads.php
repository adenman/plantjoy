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

// --- FIX IS HERE: Rewritten with a clear Switch statement to handle routing ---

switch ($method) {
    case 'GET':
        // Fetch all leads
        $stmt = $conn->prepare("SELECT id, name, email, phone, event_date, source, status, created_at, follow_up_date, notes FROM Admin_Leads ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        $leads = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($leads);
        $stmt->close();
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'));

        // Route to the "convert" logic if the action is set
        if ($action === 'convert') {
            $leadId = $data->id;
            if (empty($leadId)) {
                http_response_code(400);
                echo json_encode(['error' => 'Lead ID is required to convert.']);
                exit;
            }
            // Fetch lead data
            $leadStmt = $conn->prepare("SELECT name, email, phone, event_date, notes FROM Admin_Leads WHERE id = ?");
            $leadStmt->bind_param("i", $leadId);
            $leadStmt->execute();
            $lead = $leadStmt->get_result()->fetch_assoc();
            $leadStmt->close();

            if (!$lead || empty($lead['event_date'])) {
                http_response_code(404);
                echo json_encode(['error' => 'Lead not found or is missing an event date.']);
                exit;
            }
            // Insert into Admin_Bookings
            $bookingStmt = $conn->prepare("INSERT INTO Admin_Bookings (client_name, client_email, client_phone, start_time, end_time, event_type, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            $startTime = $lead['event_date'];
            $endTime = date('Y-m-d H:i:s', strtotime($startTime . ' +4 hours'));
            $bookingStmt->bind_param("ssssssss", $lead['name'], $lead['email'], $lead['phone'], $startTime, $endTime, 'Converted Lead', $lead['notes'], 'Confirmed');
            
            if ($bookingStmt->execute()) {
                echo json_encode(['success' => true, 'bookingId' => $conn->insert_id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create booking from lead: ' . $bookingStmt->error]);
            }
            $bookingStmt->close();
        } 
        // Default POST action is to add a new lead
        else {
            if (empty($data->name) || empty($data->email)) {
                http_response_code(400);
                echo json_encode(['error' => 'Name and Email are required for a new lead.']);
                exit;
            }
            $stmt = $conn->prepare("INSERT INTO Admin_Leads (name, email, phone, event_date, source, status, follow_up_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            $status = $data->status ?? 'New';
            $source = $data->source ?? 'Manual Entry';
            $stmt->bind_param("ssssssss", $data->name, $data->email, $data->phone, $data->event_date, $source, $status, $data->follow_up_date, $data->notes);
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
        // Update an existing lead
        $data = json_decode(file_get_contents('php://input'));
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Lead ID is required for an update.']);
            exit;
        }
        $stmt = $conn->prepare("UPDATE Admin_Leads SET name=?, email=?, phone=?, event_date=?, source=?, status=?, follow_up_date=?, notes=? WHERE id=?");
        $stmt->bind_param("ssssssssi", $data->name, $data->email, $data->phone, $data->event_date, $data->source, $data->status, $data->follow_up_date, $data->notes, $data->id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Lead updated successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update lead: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // Delete a lead
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