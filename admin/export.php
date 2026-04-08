<?php
require_once '../config/db.php';
require_once '../includes/auth.php';
require_role('admin');

// Export to CSV
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=ugc_it_tickets_' . date('Y-m-d') . '.csv');

$output = fopen('php://output', 'w');

// BOM for Excel Bengali support
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// Headers
fputcsv($output, [
    'Ticket Number', 'Year', 'Submission Date', 'Applicant Name', 'Designation', 
    'Department', 'Mobile', 'Hardware Items', 'Network Items', 'Software Items', 
    'Problem Description', 'Status', 'Assigned Officer', 'Service Provider', 
    'Service Description', 'Resolved Date'
]);

$stmt = $pdo->query("SELECT t.*, u.name as officer_name FROM tickets t LEFT JOIN users u ON t.assigned_officer_id = u.id ORDER BY t.created_at DESC");

while ($row = $stmt->fetch()) {
    $hw = implode(', ', json_decode($row['hardware_items'], true) ?: []);
    $nw = implode(', ', json_decode($row['network_items'], true) ?: []);
    $sw = implode(', ', json_decode($row['software_items'], true) ?: []);
    
    fputcsv($output, [
        $row['ticket_number'],
        $row['year'],
        $row['created_at'],
        $row['applicant_name_bn'] . ' (' . $row['applicant_name'] . ')',
        $row['designation_bn'],
        $row['department'],
        $row['mobile'],
        $hw,
        $nw,
        $sw,
        $row['problem_description'],
        $row['status'],
        $row['officer_name'],
        $row['service_provider_name'],
        $row['service_description'],
        $row['resolved_at']
    ]);
}

fclose($output);
exit();
