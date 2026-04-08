<?php
require_once '../includes/header.php';
require_role('admin');

// Filters
$status_filter = $_GET['status'] ?? '';
$dept_filter = $_GET['department'] ?? '';
$search = $_GET['search'] ?? '';

$query = "SELECT * FROM tickets WHERE 1=1";
$params = [];

if ($status_filter) {
    $query .= " AND status = ?";
    $params[] = $status_filter;
}
if ($dept_filter) {
    $query .= " AND department = ?";
    $params[] = $dept_filter;
}
if ($search) {
    $query .= " AND (ticket_number LIKE ? OR applicant_name LIKE ? OR applicant_name_bn LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$query .= " ORDER BY created_at DESC";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$tickets = $stmt->fetchAll();

$depts = $pdo->query("SELECT DISTINCT department FROM tickets")->fetchAll(PDO::FETCH_COLUMN);
?>

<div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800">সকল টিকিট (All Tickets)</h2>
        <div class="flex gap-2">
            <a href="export.php" class="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 transition">CSV এক্সপোর্ট</a>
            <a href="import.php" class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition">CSV ইমপোর্ট</a>
        </div>
    </div>

    <!-- Filters -->
    <div class="p-4 bg-gray-50 border-b">
        <form action="tickets.php" method="GET" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" name="search" value="<?php echo h($search); ?>" placeholder="টিকিট নম্বর / নাম..." class="px-3 py-2 border rounded text-sm">
            
            <select name="status" class="px-3 py-2 border rounded text-sm">
                <option value="">সকল স্ট্যাটাস</option>
                <option value="submitted" <?php echo $status_filter == 'submitted' ? 'selected' : ''; ?>>Submitted</option>
                <option value="received" <?php echo $status_filter == 'received' ? 'selected' : ''; ?>>Received</option>
                <option value="in_progress" <?php echo $status_filter == 'in_progress' ? 'selected' : ''; ?>>In Progress</option>
                <option value="resolved" <?php echo $status_filter == 'resolved' ? 'selected' : ''; ?>>Resolved</option>
                <option value="closed" <?php echo $status_filter == 'closed' ? 'selected' : ''; ?>>Closed</option>
            </select>

            <select name="department" class="px-3 py-2 border rounded text-sm">
                <option value="">সকল বিভাগ</option>
                <?php foreach ($depts as $d): ?>
                    <option value="<?php echo h($d); ?>" <?php echo $dept_filter == $d ? 'selected' : ''; ?>><?php echo h($d); ?></option>
                <?php endforeach; ?>
            </select>

            <button type="submit" class="bg-[#1a3a6b] text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-800 transition">ফিল্টার করুন</button>
        </form>
    </div>
    
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">টিকিট নম্বর</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">আবেদনকারী</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">বিভাগ</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অবস্থা</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <?php foreach ($tickets as $ticket): ?>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600"><?php echo h($ticket['ticket_number']); ?></td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><?php echo h($ticket['applicant_name_bn']); ?></td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo h($ticket['department']); ?></td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo date('d/m/Y', strtotime($ticket['created_at'])); ?></td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white <?php echo get_status_badge($ticket['status']); ?>">
                                <?php echo get_status_label($ticket['status']); ?>
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="../officer/update-ticket.php?id=<?php echo $ticket['id']; ?>" class="text-blue-600 hover:text-blue-900 mr-3">এডিট</a>
                            <a href="../employee/view-ticket.php?id=<?php echo $ticket['id']; ?>" class="text-gray-600 hover:text-gray-900">দেখুন</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
