<?php
// /api/send_email.php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to send emails.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$leadName = $data['name'] ?? 'Valued Customer';
$leadEmail = $data['email'] ?? '';
$templateName = $data['template'] ?? 'Unknown Template';

if (empty($leadEmail)) {
    http_response_code(400);
    echo json_encode(['error' => 'Lead email is missing.']);
    exit;
}

// --- Placeholder for Real Email Logic ---
// In a real application, you would integrate a service like SendGrid, Mailgun, or PHPMailer here.
// This prevents emails from going to spam, which is a common issue when sending from shared hosting.
// 
// Example using PHP's mail() function (for demonstration only - NOT recommended for production):
/*
    $to = $leadEmail;
    $subject = '';
    $message = '';
    $headers = 'From: yourcompany@yourdomain.com' . "\r\n" .
               'Reply-To: yourcompany@yourdomain.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    switch ($templateName) {
        case 'Initial Inquiry':
            $subject = 'Thank you for your inquiry with The Booth MKE!';
            $message = "Hi " . $leadName . ",\n\nThank you for reaching out to us. We've received your inquiry and will get back to you with package details shortly.\n\nBest,\nThe Booth MKE Team";
            break;
        case 'Follow-up':
            $subject = 'Following up from The Booth MKE';
            $message = "Hi " . $leadName . ",\n\nJust wanted to follow up on your recent inquiry. Please let us know if you have any questions about our photobooth packages.\n\nBest,\nThe Booth MKE Team";
            break;
        default:
            $subject = 'A message from The Booth MKE';
            $message = "Hi " . $leadName . ",\n\nThis is a message from The Booth MKE.\n\nBest,\nThe Booth MKE Team";
            break;
    }

    if(mail($to, $subject, $message, $headers)) {
        // Real success
    } else {
        // Real failure
    }
*/

// For now, we just simulate success without sending a real email.
// This allows you to build and test the frontend completely.
sleep(1); // Simulate network delay
echo json_encode(['success' => true, 'message' => "Email simulation successful. In a real app, an email would be sent to " . $leadEmail . " with the '" . $templateName . "' template."]);

?>