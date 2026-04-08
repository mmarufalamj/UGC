<?php
require_once '../includes/header.php';
require_role('admin');

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['csv_file'])) {
    $file = $_FILES['csv_file']['tmp_name'];
    if ($file) {
        $handle = fopen($file, "r");
        fgetcsv($handle); // Skip header
        
        $count = 0;
        $pdo->beginTransaction();
        try {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                // Example simplified import logic
                // In a real app, you'd validate each column
                $count++;
            }
            $pdo->commit();
            $success = "$count টি রেকর্ড সফলভাবে প্রসেস করা হয়েছে। (সিমুলেটেড)";
        } catch (Exception $e) {
            $pdo->rollBack();
            $error = "ত্রুটি: " . $e->getMessage();
        }
        fclose($handle);
    }
}
?>

<div class="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto">
    <h2 class="text-xl font-bold mb-6 border-b pb-2">CSV ইমপোর্ট (Bulk Ticket Import)</h2>
    
    <?php if ($error): ?><div class="bg-red-100 p-4 mb-4 text-red-700"><?php echo $error; ?></div><?php endif; ?>
    <?php if ($success): ?><div class="bg-green-100 p-4 mb-4 text-green-700"><?php echo $success; ?></div><?php endif; ?>

    <form action="import.php" method="POST" enctype="multipart/form-data" class="space-y-6">
        <div class="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg hover:border-blue-500 transition">
            <input type="file" name="csv_file" id="csv_file" accept=".csv" class="hidden">
            <label for="csv_file" class="cursor-pointer">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p class="text-sm text-gray-600">CSV ফাইলটি এখানে ড্র্যাগ করুন অথবা ক্লিক করে সিলেক্ট করুন</p>
                <p class="text-xs text-gray-400 mt-2">ফাইল ফরম্যাট: .csv (UTF-8)</p>
            </label>
        </div>

        <div class="flex justify-center">
            <button type="submit" class="bg-[#1a3a6b] text-white px-8 py-2 rounded font-bold hover:bg-blue-800 transition">ইমপোর্ট শুরু করুন</button>
        </div>
    </form>

    <div class="mt-8 bg-blue-50 p-4 rounded text-xs text-blue-800">
        <p class="font-bold mb-2">নির্দেশনাঃ</p>
        <ul class="list-disc list-inside space-y-1">
            <li>ফাইলটি অবশ্যই CSV ফরম্যাটে হতে হবে।</li>
            <li>প্রথম লাইনটি হেডার হিসেবে গণ্য করা হবে।</li>
            <li>বাংলা টেক্সট ঠিক রাখতে ফাইলটি UTF-8 এনকোডিং এ সেভ করুন।</li>
        </ul>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
