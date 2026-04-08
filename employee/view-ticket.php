<?php
require_once '../includes/header.php';
require_role(['employee', 'ict_officer', 'admin']);

$ticket_id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT t.*, u.name as officer_name, u.name_bn as officer_name_bn FROM tickets t LEFT JOIN users u ON t.assigned_officer_id = u.id WHERE t.id = ?");
$stmt->execute([$ticket_id]);
$ticket = $stmt->fetch();

if (!$ticket) {
    die("টিকিট পাওয়া যায়নি।");
}

// Check if employee is viewing their own ticket
if ($_SESSION['role'] === 'employee' && $ticket['applicant_user_id'] != $_SESSION['user_id']) {
    die("অননুমোদিত অ্যাক্সেস।");
}

$service_type = json_decode($ticket['service_type'], true) ?: [];
$hw_items = json_decode($ticket['hardware_items'], true) ?: [];
$nw_items = json_decode($ticket['network_items'], true) ?: [];
$sw_items = json_decode($ticket['software_items'], true) ?: [];
$is_new_supply = json_decode($ticket['is_new_supply'], true) ?: [];
?>

<div class="no-print mb-6 flex justify-between items-center">
    <a href="dashboard.php" class="text-blue-600 hover:underline flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        ড্যাশবোর্ডে ফিরে যান
    </a>
    <button onclick="window.print()" class="bg-[#1a3a6b] text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        প্রিন্ট করুন (Print)
    </button>
</div>

<!-- Ticket Form Layout (Print Ready) -->
<div class="ticket-container bg-white p-8 shadow-lg mx-auto max-w-[210mm] border border-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div class="w-20 h-20 border-2 border-black flex items-center justify-center font-bold text-xs text-center p-1">
            UGC LOGO
        </div>
        <div class="text-center flex-1">
            <h1 class="text-xl font-bold"><?php echo ORG_NAME_BN; ?></h1>
            <h2 class="text-lg font-semibold"><?php echo ORG_NAME_EN; ?></h2>
            <p class="text-sm"><?php echo ORG_ADDRESS_BN; ?></p>
            <p class="text-sm">Website: <?php echo ORG_WEBSITE; ?></p>
            <div class="mt-2 inline-block border-2 border-black px-4 py-1 font-bold text-lg">
                আইটি সেবা ফরম (IT Service Form)
            </div>
        </div>
        <div class="text-right text-sm">
            <p class="font-bold">আইটিসেবাক্রমঃ</p>
            <p class="border-b border-black inline-block px-2"><?php echo h($ticket['ticket_number']); ?></p>
            <p class="mt-2 font-bold">তারিখঃ</p>
            <p class="border-b border-black inline-block px-2"><?php echo date('d/m/Y', strtotime($ticket['created_at'])); ?></p>
        </div>
    </div>

    <!-- Applicant Info -->
    <div class="grid grid-cols-2 gap-y-4 text-sm mb-6">
        <div class="flex items-center">
            <span class="font-bold w-48">আবেদনকারীর নাম (Applicant Name)</span>
            <span class="flex-1 border-b border-dotted border-black px-2"><?php echo h($ticket['applicant_name_bn']); ?> / <?php echo h($ticket['applicant_name']); ?></span>
        </div>
        <div class="flex items-center ml-4">
            <span class="font-bold w-24">পদবী (Designation)</span>
            <span class="flex-1 border-b border-dotted border-black px-2"><?php echo h($ticket['designation_bn']); ?> / <?php echo h($ticket['designation']); ?></span>
        </div>
        <div class="flex items-center">
            <span class="font-bold w-48">বিভাগ/পর্যায় (Department/Level)</span>
            <span class="flex-1 border-b border-dotted border-black px-2"><?php echo h($ticket['department']); ?></span>
        </div>
        <div class="flex items-center ml-4">
            <span class="font-bold w-24">মোবাইল (Mobile)</span>
            <span class="flex-1 border-b border-dotted border-black px-2"><?php echo h($ticket['mobile']); ?></span>
        </div>
    </div>

    <!-- Service Grid -->
    <div class="grid grid-cols-3 border-2 border-black mb-6">
        <!-- Hardware -->
        <div class="border-r-2 border-black p-2">
            <div class="font-bold border-b border-black mb-2 flex justify-between items-center text-xs">
                <span>হার্ডওয়্যার সাপোর্ট সেবা</span>
                <span class="text-[10px]"><?php echo isset($is_new_supply['hardware']) ? '➜ নতুন সরবরাহ' : ''; ?></span>
            </div>
            <div class="space-y-1 text-[11px]">
                <?php 
                $hw_list = ['পিসি/ডেস্কটপ', 'ল্যাপটপ', 'মনিটর', 'প্রিন্টার/স্ক্যানার', 'কীবোর্ড/মাউস', 'ইউপিএস', 'ট্যাব', 'এক্সটেনশন কর্ড', 'আইপি ফোন', 'অন্যান্য'];
                foreach ($hw_list as $item): ?>
                <div class="flex items-center">
                    <div class="w-3 h-3 border border-black mr-1 flex items-center justify-center">
                        <?php echo in_array($item, $hw_items) ? '✓' : ''; ?>
                    </div>
                    <span><?php echo $item; ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Network -->
        <div class="border-r-2 border-black p-2">
            <div class="font-bold border-b border-black mb-2 flex justify-between items-center text-xs">
                <span>নেটওয়ার্ক সাপোর্ট সেবা</span>
                <span class="text-[10px]"><?php echo isset($is_new_supply['network']) ? '➜ নতুন সরবরাহ' : ''; ?></span>
            </div>
            <div class="space-y-1 text-[11px]">
                <?php 
                $nw_list = ['ল্যান', 'ওয়াই-ফাই', 'সুইচ/রাউটার কনফিগার', 'ভিডিও কনফারেন্স', 'আইপি ক্যামেরা', 'সার্ভার/স্টোরেজ', 'সিকিউরিটি/ফায়ারওয়াল', 'কেবলিং/ক্রিম্পিং', 'অন্যান্য'];
                foreach ($nw_list as $item): ?>
                <div class="flex items-center">
                    <div class="w-3 h-3 border border-black mr-1 flex items-center justify-center">
                        <?php echo in_array($item, $nw_items) ? '✓' : ''; ?>
                    </div>
                    <span><?php echo $item; ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Software -->
        <div class="p-2">
            <div class="font-bold border-b border-black mb-2 flex justify-between items-center text-xs">
                <span>সফটওয়্যার সাপোর্ট সেবা</span>
                <span class="text-[10px]"><?php echo isset($is_new_supply['software']) ? '➜ নতুন সরবরাহ' : ''; ?></span>
            </div>
            <div class="space-y-1 text-[11px]">
                <?php 
                $sw_list = ['ই-মেইল', 'ই-নথি', 'ই-জিপি', 'ওয়েবসাইট', 'ডোমেইন/হোস্টিং', 'অফিস সফটওয়্যার', 'ডিজিটাল সিগনেচার', 'অন্যান্য'];
                foreach ($sw_list as $item): ?>
                <div class="flex items-center">
                    <div class="w-3 h-3 border border-black mr-1 flex items-center justify-center">
                        <?php echo in_array($item, $sw_items) ? '✓' : ''; ?>
                    </div>
                    <span><?php echo $item; ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- Problem Description -->
    <div class="mb-6">
        <p class="font-bold text-sm mb-1">সমস্যার বিবরণ (Problem Description):</p>
        <div class="border-2 border-black p-2 min-h-[100px] text-sm">
            <?php echo nl2br(h($ticket['problem_description'])); ?>
        </div>
    </div>

    <!-- Signatures Row 1 -->
    <div class="grid grid-cols-2 gap-12 mb-12 mt-12">
        <div class="text-center">
            <div class="border-t border-black pt-1 text-xs font-bold">আবেদনকারীর স্বাক্ষর ও তারিখ</div>
            <div class="text-[10px] text-gray-500 mt-1">
                (Digitally Signed: <?php echo date('d/m/Y H:i', strtotime($ticket['created_at'])); ?>)
            </div>
        </div>
        <div class="text-center">
            <div class="border-t border-black pt-1 text-xs font-bold">সংশ্লিষ্ট বিভাগের প্রধানের স্বাক্ষর ও তারিখ</div>
            <div class="text-[10px] text-gray-500 mt-1">
                <?php if ($ticket['dept_head_approved']): ?>
                    (Digitally Approved: <?php echo date('d/m/Y H:i', strtotime($ticket['dept_head_approved_at'])); ?>)
                <?php else: ?>
                    &nbsp;
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- ICT Section -->
    <div class="border-2 border-black p-4 mb-6">
        <p class="font-bold text-center border-b border-black pb-1 mb-4">আইসিটি বিভাগ কর্তৃক পূরণীয় (For ICT Division Use Only)</p>
        
        <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="border border-black h-20 flex flex-col justify-end p-1 text-[10px] text-center">
                <?php if ($ticket['officer_signed']): ?>
                    <span class="font-bold"><?php echo h($ticket['officer_name_bn']); ?></span>
                <?php endif; ?>
                <div class="border-t border-black pt-1">দায়িত্বপ্রাপ্ত কর্মকর্তা</div>
            </div>
            <div class="border border-black h-20 flex flex-col justify-end p-1 text-[10px] text-center">
                <?php if ($ticket['deputy_director_signed']): ?>
                    <span class="font-bold">SIGNED</span>
                <?php endif; ?>
                <div class="border-t border-black pt-1">উপ-পরিচালক</div>
            </div>
            <div class="border border-black h-20 flex flex-col justify-end p-1 text-[10px] text-center">
                <?php if ($ticket['additional_director_signed']): ?>
                    <span class="font-bold">SIGNED</span>
                <?php endif; ?>
                <div class="border-t border-black pt-1">অতিরিক্ত পরিচালক</div>
            </div>
            <div class="border border-black h-20 flex flex-col justify-end p-1 text-[10px] text-center">
                <?php if ($ticket['director_signed']): ?>
                    <span class="font-bold">SIGNED</span>
                <?php endif; ?>
                <div class="border-t border-black pt-1">পরিচালক</div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm mb-4">
            <div class="flex items-center">
                <span class="font-bold w-32">সেবা প্রদানকারীর নামঃ</span>
                <span class="flex-1 border-b border-dotted border-black px-2"><?php echo h($ticket['service_provider_name']); ?></span>
            </div>
            <div class="flex items-center">
                <span class="font-bold w-16">পদবীঃ</span>
                <span class="flex-1 border-b border-dotted border-black px-2"><?php echo h($ticket['service_provider_designation']); ?></span>
            </div>
        </div>

        <div class="mb-4">
            <p class="font-bold text-xs mb-1">সেবা প্রদান সংক্রান্ত তথ্য (Service Description):</p>
            <div class="border border-black p-2 min-h-[60px] text-xs">
                <?php echo nl2br(h($ticket['service_description'])); ?>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-12 mt-8">
            <div class="text-center">
                <div class="border-t border-black pt-1 text-[10px] font-bold">সেবা প্রদানকারীর স্বাক্ষর ও তারিখ</div>
            </div>
            <div class="text-center">
                <div class="border-t border-black pt-1 text-[10px] font-bold">সেবা গ্রহণকারীর/পক্ষের স্বাক্ষর ও তারিখ</div>
                <?php if ($ticket['recipient_confirmed']): ?>
                    <div class="text-[9px] text-gray-500">Confirmed Digitally</div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
