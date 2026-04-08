<?php
require_once '../config/db.php';
require_once '../includes/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit();
}

require_role(['ict_officer', 'admin']);

$action = $_POST['action'] ?? '';
$ticket_id = $_POST['ticket_id'] ?? 0;

if ($action === 'update_status') {
    $status = $_POST['status'] ?? '';
    if ($status && $ticket_id) {
        try {
            $stmt = $pdo->prepare("UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$status, $ticket_id]);
            echo json_encode(['success' => true, 'message' => 'Status updated successfully.']);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing parameters.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}
