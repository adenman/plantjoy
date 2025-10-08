<?php
// /api/send_email.php

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to send emails.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'));

if (empty($data->email) || empty($data->name) || empty($data->template)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and template are required.']);
    exit;
}

$to = $data->email;
$name = $data->name;
$template = $data->template;
$custom_message = $data->message ?? null; // Get the custom message if it exists

$subject = '';
$message = '';
$headers = 'From: bookthebooth@theboothmke.com' . "\r\n" .
           'Reply-To: bookthebooth@theboothmke.com' . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

// --- Template Logic ---
switch ($template) {
    case 'Initial Inquiry':
        $subject = "Thanks for your interest in The Booth MKE!";
        $message = "Hi {$name},\n\nThank you for your inquiry about The Booth MKE for your event. We'd love to be a part of it!\n\nCould you tell us a bit more about what you're planning?\n\nBest,\nThe Booth MKE Team";
        break;
    
    case 'Proposal':
        $subject = "Your Proposal from The Booth MKE is Here!";
        $message = "Hi {$name},\n\nIt was great learning more about your event. Based on our conversation, I've attached a proposal for your review.\n\nPlease let us know if you have any questions. We're excited about the possibility of working with you.\n\nBest,\nThe Booth MKE Team";
        break;

    case 'Follow-up':
        $subject = "Following Up from The Booth MKE";
        $message = "Hi {$name},\n\nJust wanted to follow up on our recent conversation and see if you had a chance to review the proposal. Please let me know if you have any questions!\n\nWe're looking forward to hearing from you.\n\nBest,\nThe Booth MKE Team";
        break;

    case 'Event Reminder':
        $subject = "Your Event with The Booth MKE is Just Around the Corner!";
        $message = "Hi {$name},\n\nThis is a friendly reminder that your event is coming up soon! We are so excited to celebrate with you.\n\nWe'll be in touch a day or two before to confirm final details.\n\nBest,\nThe Booth MKE Team";
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email template specified.']);
        exit;
}

// --- USE CUSTOM MESSAGE IF PROVIDED ---
if (!empty($custom_message)) {
    // Replace placeholder with the client's name
    $message = str_replace('{{name}}', $name, $custom_message);
}

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => "Email sent successfully to {$to}."]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => "Failed to send email. Check server mail logs or hosting configuration."]);
}