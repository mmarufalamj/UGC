<?php
/**
 * Authentication and Session Helpers
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Redirect if not logged in
 */
function require_login() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: ../index.php");
        exit();
    }
}

/**
 * Redirect if not authorized for specific role
 */
function require_role($roles) {
    require_login();
    if (is_string($roles)) {
        $roles = [$roles];
    }
    if (!in_array($_SESSION['role'], $roles)) {
        header("Location: ../index.php?error=unauthorized");
        exit();
    }
}

/**
 * Generate CSRF Token
 */
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF Token
 */
function validate_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Sanitize Output
 */
function h($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

/**
 * Get Status Badge Class
 */
function get_status_badge($status) {
    $badges = [
        'submitted'   => 'bg-gray-500',
        'received'    => 'bg-blue-500',
        'in_progress' => 'bg-yellow-500',
        'resolved'    => 'bg-green-500',
        'closed'      => 'bg-black'
    ];
    return $badges[$status] ?? 'bg-gray-500';
}

/**
 * Get Status Label (Bilingual)
 */
function get_status_label($status) {
    $labels = [
        'submitted'   => 'দাখিলকৃত (Submitted)',
        'received'    => 'গৃহীত (Received)',
        'in_progress' => 'চলমান (In Progress)',
        'resolved'    => 'সমাধানকৃত (Resolved)',
        'closed'      => 'বন্ধ (Closed)'
    ];
    return $labels[$status] ?? $status;
}
