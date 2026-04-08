<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/auth.php';
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="../assets/css/print.css" media="print">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <nav class="bg-[#1a3a6b] text-white shadow-lg no-print">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                            <span class="text-[#1a3a6b] font-bold">UGC</span>
                        </div>
                        <span class="font-bold text-lg hidden md:block">UGC IT Service System</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <span class="text-sm hidden sm:inline">স্বাগতম, <?php echo h($_SESSION['name_bn']); ?></span>
                        <a href="../logout.php" class="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-medium transition">লগআউট</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Sidebar Navigation -->
            <?php if (isset($_SESSION['user_id'])): ?>
            <aside class="w-full md:w-64 no-print">
                <div class="bg-white rounded-lg shadow p-4 space-y-2">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">মেনু</p>
                    
                    <?php if ($_SESSION['role'] === 'employee'): ?>
                        <a href="../employee/dashboard.php" class="block px-4 py-2 rounded hover:bg-gray-100 <?php echo strpos($_SERVER['PHP_SELF'], 'dashboard') !== false ? 'bg-blue-50 text-blue-700 font-semibold' : ''; ?>">ড্যাশবোর্ড</a>
                        <a href="../employee/new-ticket.php" class="block px-4 py-2 rounded hover:bg-gray-100 <?php echo strpos($_SERVER['PHP_SELF'], 'new-ticket') !== false ? 'bg-blue-50 text-blue-700 font-semibold' : ''; ?>">নতুন সেবা ফরম</a>
                    <?php endif; ?>

                    <?php if ($_SESSION['role'] === 'ict_officer'): ?>
                        <a href="../officer/dashboard.php" class="block px-4 py-2 rounded hover:bg-gray-100 <?php echo strpos($_SERVER['PHP_SELF'], 'dashboard') !== false ? 'bg-blue-50 text-blue-700 font-semibold' : ''; ?>">অ্যাসাইনকৃত টিকিট</a>
                    <?php endif; ?>

                    <?php if ($_SESSION['role'] === 'admin'): ?>
                        <a href="../admin/dashboard.php" class="block px-4 py-2 rounded hover:bg-gray-100 <?php echo strpos($_SERVER['PHP_SELF'], 'dashboard') !== false ? 'bg-blue-50 text-blue-700 font-semibold' : ''; ?>">অ্যাডমিন ড্যাশবোর্ড</a>
                        <a href="../admin/tickets.php" class="block px-4 py-2 rounded hover:bg-gray-100 <?php echo strpos($_SERVER['PHP_SELF'], 'tickets') !== false ? 'bg-blue-50 text-blue-700 font-semibold' : ''; ?>">সকল টিকিট</a>
                        <a href="../admin/users.php" class="block px-4 py-2 rounded hover:bg-gray-100 <?php echo strpos($_SERVER['PHP_SELF'], 'users') !== false ? 'bg-blue-50 text-blue-700 font-semibold' : ''; ?>">ইউজার ম্যানেজমেন্ট</a>
                        <a href="../admin/settings.php" class="block px-4 py-2 rounded hover:bg-gray-100 <?php echo strpos($_SERVER['PHP_SELF'], 'settings') !== false ? 'bg-blue-50 text-blue-700 font-semibold' : ''; ?>">সিস্টেম সেটিংস</a>
                    <?php endif; ?>
                </div>
            </aside>
            <?php endif; ?>

            <!-- Main Content Area -->
            <main class="flex-1">
