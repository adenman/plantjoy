<?php
// /api/debug_columns.php
require_once 'db.php'; // Use your existing database connection

echo "<h1>Debugging `users` Table Columns</h1>";
echo "<pre>"; // Makes the output easier to read

$sql = "SHOW COLUMNS FROM users";
$result = $conn->query($sql);

if ($result) {
    echo "Successfully queried the table. Here are the exact column names:\n\n";
    while($row = $result->fetch_assoc()) {
        // This will print the exact column name, including any hidden characters
        echo htmlspecialchars($row['Field']) . "\n";
    }
} else {
    echo "Error querying the database: " . htmlspecialchars($conn->error);
}

echo "</pre>";

$conn->close();
?>