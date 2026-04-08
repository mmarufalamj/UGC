<?php
require_once '../includes/header.php';
require_role('admin');

$error = '';
$success = '';

// Add User
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_user'])) {
    $name = $_POST['name'];
    $name_bn = $_POST['name_bn'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = $_POST['role'];
    $dept_id = $_POST['department_id'];
    $designation = $_POST['designation'];
    $designation_bn = $_POST['designation_bn'];
    $mobile = $_POST['mobile'];

    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, name_bn, email, password_hash, role, department_id, designation, designation_bn, mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $name_bn, $email, $hash, $role, $dept_id, $designation, $designation_bn, $mobile]);
        $success = "ইউজার সফলভাবে যোগ করা হয়েছে।";
    } catch (Exception $e) {
        $error = "ত্রুটি: " . $e->getMessage();
    }
}

$users = $pdo->query("SELECT u.*, d.name_bn as dept_name FROM users u LEFT JOIN departments d ON u.department_id = d.id ORDER BY u.created_at DESC")->fetchAll();
$depts = $pdo->query("SELECT * FROM departments WHERE is_active = 1")->fetchAll();
?>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Add User Form -->
    <div class="bg-white p-6 rounded-lg shadow h-fit">
        <h3 class="text-lg font-bold mb-4 border-b pb-2">নতুন ইউজার যোগ করুন</h3>
        <?php if ($error): ?><div class="bg-red-100 p-2 mb-4 text-xs text-red-700"><?php echo $error; ?></div><?php endif; ?>
        <?php if ($success): ?><div class="bg-green-100 p-2 mb-4 text-xs text-green-700"><?php echo $success; ?></div><?php endif; ?>
        
        <form action="users.php" method="POST" class="space-y-4">
            <input type="hidden" name="add_user" value="1">
            <div>
                <label class="block text-xs font-bold text-gray-600">নাম (বাংলায়)</label>
                <input type="text" name="name_bn" required class="w-full border rounded px-2 py-1 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-600">Name (English)</label>
                <input type="text" name="name" required class="w-full border rounded px-2 py-1 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-600">ইমেইল</label>
                <input type="email" name="email" required class="w-full border rounded px-2 py-1 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-600">পাসওয়ার্ড</label>
                <input type="password" name="password" required class="w-full border rounded px-2 py-1 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-600">রোল (Role)</label>
                <select name="role" class="w-full border rounded px-2 py-1 text-sm">
                    <option value="employee">Employee</option>
                    <option value="ict_officer">ICT Officer</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-600">বিভাগ</label>
                <select name="department_id" class="w-full border rounded px-2 py-1 text-sm">
                    <?php foreach ($depts as $d): ?>
                        <option value="<?php echo $d['id']; ?>"><?php echo h($d['name_bn']); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <button type="submit" class="w-full bg-[#1a3a6b] text-white py-2 rounded font-bold text-sm hover:bg-blue-800 transition">ইউজার তৈরি করুন</button>
        </form>
    </div>

    <!-- User List -->
    <div class="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-bold">ইউজার তালিকা</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">নাম</th>
                        <th class="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">ইমেইল</th>
                        <th class="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">রোল</th>
                        <th class="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">বিভাগ</th>
                        <th class="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-sm">
                    <?php foreach ($users as $u): ?>
                    <tr>
                        <td class="px-4 py-2"><?php echo h($u['name_bn']); ?></td>
                        <td class="px-4 py-2"><?php echo h($u['email']); ?></td>
                        <td class="px-4 py-2">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold text-white <?php echo $u['role'] == 'admin' ? 'bg-purple-600' : ($u['role'] == 'ict_officer' ? 'bg-blue-600' : 'bg-gray-600'); ?>">
                                <?php echo strtoupper($u['role']); ?>
                            </span>
                        </td>
                        <td class="px-4 py-2"><?php echo h($u['dept_name']); ?></td>
                        <td class="px-4 py-2 text-right">
                            <button class="text-red-600 hover:text-red-900">ডিঅ্যাক্টিভেট</button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
