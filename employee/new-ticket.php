<?php
require_once '../includes/header.php';
require_role('employee');

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT u.*, d.name_bn as dept_name_bn FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE u.id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

$departments_stmt = $pdo->query("SELECT * FROM departments WHERE is_active = 1");
$departments = $departments_stmt->fetchAll();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'])) {
        $error = 'Invalid CSRF token.';
    } else {
        $applicant_name = $_POST['applicant_name'];
        $applicant_name_bn = $_POST['applicant_name_bn'];
        $designation = $_POST['designation'];
        $designation_bn = $_POST['designation_bn'];
        $department = $_POST['department'];
        $mobile = $_POST['mobile'];
        $problem_description = $_POST['problem_description'];
        
        $service_type = $_POST['service_type'] ?? [];
        $hardware_items = $_POST['hardware_items'] ?? [];
        $network_items = $_POST['network_items'] ?? [];
        $software_items = $_POST['software_items'] ?? [];
        $is_new_supply = $_POST['is_new_supply'] ?? [];

        // Generate Ticket Number: UGC-IT-YYYY-NNNN
        $year = date('Y');
        $count_stmt = $pdo->prepare("SELECT COUNT(*) FROM tickets WHERE year = ?");
        $count_stmt->execute([$year]);
        $count = $count_stmt->fetchColumn() + 1;
        $ticket_number = "UGC-IT-" . $year . "-" . str_pad($count, 4, '0', STR_PAD_LEFT);

        try {
            $stmt = $pdo->prepare("INSERT INTO tickets (
                ticket_number, year, applicant_user_id, applicant_name, applicant_name_bn, 
                designation, designation_bn, department, mobile, service_type, 
                hardware_items, network_items, software_items, is_new_supply, problem_description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $ticket_number, $year, $user_id, $applicant_name, $applicant_name_bn,
                $designation, $designation_bn, $department, $mobile, json_encode($service_type),
                json_encode($hardware_items), json_encode($network_items), json_encode($software_items), 
                json_encode($is_new_supply), $problem_description
            ]);

            $success = "আপনার টিকিটটি সফলভাবে দাখিল করা হয়েছে। টিকিট নম্বর: " . $ticket_number;
            header("Refresh: 3; url=dashboard.php");
        } catch (Exception $e) {
            $error = "ত্রুটি: " . $e->getMessage();
        }
    }
}

$csrf_token = generate_csrf_token();
?>

<div class="bg-white rounded-lg shadow p-6">
    <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-[#1a3a6b]">আইটি সেবা ফরম (IT Service Form)</h2>
        <p class="text-gray-600">বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরি কমিশন (UGC)</p>
    </div>

    <?php if ($error): ?>
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"><?php echo $error; ?></div>
    <?php endif; ?>

    <?php if ($success): ?>
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"><?php echo $success; ?></div>
    <?php endif; ?>

    <form action="new-ticket.php" method="POST" class="space-y-8">
        <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
        
        <!-- Applicant Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded border">
            <div class="col-span-2 font-bold border-b pb-2 mb-2">আবেদনকারীর তথ্য (Applicant Info)</div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700">নাম (বাংলায়)</label>
                <input type="text" name="applicant_name_bn" value="<?php echo h($user['name_bn']); ?>" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Name (English)</label>
                <input type="text" name="applicant_name" value="<?php echo h($user['name']); ?>" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">পদবী (বাংলায়)</label>
                <input type="text" name="designation_bn" value="<?php echo h($user['designation_bn']); ?>" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Designation (English)</label>
                <input type="text" name="designation" value="<?php echo h($user['designation']); ?>" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">বিভাগ/পর্যায় (Department)</label>
                <select name="department" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <?php foreach ($departments as $dept): ?>
                        <option value="<?php echo h($dept['name_bn']); ?>" <?php echo $user['dept_name_bn'] == $dept['name_bn'] ? 'selected' : ''; ?>>
                            <?php echo h($dept['name_bn']); ?> (<?php echo h($dept['name']); ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">মোবাইল (Mobile)</label>
                <input type="tel" name="mobile" value="<?php echo h($user['mobile']); ?>" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
        </div>

        <!-- Service Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Hardware -->
            <div class="border rounded p-4">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <label class="flex items-center font-bold text-blue-800">
                        <input type="checkbox" name="service_type[]" value="hardware" class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded">
                        হার্ডওয়্যার সাপোর্ট সেবা
                    </label>
                    <label class="text-xs flex items-center text-red-600 font-semibold">
                        <input type="checkbox" name="is_new_supply[hardware]" value="1" class="mr-1 h-3 w-3"> নতুন সরবরাহ
                    </label>
                </div>
                <div class="space-y-2 text-sm">
                    <?php 
                    $hw_items = ['পিসি/ডেস্কটপ', 'ল্যাপটপ', 'মনিটর', 'প্রিন্টার/স্ক্যানার', 'কীবোর্ড/মাউস', 'ইউপিএস', 'ট্যাব', 'এক্সটেনশন কর্ড', 'আইপি ফোন', 'অন্যান্য'];
                    foreach ($hw_items as $item): ?>
                    <label class="flex items-center">
                        <input type="checkbox" name="hardware_items[]" value="<?php echo $item; ?>" class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded">
                        <?php echo $item; ?>
                    </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Network -->
            <div class="border rounded p-4">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <label class="flex items-center font-bold text-blue-800">
                        <input type="checkbox" name="service_type[]" value="network" class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded">
                        নেটওয়ার্ক সাপোর্ট সেবা
                    </label>
                    <label class="text-xs flex items-center text-red-600 font-semibold">
                        <input type="checkbox" name="is_new_supply[network]" value="1" class="mr-1 h-3 w-3"> নতুন সরবরাহ
                    </label>
                </div>
                <div class="space-y-2 text-sm">
                    <?php 
                    $nw_items = ['ল্যান', 'ওয়াই-ফাই', 'সুইচ/রাউটার কনফিগার', 'ভিডিও কনফারেন্স', 'আইপি ক্যামেরা', 'সার্ভার/স্টোরেজ', 'সিকিউরিটি/ফায়ারওয়াল', 'কেবলিং/ক্রিম্পিং', 'অন্যান্য'];
                    foreach ($nw_items as $item): ?>
                    <label class="flex items-center">
                        <input type="checkbox" name="network_items[]" value="<?php echo $item; ?>" class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded">
                        <?php echo $item; ?>
                    </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Software -->
            <div class="border rounded p-4">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <label class="flex items-center font-bold text-blue-800">
                        <input type="checkbox" name="service_type[]" value="software" class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded">
                        সফটওয়্যার সাপোর্ট সেবা
                    </label>
                    <label class="text-xs flex items-center text-red-600 font-semibold">
                        <input type="checkbox" name="is_new_supply[software]" value="1" class="mr-1 h-3 w-3"> নতুন সরবরাহ
                    </label>
                </div>
                <div class="space-y-2 text-sm">
                    <?php 
                    $sw_items = ['ই-মেইল', 'ই-নথি', 'ই-জিপি', 'ওয়েবসাইট', 'ডোমেইন/হোস্টিং', 'অফিস সফটওয়্যার', 'ডিজিটাল সিগনেচার', 'অন্যান্য'];
                    foreach ($sw_items as $item): ?>
                    <label class="flex items-center">
                        <input type="checkbox" name="software_items[]" value="<?php echo $item; ?>" class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded">
                        <?php echo $item; ?>
                    </label>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Problem Description -->
        <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">সমস্যার বিবরণ (Problem Description) <span class="text-red-500">*</span></label>
            <textarea name="problem_description" rows="4" required class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."></textarea>
        </div>

        <!-- Submission -->
        <div class="flex items-center justify-between border-t pt-6">
            <div class="flex items-center">
                <input type="checkbox" id="confirm" required class="h-4 w-4 text-blue-600 border-gray-300 rounded">
                <label for="confirm" class="ml-2 block text-sm text-gray-900">আমি নিশ্চিত করছি যে উপরের তথ্যসমূহ সঠিক।</label>
            </div>
            <button type="submit" class="bg-[#1a3a6b] text-white px-8 py-3 rounded-md font-bold hover:bg-blue-800 transition shadow-lg">দাখিল করুন (Submit Request)</button>
        </div>
    </form>
</div>

<?php require_once '../includes/footer.php'; ?>
