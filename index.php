<?php
require_once 'config/db.php';
require_once 'includes/auth.php';

if (isset($_SESSION['user_id'])) {
    // Redirect based on role
    switch ($_SESSION['role']) {
        case 'admin': header("Location: admin/dashboard.php"); break;
        case 'ict_officer': header("Location: officer/dashboard.php"); break;
        default: header("Location: employee/dashboard.php"); break;
    }
    exit();
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($email && $password) {
        $stmt = $pdo->prepare("SELECT u.*, d.name_bn as dept_name_bn FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE u.email = ? AND u.is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['name_bn'] = $user['name_bn'];
            $_SESSION['dept_name_bn'] = $user['dept_name_bn'];
            
            // Redirect based on role
            switch ($user['role']) {
                case 'admin': header("Location: admin/dashboard.php"); break;
                case 'ict_officer': header("Location: officer/dashboard.php"); break;
                default: header("Location: employee/dashboard.php"); break;
            }
            exit();
        } else {
            $error = 'ভুল ইমেইল অথবা পাসওয়ার্ড।';
        }
    } else {
        $error = 'সবগুলো ঘর পূরণ করুন।';
    }
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>লগইন | <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="assets/css/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-100 font-sans flex items-center justify-center min-h-screen">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div class="bg-[#1a3a6b] p-6 text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-[#1a3a6b] font-bold text-xl">UGC</span>
            </div>
            <h1 class="text-white text-xl font-bold"><?php echo ORG_NAME_BN; ?></h1>
            <p class="text-blue-100 text-sm">আইটি সেবা অনুরোধ সিস্টেম</p>
        </div>
        
        <div class="p-8">
            <?php if ($error): ?>
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>

            <form action="index.php" method="POST" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">ইমেইল (Email)</label>
                    <input type="email" name="email" id="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">পাসওয়ার্ড (Password)</label>
                    <input type="password" name="password" id="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>

                <div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a3a6b] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                        লগইন করুন
                    </button>
                </div>
            </form>
            
            <div class="mt-6 text-center text-xs text-gray-500">
                <p>পাসওয়ার্ড ভুলে গেলে আইসিটি বিভাগের সাথে যোগাযোগ করুন।</p>
            </div>
        </div>
    </div>
</body>
</html>
