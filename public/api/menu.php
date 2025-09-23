<?php
// This line includes your database connection and headers
require_once 'db.php';

// This code will now run automatically when the file is requested
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM Pmenu_items";
    $result = $conn->query($sql);
    $items = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    // This is the only thing that should be output
    echo json_encode($items);
}

$conn->close();
?>