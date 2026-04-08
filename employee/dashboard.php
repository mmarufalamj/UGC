<?php
require_once '../includes/header.php';
require_role('employee');

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT * FROM tickets WHERE applicant_user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user_id]);
$tickets = $stmt->fetchAll();
?>

<div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">আমার টিকিটসমূহ (My Tickets)</h2>
        <a href="new-ticket.php" class="bg-[#1a3a6b] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-800 transition">নতুন টিকিট খুলুন</a>
    </div>
    
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">টিকিট নম্বর</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">সেবার ধরণ</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অবস্থা (Status)</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <?php if (empty($tickets)): ?>
                    <tr>
                        <td colspan="5" class="px-6 py-10 text-center text-gray-500">কোন টিকিট পাওয়া যায়নি।</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($tickets as $ticket): ?>
                        <?php 
                            $service_types = json_decode($ticket['service_type'], true) ?: [];
                            $type_labels = [
                                'hardware' => 'হার্ডওয়্যার',
                                'network' => 'নেটওয়ার্ক',
                                'software' => 'সফটওয়্যার'
                            ];
                            $display_types = array_map(fn($t) => $type_labels[$t] ?? $t, $service_types);
                        ?>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600"><?php echo h($ticket['ticket_number']); ?></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo date('d/m/Y', strtotime($ticket['created_at'])); ?></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo implode(', ', $display_types); ?></td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white <?php echo get_status_badge($ticket['status']); ?>">
                                    <?php echo get_status_label($ticket['status']); ?>
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="view-ticket.php?id=<?php echo $ticket['id']; ?>" class="text-[#1a3a6b] hover:text-blue-900 mr-3">দেখুন</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
