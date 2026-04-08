<?php
require_once '../includes/header.php';
require_role('admin');

// Analytics Data
$total_tickets = $pdo->query("SELECT COUNT(*) FROM tickets")->fetchColumn();
$open_tickets = $pdo->query("SELECT COUNT(*) FROM tickets WHERE status IN ('submitted', 'received', 'in_progress')")->fetchColumn();
$resolved_month = $pdo->query("SELECT COUNT(*) FROM tickets WHERE status = 'resolved' AND MONTH(resolved_at) = MONTH(CURRENT_DATE)")->fetchColumn();
$total_users = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

// Tickets by Category (Hardware, Network, Software)
$categories = ['hardware', 'network', 'software'];
$cat_data = [];
foreach ($categories as $cat) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM tickets WHERE JSON_CONTAINS(service_type, ?)");
    $stmt->execute(['"' . $cat . '"']);
    $cat_data[$cat] = $stmt->fetchColumn();
}

// Recent Tickets
$recent_tickets = $pdo->query("SELECT * FROM tickets ORDER BY created_at DESC LIMIT 5")->fetchAll();
?>

<div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
            <p class="text-sm font-medium text-gray-500 uppercase">মোট টিকিট (Total)</p>
            <p class="text-3xl font-bold text-gray-900"><?php echo $total_tickets; ?></p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <p class="text-sm font-medium text-gray-500 uppercase">চলমান (Open/Pending)</p>
            <p class="text-3xl font-bold text-gray-900"><?php echo $open_tickets; ?></p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <p class="text-sm font-medium text-gray-500 uppercase">এই মাসে সমাধানকৃত</p>
            <p class="text-3xl font-bold text-gray-900"><?php echo $resolved_month; ?></p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-600">
            <p class="text-sm font-medium text-gray-500 uppercase">মোট ইউজার</p>
            <p class="text-3xl font-bold text-gray-900"><?php echo $total_users; ?></p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Category Distribution -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold text-gray-800 mb-4">সেবার ধরণ অনুযায়ী টিকিট (By Category)</h3>
            <div class="h-64 flex items-center justify-center">
                <canvas id="categoryChart"></canvas>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold text-gray-800 mb-4">সাম্প্রতিক টিকিটসমূহ (Recent Tickets)</h3>
            <div class="space-y-4">
                <?php foreach ($recent_tickets as $rt): ?>
                <div class="flex items-center justify-between border-b pb-2">
                    <div>
                        <p class="text-sm font-bold text-blue-600"><?php echo h($rt['ticket_number']); ?></p>
                        <p class="text-xs text-gray-500"><?php echo h($rt['applicant_name_bn']); ?> (<?php echo h($rt['department']); ?>)</p>
                    </div>
                    <span class="px-2 py-1 text-[10px] font-bold rounded-full text-white <?php echo get_status_badge($rt['status']); ?>">
                        <?php echo get_status_label($rt['status']); ?>
                    </span>
                </div>
                <?php endforeach; ?>
                <a href="tickets.php" class="block text-center text-sm text-blue-600 hover:underline mt-4">সকল টিকিট দেখুন</a>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const data = {
        labels: ['হার্ডওয়্যার', 'নেটওয়ার্ক', 'সফটওয়্যার'],
        datasets: [{
            data: [<?php echo $cat_data['hardware']; ?>, <?php echo $cat_data['network']; ?>, <?php echo $cat_data['software']; ?>],
            backgroundColor: ['#1a3a6b', '#3b82f6', '#93c5fd']
        }]
    };
    
    // Simple Vanilla JS Chart using Canvas (since we can't use Chart.js easily without CDN/npm)
    // For this demo, we'll just draw simple bars
    const canvas = document.getElementById('categoryChart');
    const c = canvas.getContext('2d');
    const values = data.datasets[0].data;
    const labels = data.labels;
    const colors = data.datasets[0].backgroundColor;
    const max = Math.max(...values, 1);
    
    canvas.width = 400;
    canvas.height = 200;
    
    const barWidth = 80;
    const spacing = 40;
    const startX = 50;
    
    values.forEach((val, i) => {
        const barHeight = (val / max) * 150;
        c.fillStyle = colors[i];
        c.fillRect(startX + (barWidth + spacing) * i, 180 - barHeight, barWidth, barHeight);
        
        c.fillStyle = '#000';
        c.font = '12px Arial';
        c.textAlign = 'center';
        c.fillText(labels[i], startX + (barWidth + spacing) * i + barWidth/2, 195);
        c.fillText(val, startX + (barWidth + spacing) * i + barWidth/2, 175 - barHeight);
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
