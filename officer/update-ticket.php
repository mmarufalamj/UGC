<?php
require_once '../includes/header.php';
require_role(['ict_officer', 'admin']);

$ticket_id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT * FROM tickets WHERE id = ?");
$stmt->execute([$ticket_id]);
$ticket = $stmt->fetch();

if (!$ticket) {
    die("টিকিট পাওয়া যায়নি।");
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'])) {
        $error = 'Invalid CSRF token.';
    } else {
        $status = $_POST['status'];
        $service_provider_name = $_POST['service_provider_name'];
        $service_provider_designation = $_POST['service_provider_designation'];
        $service_description = $_POST['service_description'];
        $officer_signed = isset($_POST['officer_signed']) ? 1 : 0;
        $deputy_director_signed = isset($_POST['deputy_director_signed']) ? 1 : 0;
        $additional_director_signed = isset($_POST['additional_director_signed']) ? 1 : 0;
        $director_signed = isset($_POST['director_signed']) ? 1 : 0;

        $resolved_at = ($status === 'resolved' || $status === 'closed') ? date('Y-m-d H:i:s') : $ticket['resolved_at'];
        $officer_signed_at = ($officer_signed && !$ticket['officer_signed']) ? date('Y-m-d H:i:s') : $ticket['officer_signed_at'];

        try {
            $stmt = $pdo->prepare("UPDATE tickets SET 
                status = ?, 
                service_provider_name = ?, 
                service_provider_designation = ?, 
                service_description = ?, 
                officer_signed = ?, 
                officer_signed_at = ?,
                deputy_director_signed = ?, 
                additional_director_signed = ?, 
                director_signed = ?, 
                assigned_officer_id = ?,
                resolved_at = ?
                WHERE id = ?");
            
            $stmt->execute([
                $status, $service_provider_name, $service_provider_designation, 
                $service_description, $officer_signed, $officer_signed_at,
                $deputy_director_signed, $additional_director_signed, $director_signed,
                $_SESSION['user_id'], $resolved_at, $ticket_id
            ]);

            $success = "টিকিটটি সফলভাবে আপডেট করা হয়েছে।";
            header("Refresh: 2; url=dashboard.php");
        } catch (Exception $e) {
            $error = "ত্রুটি: " . $e->getMessage();
        }
    }
}

$csrf_token = generate_csrf_token();
?>

<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800">টিকিট আপডেট (Update Ticket: <?php echo h($ticket['ticket_number']); ?>)</h2>
        <a href="../employee/view-ticket.php?id=<?php echo $ticket_id; ?>" target="_blank" class="text-blue-600 hover:underline text-sm">টিকিট প্রিভিউ দেখুন</a>
    </div>

    <?php if ($error): ?>
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"><?php echo $error; ?></div>
    <?php endif; ?>

    <?php if ($success): ?>
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"><?php echo $success; ?></div>
    <?php endif; ?>

    <form action="update-ticket.php?id=<?php echo $ticket_id; ?>" method="POST" class="space-y-8">
        <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
        
        <!-- Status Update -->
        <div class="bg-blue-50 p-4 rounded border border-blue-200">
            <label class="block text-sm font-bold text-blue-800 mb-2">টিকিট স্ট্যাটাস (Ticket Status)</label>
            <select name="status" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="submitted" <?php echo $ticket['status'] == 'submitted' ? 'selected' : ''; ?>>দাখিলকৃত (Submitted)</option>
                <option value="received" <?php echo $ticket['status'] == 'received' ? 'selected' : ''; ?>>গৃহীত (Received)</option>
                <option value="in_progress" <?php echo $ticket['status'] == 'in_progress' ? 'selected' : ''; ?>>চলমান (In Progress)</option>
                <option value="resolved" <?php echo $ticket['status'] == 'resolved' ? 'selected' : ''; ?>>সমাধানকৃত (Resolved)</option>
                <option value="closed" <?php echo $ticket['status'] == 'closed' ? 'selected' : ''; ?>>বন্ধ (Closed)</option>
            </select>
        </div>

        <!-- ICT Section -->
        <div class="space-y-6">
            <h3 class="font-bold text-lg border-b pb-2">আইসিটি বিভাগ কর্তৃক পূরণীয় (ICT Section)</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700">সেবা প্রদানকারীর নাম (Service Provider Name)</label>
                    <input type="text" name="service_provider_name" value="<?php echo h($ticket['service_provider_name'] ?: $_SESSION['name']); ?>" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">পদবী (Designation)</label>
                    <input type="text" name="service_provider_designation" value="<?php echo h($ticket['service_provider_designation']); ?>" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">সেবা প্রদান সংক্রান্ত তথ্য (Service Description)</label>
                <textarea name="service_description" rows="4" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"><?php echo h($ticket['service_description']); ?></textarea>
            </div>

            <!-- Digital Signatures -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border">
                <label class="flex flex-col items-center p-2 border rounded bg-white cursor-pointer hover:bg-blue-50 transition">
                    <input type="checkbox" name="officer_signed" value="1" <?php echo $ticket['officer_signed'] ? 'checked' : ''; ?> class="h-5 w-5 text-blue-600 mb-2">
                    <span class="text-xs font-bold">দায়িত্বপ্রাপ্ত কর্মকর্তা</span>
                </label>
                <label class="flex flex-col items-center p-2 border rounded bg-white cursor-pointer hover:bg-blue-50 transition">
                    <input type="checkbox" name="deputy_director_signed" value="1" <?php echo $ticket['deputy_director_signed'] ? 'checked' : ''; ?> class="h-5 w-5 text-blue-600 mb-2">
                    <span class="text-xs font-bold">উপ-পরিচালক</span>
                </label>
                <label class="flex flex-col items-center p-2 border rounded bg-white cursor-pointer hover:bg-blue-50 transition">
                    <input type="checkbox" name="additional_director_signed" value="1" <?php echo $ticket['additional_director_signed'] ? 'checked' : ''; ?> class="h-5 w-5 text-blue-600 mb-2">
                    <span class="text-xs font-bold">অতিরিক্ত পরিচালক</span>
                </label>
                <label class="flex flex-col items-center p-2 border rounded bg-white cursor-pointer hover:bg-blue-50 transition">
                    <input type="checkbox" name="director_signed" value="1" <?php echo $ticket['director_signed'] ? 'checked' : ''; ?> class="h-5 w-5 text-blue-600 mb-2">
                    <span class="text-xs font-bold">পরিচালক</span>
                </label>
            </div>
        </div>

        <div class="flex justify-end space-x-4 border-t pt-6">
            <a href="dashboard.php" class="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">বাতিল</a>
            <button type="submit" class="bg-[#1a3a6b] text-white px-8 py-2 rounded-md font-bold hover:bg-blue-800 transition shadow">সংরক্ষণ করুন (Save Changes)</button>
        </div>
    </form>
</div>

<?php require_once '../includes/footer.php'; ?>
