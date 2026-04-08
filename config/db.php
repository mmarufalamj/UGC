<?php
/**
 * Database Configuration
 * Organization: University Grants Commission of Bangladesh (UGC)
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'ugc_it_service');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (\PDOException $e) {
    // In production, log error and show generic message
    die("Database connection failed: " . $e->getMessage());
}

// Global constants
define('APP_NAME', 'UGC IT Service Request System');
define('ORG_NAME_BN', 'বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরি কমিশন');
define('ORG_NAME_EN', 'University Grants Commission of Bangladesh');
define('ORG_ADDRESS_BN', 'আগারগাঁও, শেরে-বাংলা নগর, ঢাকা-১২০৭');
define('ORG_WEBSITE', 'www.ugc.gov.bd');
