<?php
// /api/clients.php
require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to manage clients.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'));

switch ($method) {
    case 'GET':
        $sql = "
            SELECT 
                c.*, 
                (SELECT COUNT(b.id) FROM Admin_Bookings b WHERE b.client_email = c.email) as booking_count
            FROM 
                Admin_Clients c 
            ORDER BY 
                c.name ASC
        ";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            http_response_code(500);
            echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
            exit;
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $clients = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($clients);
        $stmt->close();
        break;

    case 'POST':
        if (empty($data->name) || empty($data->email)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and Email are required.']);
            exit;
        }
        $stmt = $conn->prepare("INSERT INTO Admin_Clients (name, email, phone, source, contact_date) VALUES (?, ?, ?, ?, ?)");
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("sssss", $data->name, $data->email, $data->phone, $data->source, $data->contact_date);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add client: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Client ID is required for an update.']);
            exit;
        }
        $stmt = $conn->prepare("UPDATE Admin_Clients SET name=?, email=?, phone=?, source=?, contact_date=? WHERE id=?");
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("sssssi", $data->name, $data->email, $data->phone, $data->source, $data->contact_date, $data->id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update client: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    // --- FIX IS HERE: Added DELETE case ---
    case 'DELETE':
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'A valid Client ID is required.']);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM Admin_Clients WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Client deleted successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete client: ' . $stmt->error]);
        }
        $stmt->close();
        break;
}

$conn->close();
?>