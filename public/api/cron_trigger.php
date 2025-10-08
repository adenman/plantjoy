<?php
// /api/cron_trigger.php
// This is a "poor man's cron" script. It's triggered by user visits.

header('Content-Type: application/json');

// Use a simple file to store the timestamp of the last run.
$last_run_file = 'cron_last_run.txt';
$time_since_last_run = 0;

// Check if the log file exists.
if (file_exists($last_run_file)) {
    $last_run_timestamp = (int)file_get_contents($last_run_file);
    $time_since_last_run = time() - $last_run_timestamp;
} else {
    // If the file doesn't exist, we should run it.
    $time_since_last_run = 86401; // Set to just over 24 hours to trigger the first run.
}

// 86400 seconds = 24 hours. Run if it's been longer than that.
if ($time_since_last_run > 86400) {
    // Update the timestamp file immediately to prevent race conditions
    // where multiple users trigger the script at the same time.
    file_put_contents($last_run_file, time());

    // --- Execute the reminder logic ---
    // We include the reminder script to run it in the same process.
    // This is more reliable than trying to call it via HTTP.
    
    // Mute the normal output of the script since we'll provide our own JSON response.
    ob_start();
    include 'reminders_api.php';
    $output = ob_get_clean(); // Get and clear the output buffer

    echo json_encode(['status' => 'triggered', 'message' => 'Reminder script was executed.', 'output' => $output]);

} else {
    // If it has not been 24 hours, do nothing.
    echo json_encode(['status' => 'skipped', 'message' => 'Reminder script has already run in the last 24 hours.']);
}

?>