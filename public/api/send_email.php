<?php
// /api/send_email.php

// 1. Load PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Make sure the path is correct for your file structure
require_once 'Exception.php';
require_once 'PHPMailer.php';
require_once 'SMTP.php';

header('Content-Type: application/json');
session_start();

// 2. Security and Input Validation
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
$subject = $data['subject'] ?? 'A message from The Booth MKE';
$message = $data['message'] ?? ''; // Get custom message from request

if (empty($leadEmail) || !filter_var($leadEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'A valid lead email is required.']);
    exit;
}

// 3. Email Content Generation
// If a custom message was not provided, generate one from the template name
if (empty($message)) {
    switch ($templateName) {
        case 'Initial Inquiry':
            $message = "
                <p>Hi " . htmlspecialchars($leadName) . ",</p>
                <p>Thank you for your interest in The Booth MKE! We're excited to help make your event unforgettable with our unique, high-tech photo booth experience.</p>
                <p>We've received your request and will be reviewing the details shortly. You can expect a follow-up from us within 24-48 hours to discuss packages and availability.</p>
                <p>In the meantime, feel free to browse our services at <a href='https://theboothmke.com'>theboothmke.com</a>.</p>
                <br>
                <p>Best regards,</p>
                <p>
                    <strong>The Booth MKE Team</strong><br>
                    <a href='https://theboothmke.com'>theboothmke.com</a>
                </p>
            ";
            break;

        case 'Wedding Expo':
            $message = "
                <p>Hi " . htmlspecialchars($leadName) . ",</p>
                <p>It was great to see you at the <strong>Wedding Expo 2025</strong> in September! We're here to make your vision for your special day a reality. Since you expressed interest in a photo booth, I wanted to follow up with details on how The Booth MKE can bring a unique, high-tech experience to your celebration using our 3D, greenscreen, and AI technology.</p>
                <p>Here is the essential information you need to bring The Booth MKE to your wedding:</p>
                
                <h3>Our Standard Booth Package</h3>
                <p>We have a minimum of 3 hours per event. For a 3-hour event, our Standard Booth Package is <strong>$900</strong>.</p>
                <p>This all-inclusive package gives your guests an unforgettable experience:</p>
                <ul>
                    <li>A large 10x15' booth setup for comfort.</li>
                    <li>48 3D backgrounds for a massive variety of fun, high-quality photo options.</li>
                    <li>Unlimited 4x6 prints for all your guests to take home a physical memory.</li>
                    <li>A friendly and professional booth attendant to ensure every photo session runs smoothly.</li>
                </ul>

                <h3>Customization to Match Your Theme</h3>
                <p>Want your photos to perfectly match your wedding colors or theme? We offer an optional <strong>$200 customization fee</strong>.</p>
                <p>This fee includes custom borders and backgrounds where you can collaborate directly with our background specialist to ensure every print is perfectly tailored to your event.</p>

                <h3>Setup & Booking Details</h3>
                <p>We make the setup seamless so you don't have to worry about a thing!</p>
                <p><strong>Setup Requirements:</strong></p>
                <ul>
                    <li>We typically arrive 30–45 minutes before the event starts to set up completely.</li>
                    <li>We need a 10x10' or 10x15' space and one standard electrical outlet.</li>
                    <li>We can set up either inside or outside with our standard or tent setup, depending on your venue.</li>
                </ul>
                <p><strong>Booking & Payment:</strong></p>
                <ul>
                    <li>To reserve your date, please visit <a href='https://theboothmke.com'>theboothmke.com</a> and fill out the booking form.</li>
                    <li>We require a 50% non-refundable deposit to secure your date, which will be invoiced to you.</li>
                    <li>The remaining balance is due one month before your event.</li>
                </ul>
                <p>We know how much planning goes into a wedding, and we're here to help make the entertainment easy and unique.</p>
                <br>
                <p>Best regards,</p>
                <p>
                    <strong>Aden Neal</strong><br>
                    The Booth MKE<br>
                    <a href='https://theboothmke.com'>theboothmke.com</a>
                </p>
            ";
            break;

        case 'Event Details':
            $message = "
                <p>Hi " . htmlspecialchars($leadName) . ",</p>
                <p>Thank you for your interest in The Booth MKE! We're here to make your vision for your special day a reality. I wanted to follow up with details on how we can bring a unique, high-tech experience to your celebration using our 3D, greenscreen, and AI technology.</p>
                <p>Here is the essential information you need to bring The Booth MKE to your event:</p>
                
                <h3>Our Standard Booth Package</h3>
                <p>We have a minimum of 3 hours per event. For a 3-hour event, our Standard Booth Package is <strong>$900</strong>.</p>
                <p>This all-inclusive package gives your guests an unforgettable experience:</p>
                <ul>
                    <li>A large 10x15' booth setup for comfort.</li>
                    <li>48 3D backgrounds for a massive variety of fun, high-quality photo options.</li>
                    <li>Unlimited 4x6 prints for all your guests to take home a physical memory.</li>
                    <li>A friendly and professional booth attendant to ensure every photo session runs smoothly.</li>
                </ul>

                <h3>Customization to Match Your Theme</h3>
                <p>Want your photos to perfectly match your event's colors or theme? We offer an optional <strong>$200 customization fee</strong>.</p>
                <p>This fee includes custom borders and backgrounds where you can collaborate directly with our background specialist to ensure every print is perfectly tailored to your event.</p>

                <h3>Setup & Booking Details</h3>
                <p>We make the setup seamless so you don't have to worry about a thing!</p>
                <p><strong>Setup Requirements:</strong></p>
                <ul>
                    <li>We typically arrive 30–45 minutes before the event starts to set up completely.</li>
                    <li>We need a 10x10' or 10x15' space and one standard electrical outlet.</li>
                    <li>We can set up either inside or outside with our standard or tent setup, depending on your venue.</li>
                </ul>
                <p><strong>Booking & Payment:</strong></p>
                <ul>
                    <li>To reserve your date, please visit <a href='https://theboothmke.com'>theboothmke.com</a> and fill out the booking form.</li>
                    <li>We require a 50% non-refundable deposit to secure your date, which will be invoiced to you.</li>
                    <li>The remaining balance is due one month before your event.</li>
                </ul>
                <p>We know how much planning goes into an event, and we're here to help make the entertainment easy and unique.</p>
                <br>
                <p>Best regards,</p>
                <p>
                    <strong>Aden Neal</strong><br>
                    The Booth MKE<br>
                    <a href='https://theboothmke.com'>theboothmke.com</a>
                </p>
            ";
            break;
            
        case 'Package Details':
            $message = "
                <p>Hi " . htmlspecialchars($leadName) . ",</p>
                <p>Thank you for your interest in The Booth MKE! Here are the details of our standard package which offers a unique, high-tech experience for any celebration.</p>
                
                <h3>Our Standard Booth Package - $900</h3>
                <p>This package is for a 3-hour event and includes everything needed for an unforgettable experience:</p>
                <ul>
                    <li><strong>A 10x15' tent setup or a 10x10' booth setup</strong> for comfort and group photos.</li>
                    <li><strong>48 3D backgrounds</strong> for a massive variety of fun, high-quality options.</li>
                    <li><strong>Unlimited 4x6 prints</strong> for all your guests to take home a physical memory.</li>
                    <li><strong>A friendly and professional booth attendant</strong> to ensure everything runs smoothly.</li>
                </ul>

                <h3>Optional Add-ons</h3>
                <ul>
                    <li><strong>Customization ($200):</strong> Custom borders and backgrounds to perfectly match your event's theme.</li>
                    <li><strong>Additional Hours:</strong> Contact us for a quote on extending the fun!</li>
                </ul>
                
                <p>To reserve your date, please visit <a href='https://theboothmke.com'>theboothmke.com</a> and fill out the booking form. Let us know if you have any questions!</p>
                <br>
                <p>Best regards,</p>
                <p>
                    <strong>The Booth MKE Team</strong><br>
                    <a href='https://theboothmke.com'>theboothmke.com</a>
                </p>
            ";
            break;

        case 'Follow-up':
            $message = "
                <p>Hi " . htmlspecialchars($leadName) . ",</p>
                <p>I hope you're having a great week. I'm just quickly following up on your inquiry about a photo booth for your event. We'd be thrilled to be a part of it!</p>
                <p>Do you have any questions about our packages, or is there any more information I can provide to help with your decision? We're happy to chat about customization options or how we can best fit into your special day.</p>
                <p>If you're ready to move forward, you can secure your date by filling out the booking form on our website: <a href='https://theboothmke.com'>theboothmke.com</a>.</p>
                <p>We look forward to hearing from you!</p>
                <br>
                <p>Best regards,</p>
                <p>
                    <strong>The Booth MKE Team</strong><br>
                    <a href='https://theboothmke.com'>theboothmke.com</a>
                </p>
            ";
            break;
            
        default:
            $message = "<p>Hi " . htmlspecialchars($leadName) . ",</p><p>This is a message from The Booth MKE.</p><p>Best,<br>The Booth MKE Team</p>";
            break;
    }
}

// 4. PHPMailer Setup and Sending
$mail = new PHPMailer(true);

try {
    // --- Server Settings ---
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'ben@theboothmke.com';
    $mail->Password   = 'mzjqvbaevxoyoxle';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // --- Recipients & Addresses ---
    $mail->setFrom('ben@theboothmke.com', 'The Booth MKE');
    $mail->addAddress($leadEmail, $leadName);
    $mail->addReplyTo('bookthebooth@theboothmke.com', 'The Booth MKE Team');

    // --- Content ---
    $mail->isHTML(true);
    $mail->Subject = $subject;
    
    // Convert plain text newlines from textarea to HTML breaks
    $mail->Body    = nl2br($message);
    $mail->AltBody = strip_tags($message); // Create a plain-text version

    $mail->send();
    echo json_encode(['success' => true, 'message' => "Email successfully sent to " . $leadEmail]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}

?>