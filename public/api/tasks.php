<?php
// /api/tasks.php
require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to manage tasks.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'));

switch ($method) {
    case 'GET':
        // Join with Admin_Users to get assignee and assigner names
        $stmt = $conn->prepare("
            SELECT 
                t.id, t.task_name, t.status, t.date_assigned, t.date_to_complete, t.completion_date, t.notes,
                assignee.id as assigned_to_id,
                assignee.username as assigned_to_name,
                assigner.username as assigned_by_name
            FROM 
                Admin_Tasks t
            LEFT JOIN Admin_Users assignee ON t.assigned_to = assignee.id
            LEFT JOIN Admin_Users assigner ON t.assigned_by = assigner.id
            ORDER BY t.date_to_complete ASC
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        $tasks = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($tasks);
        break;

    case 'POST':
        if (empty($data->task_name) || empty($data->assigned_to)) {
            http_response_code(400);
            echo json_encode(['error' => 'Task Name and Assignee are required.']);
            exit;
        }
        $stmt = $conn->prepare("INSERT INTO Admin_Tasks (task_name, assigned_to, assigned_by, notes, date_to_complete, date_assigned, status) VALUES (?, ?, ?, ?, ?, NOW(), 'Pending')");
        $assigned_by = $_SESSION['user_id'];
        $stmt->bind_param("siiss", $data->task_name, $data->assigned_to, $assigned_by, $data->notes, $data->date_to_complete);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add task: ' . $stmt->error]);
        }
        break;

    case 'PUT':
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Task ID is required for an update.']);
            exit;
        }
        
        // --- FIX IS HERE ---
        // If status is 'Completed' set completion date. 
        // If status is NOT 'Completed', ensure completion date is NULL.
        $completion_date = null;
        if ($data->status === 'Completed') {
            // Only set the date if it's not already set
            $completion_date = $data->completion_date ?: date('Y-m-d H:i:s');
        }

        $stmt = $conn->prepare("UPDATE Admin_Tasks SET task_name=?, assigned_to=?, notes=?, date_to_complete=?, status=?, completion_date=? WHERE id=?");
        $stmt->bind_param("sissssi", $data->task_name, $data->assigned_to, $data->notes, $data->date_to_complete, $data->status, $completion_date, $data->id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Task updated successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update task: ' . $stmt->error]);
        }
        break;

    case 'DELETE':
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'A valid Task ID is required.']);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM Admin_Tasks WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete task: ' . $stmt->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

$conn->close();
?>