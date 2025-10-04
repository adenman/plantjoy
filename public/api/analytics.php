<?php
// /api/analytics.php
require_once 'db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) { 
    http_response_code(403);
    echo json_encode(['error' => 'You must be logged in to view analytics.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        // 1. Total Active Leads (not 'Won' or 'Lost')
        $activeResult = $conn->query("SELECT COUNT(id) as total FROM Admin_Leads WHERE status NOT IN ('Won', 'Lost')");
        $totalActiveLeads = $activeResult->fetch_assoc()['total'];

        // 2. New Leads This Month
        $newThisMonthResult = $conn->query("SELECT COUNT(id) as total FROM Admin_Leads WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())");
        $newLeadsThisMonth = $newThisMonthResult->fetch_assoc()['total'];

        // 3. Conversion Rate (Won / (Won + Lost))
        $wonResult = $conn->query("SELECT COUNT(id) as total FROM Admin_Leads WHERE status = 'Won'");
        $totalWon = $wonResult->fetch_assoc()['total'];

        $lostResult = $conn->query("SELECT COUNT(id) as total FROM Admin_Leads WHERE status = 'Lost'");
        $totalLost = $lostResult->fetch_assoc()['total'];

        $conversionRate = 0;
        if (($totalWon + $totalLost) > 0) {
            $conversionRate = round(($totalWon / ($totalWon + $totalLost)) * 100);
        }

        echo json_encode([
            'totalActiveLeads' => $totalActiveLeads,
            'newLeadsThisMonth' => $newLeadsThisMonth,
            'conversionRate' => $conversionRate
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'An error occurred while fetching analytics: ' . $e->getMessage()]);
    }
    
    $conn->close();
}
?>