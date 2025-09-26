<?php
// /api/reheat.php

require_once 'db.php'; // Your database connection

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Note: We are selecting from the 'preheat' table you created
    $sql = "SELECT id, title, methods, notes FROM preheat ORDER BY title ASC";
    
    $result = $conn->query($sql);
    $items = [];
    
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    
    echo json_encode($items);
}

$conn->close();
?>