-- UGC IT Service Request System Database Schema
-- Organization: University Grants Commission of Bangladesh (UGC)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00";

-- --------------------------------------------------------

-- Table structure for `departments`
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `name_bn` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data for `departments`
INSERT INTO `departments` (`name`, `name_bn`) VALUES
('ICT Division', 'আইসিটি বিভাগ'),
('Finance Division', 'অর্থ ও হিসাব বিভাগ'),
('Planning Division', 'পরিকল্পনা ও উন্নয়ন বিভাগ'),
('Academic Division', 'একাডেমিক বিভাগ'),
('Legal Division', 'আইন বিভাগ'),
('Administration Division', 'প্রশাসন বিভাগ'),
('Audit Division', 'অডিট বিভাগ'),
('Library', 'লাইব্রেরি'),
('BARC', 'বিএআরসি'),
('Director General Office', 'মহাপরিচালক দপ্তর');

-- --------------------------------------------------------

-- Table structure for `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `name_bn` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `designation_bn` varchar(255) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('employee','ict_officer','admin') NOT NULL DEFAULT 'employee',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_dept` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data for `users`
-- Default Password for all: password
INSERT INTO `users` (`name`, `name_bn`, `designation`, `designation_bn`, `department_id`, `mobile`, `email`, `password_hash`, `role`) VALUES
('Admin User', 'অ্যাডমিন ইউজার', 'System Administrator', 'সিস্টেম অ্যাডমিনিস্ট্রেটর', 1, '01700000000', 'admin@ugc.gov.bd', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('ICT Officer', 'আইসিটি কর্মকর্তা', 'Assistant Programmer', 'সহকারী প্রোগ্রামার', 1, '01711111111', 'officer@ugc.gov.bd', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ict_officer'),
('Test Employee', 'টেস্ট কর্মচারী', 'Section Officer', 'সেকশন অফিসার', 2, '01722222222', 'employee@ugc.gov.bd', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee');

-- --------------------------------------------------------

-- Table structure for `tickets`
CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(50) NOT NULL UNIQUE,
  `year` int(4) NOT NULL,
  `applicant_user_id` int(11) NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `applicant_name_bn` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `designation_bn` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `service_type` json DEFAULT NULL, -- ['hardware', 'network', 'software']
  `hardware_items` json DEFAULT NULL,
  `network_items` json DEFAULT NULL,
  `software_items` json DEFAULT NULL,
  `is_new_supply` json DEFAULT NULL, -- {"hardware": true, "network": false, ...}
  `problem_description` text NOT NULL,
  `status` enum('submitted','received','in_progress','resolved','closed') DEFAULT 'submitted',
  `assigned_officer_id` int(11) DEFAULT NULL,
  `service_provider_name` varchar(255) DEFAULT NULL,
  `service_provider_designation` varchar(255) DEFAULT NULL,
  `service_description` text DEFAULT NULL,
  `dept_head_approved` tinyint(1) DEFAULT 0,
  `dept_head_approved_at` timestamp NULL DEFAULT NULL,
  `officer_signed` tinyint(1) DEFAULT 0,
  `officer_signed_at` timestamp NULL DEFAULT NULL,
  `deputy_director_signed` tinyint(1) DEFAULT 0,
  `additional_director_signed` tinyint(1) DEFAULT 0,
  `director_signed` tinyint(1) DEFAULT 0,
  `recipient_confirmed` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ticket_applicant` FOREIGN KEY (`applicant_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_ticket_officer` FOREIGN KEY (`assigned_officer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
