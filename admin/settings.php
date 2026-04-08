<?php
require_once '../includes/header.php';
require_role('admin');

$error = '';
$success = '';

// Add Department
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_dept'])) {
    $name = $_POST['name'];
    $name_bn = $_POST['name_bn'];

    try {
        $stmt = $pdo->prepare("INSERT INTO departments (name, name_bn) VALUES (?, ?)");
        $stmt->execute([$name, $name_bn]);
        $success = "বিভাগ সফলভাবে যোগ করা হয়েছে।";
    } catch (Exception $e) {
        $error = "ত্রুটি: " . $e->getMessage();
    }
}

$depts = $pdo->query("SELECT * FROM departments ORDER BY name ASC")->fetchAll();
?>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg shadow h-fit">
        <h3 class="text-lg font-bold mb-4 border-b pb-2">নতুন বিভাগ যোগ করুন</h3>
        <?php if ($error): ?><div class="bg-red-100 p-2 mb-4 text-xs text-red-700"><?php echo $error; ?></div><?php endif; ?>
        <?php if ($success): ?><div class="bg-green-100 p-2 mb-4 text-xs text-green-700"><?php echo $success; ?></div><?php endif; ?>
        
        <form action="settings.php" method="POST" class="space-y-4">
            <input type="hidden" name="add_dept" value="1">
            <div>
                <label class="block text-xs font-bold text-gray-600">বিভাগের নাম (বাংলায়)</label>
                <input type="text" name="name_bn" required class="w-full border rounded px-2 py-1 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-600">Department Name (English)</label>
                <input type="text" name="name" required class="w-full border rounded px-2 py-1 text-sm">
            </div>
            <button type="submit" class="w-full bg-[#1a3a6b] text-white py-2 rounded font-bold text-sm hover:bg-blue-800 transition">বিভাগ তৈরি করুন</button>
        </form>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-bold">বিভাগ তালিকা</h3>
        </div>
        <div class="overflow-y-auto max-h-[500px]">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">বিভাগ (বাংলা)</th>
                        <th class="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">বিভাগ (English)</th>
                        <th class="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase">অবস্থা</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-sm">
                    <?php foreach ($depts as $d): ?>
                    <tr>
                        <td class="px-4 py-2"><?php echo h($d['name_bn']); ?></td>
                        <td class="px-4 py-2"><?php echo h($d['name']); ?></td>
                        <td class="px-4 py-2 text-right">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold text-white <?php echo $d['is_active'] ? 'bg-green-600' : 'bg-red-600'; ?>">
                                <?php echo $d['is_active'] ? 'Active' : 'Inactive'; ?>
                            </span>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
