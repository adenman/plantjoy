<?php
// /api/invoices.php
require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to manage invoices.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'));

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $invoiceId = $_GET['id'];
            $invoiceStmt = $conn->prepare("SELECT * FROM Admin_Invoices WHERE id = ?");
            $invoiceStmt->bind_param("i", $invoiceId);
            $invoiceStmt->execute();
            $invoice = $invoiceStmt->get_result()->fetch_assoc();
            
            if ($invoice) {
                $itemsStmt = $conn->prepare("SELECT * FROM Admin_Invoice_Items WHERE invoice_id = ?");
                $itemsStmt->bind_param("i", $invoiceId);
                $itemsStmt->execute();
                $items = $itemsStmt->get_result()->fetch_all(MYSQLI_ASSOC);
                $invoice['items'] = $items;
            }
            
            echo json_encode($invoice);

        } else if (isset($_GET['lead_id'])) {
             $leadId = $_GET['lead_id'];
             $stmt = $conn->prepare("SELECT * FROM Admin_Invoices WHERE lead_id = ? ORDER BY invoice_date DESC");
             $stmt->bind_param("i", $leadId);
             $stmt->execute();
             $invoices = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
             echo json_encode($invoices);

        } else if (isset($_GET['client_id'])) {
             $clientId = $_GET['client_id'];
             $stmt = $conn->prepare("SELECT * FROM Admin_Invoices WHERE client_id = ? ORDER BY invoice_date DESC");
             $stmt->bind_param("i", $clientId);
             $stmt->execute();
             $invoices = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
             echo json_encode($invoices);
        }
        break;

    case 'POST':
        if (empty($data->client_name) || empty($data->items)) {
            http_response_code(400);
            echo json_encode(['error' => 'Client name and line items are required.']);
            exit;
        }

        $conn->begin_transaction();
        try {
            $invoiceStmt = $conn->prepare("INSERT INTO Admin_Invoices (lead_id, client_id, client_name, client_email, invoice_date, due_date, total_amount, notes, status) VALUES (?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), ?, ?, 'Draft')");
            if (!$invoiceStmt) throw new Exception('Prepare failed (invoice): ' . $conn->error);

            $leadId = $data->lead_id ?? null;
            $clientId = $data->client_id ?? null;
            $total = $data->total_amount ?? 0;
            
            $invoiceStmt->bind_param("iissss", $leadId, $clientId, $data->client_name, $data->client_email, $total, $data->notes);
            $invoiceStmt->execute();
            $invoiceId = $conn->insert_id;

            $itemStmt = $conn->prepare("INSERT INTO Admin_Invoice_Items (invoice_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?)");
            if (!$itemStmt) throw new Exception('Prepare failed (items): ' . $conn->error);
            foreach ($data->items as $item) {
                $itemTotal = $item->quantity * $item->unit_price;
                $itemStmt->bind_param("isidd", $invoiceId, $item->description, $item->quantity, $item->unit_price, $itemTotal);
                $itemStmt->execute();
            }

            if ($leadId) {
                $updateLeadStmt = $conn->prepare("UPDATE Admin_Leads SET invoice_created = TRUE WHERE id = ?");
                $updateLeadStmt->bind_param("i", $leadId);
                $updateLeadStmt->execute();
            }
            
            $conn->commit();
            echo json_encode(['success' => true, 'id' => $invoiceId, 'message' => 'Invoice created successfully.']);
        } catch (Exception $e) {
            $conn->rollback();
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create invoice: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invoice ID is required for an update.']);
            exit;
        }
        $invoiceId = $data->id;

        $conn->begin_transaction();
        try {
            // Update the main invoice details
            $stmt = $conn->prepare("UPDATE Admin_Invoices SET due_date = ?, total_amount = ?, amount_paid = ?, status = ?, notes = ? WHERE id = ?");
            if (!$stmt) throw new Exception('Prepare failed (invoice update): ' . $conn->error);

            $stmt->bind_param("sddssi", $data->due_date, $data->total_amount, $data->amount_paid, $data->status, $data->notes, $invoiceId);
            $stmt->execute();

            // Replace the line items
            $deleteStmt = $conn->prepare("DELETE FROM Admin_Invoice_Items WHERE invoice_id = ?");
            if (!$deleteStmt) throw new Exception('Prepare failed (item delete): ' . $conn->error);
            $deleteStmt->bind_param("i", $invoiceId);
            $deleteStmt->execute();

            $itemStmt = $conn->prepare("INSERT INTO Admin_Invoice_Items (invoice_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?)");
            if (!$itemStmt) throw new Exception('Prepare failed (item insert): ' . $conn->error);
            foreach ($data->items as $item) {
                $itemTotal = $item->quantity * $item->unit_price;
                $itemStmt->bind_param("isidd", $invoiceId, $item->description, $item->quantity, $item->unit_price, $itemTotal);
                $itemStmt->execute();
            }

            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Invoice updated successfully.']);
        } catch (Exception $e) {
            $conn->rollback();
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update invoice: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

$conn->close();
?>