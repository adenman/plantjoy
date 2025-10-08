<?php
// /api/reminders_api.php

date_default_timezone_set('America/Chicago');
require_once 'db.php';
header('Content-Type: application/json');
session_start();

// We keep the session check for security, even though it's triggered by the cron_trigger.
if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'Authentication required to run this script.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'This endpoint only accepts POST requests.']);
    exit;
}

$today = date('Y-m-d H:i:s');
$one_week_from_now = date('Y-m-d H:i:s', strtotime('+7 days'));

// --- QUERY UPDATED ---
// Now, it only selects bookings that are confirmed, in the next 7 days, AND have NOT had a reminder sent yet.
$stmt = $conn->prepare(
    "SELECT id, client_name, client_email, start_time, end_time, event_type, package, event_code 
     FROM Admin_Bookings 
     WHERE start_time >= ? AND start_time <= ? AND status = 'Confirmed' AND reminder_sent_at IS NULL"
);
$stmt->bind_param("ss", $today, $one_week_from_now);
$stmt->execute();
$result = $stmt->get_result();
$upcoming_bookings = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();

if (empty($upcoming_bookings)) {
    echo json_encode(['success' => true, 'message' => 'No new reminders to send.', 'sent_count' => 0, 'failed_count' => 0]);
    exit;
}

$sent_count = 0;
$failed_count = 0;
$log_messages = [];

foreach ($upcoming_bookings as $booking) {
    $to = $booking['client_email'];
    $name = $booking['client_name'];

    $start_date = date('l, F j, Y', strtotime($booking['start_time']));
    $start_time = date('g:i A', strtotime($booking['start_time']));
    $end_time = date('g:i A', strtotime($booking['end_time']));

    $subject = "Your Event with The Booth MKE is Just Around the Corner!";
    $headers = 'From: contact@theboothmke.com' . "\r\n" .
               'Reply-To: contact@theboothmke.com' . "\r\n" .
               'Content-Type: text/html; charset=UTF-8' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();
    
    $message = "
    <html><body>
        <p>Hi {$name},</p>
        <p>This is a friendly reminder that your event is just one week away! We are so excited to celebrate with you.</p>
        <p>Here are the details we have on file:</p>
        <ul>
            <li><strong>Event Type:</strong> {$booking['event_type']}</li>
            <li><strong>Date:</strong> {$start_date}</li>
            <li><strong>Time:</strong> {$start_time} - {$end_time}</li>
            <li><strong>Package:</strong> {$booking['package']}</li>
            " . ($booking['event_code'] ? "<li><strong>Event Code:</strong> {$booking['event_code']}</li>" : "") . "
        </ul>
        <p>If any of these details are incorrect, please let us know as soon as possible.</p>
        <p>We'll be in touch a day or two before the event to confirm final logistics.</p>
        <p>Best,<br>The Booth MKE Team</p>
    </body></html>";

    if (mail($to, $subject, $message, $headers)) {
        // --- UPDATE DATABASE ON SUCCESS ---
        // Log that the reminder was sent to prevent duplicates.
        $update_stmt = $conn->prepare("UPDATE Admin_Bookings SET reminder_sent_at = NOW() WHERE id = ?");
        $update_stmt->bind_param("i", $booking['id']);
        $update_stmt->execute();
        $update_stmt->close();
        
        $sent_count++;
        $log_messages[] = "Successfully sent reminder to {$to}.";
    } else {
        $failed_count++;
        $log_messages[] = "ERROR: Failed to send reminder to {$to}.";
    }
}

$conn->close();

$response_message = "Reminder process finished. Sent: {$sent_count}, Failed: {$failed_count}.";
echo json_encode(['success' => true, 'message' => $response_message, 'sent_count' => $sent_count, 'failed_count' => $failed_count, 'log' => $log_messages]);