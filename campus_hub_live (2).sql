-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2026 at 07:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `campus_hub_live`
--

-- --------------------------------------------------------

--
-- Table structure for table `cafe_menu`
--

CREATE TABLE `cafe_menu` (
  `id` int(11) NOT NULL,
  `item_name` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cafe_menu`
--

INSERT INTO `cafe_menu` (`id`, `item_name`, `category`, `price`, `description`, `is_available`, `image_url`) VALUES
(1, 'Cappuccino', 'Hot Drinks', 350.00, 'Rich espresso with velvety steamed milk foam', 1, NULL),
(2, 'Latte', 'Hot Drinks', 380.00, 'Smooth espresso with steamed milk', 1, NULL),
(3, 'Iced Caramel Latte', 'Cool Drinks', 520.00, 'Cold espresso with caramel syrup over ice', 1, NULL),
(4, 'Chicken Rice Box', 'Main Dishes', 950.00, 'Herb-marinated chicken with jasmine rice', 1, NULL),
(5, 'Garden Salad', 'Side Dishes', 280.00, 'Mixed greens with vinaigrette', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cafe_orders`
--

CREATE TABLE `cafe_orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `pickup_time` time DEFAULT NULL,
  `special_instructions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cafe_order_items`
--

CREATE TABLE `cafe_order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `menu_item_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE `clubs` (
  `id` int(11) NOT NULL,
  `club_name` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `president_name` varchar(100) DEFAULT NULL,
  `meeting_day` varchar(20) DEFAULT NULL,
  `meeting_time` time DEFAULT NULL,
  `member_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clubs`
--

INSERT INTO `clubs` (`id`, `club_name`, `category`, `description`, `president_name`, `meeting_day`, `meeting_time`, `member_count`) VALUES
(1, 'Athletic Club', 'Sports', 'Sports and fitness club for all students', 'John Doe', 'Monday', '16:00:00', 0),
(2, 'Aesthetic Club', 'Arts', 'Creative arts, music, and drama club', 'Jane Smith', 'Wednesday', '15:30:00', 0),
(3, 'AIESEC', 'Leadership', 'Global leadership development', 'Mike Johnson', 'Tuesday', '17:00:00', 0),
(4, 'LEO Club', 'Service', 'Community service organization', 'Sarah Williams', 'Thursday', '14:00:00', 0),
(5, 'IEEE Club', 'Technology', 'Engineering and technology society', 'David Lee', 'Friday', '13:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `club_members`
--

CREATE TABLE `club_members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  `joined_date` date DEFAULT NULL,
  `role` varchar(50) DEFAULT 'member',
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `club_members`
--

INSERT INTO `club_members` (`id`, `user_id`, `club_id`, `joined_date`, `role`, `status`) VALUES
(1, 1, 1, '2026-03-24', 'member', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `time` varchar(100) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `max_participants` int(11) DEFAULT 100,
  `current_registrations` int(11) DEFAULT 0,
  `points_awarded` int(11) DEFAULT 100,
  `status` varchar(50) DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `description`, `event_date`, `time`, `venue`, `image`, `category`, `tags`, `max_participants`, `current_registrations`, `points_awarded`, `status`, `created_at`) VALUES
(1, 'Dance Fitness Bootcamp', 'An energetic two-hour cardio dance session designed for all fitness levels. Led by certified instructors — no experience required.', '2026-03-22', '6:00 PM to 8:00 PM', 'Main Dance Studio', 'event1.jpeg', 'Fitness and Dance', '[\"Dance\", \"Cardio\", \"All Levels\"]', 30, 15, 100, 'upcoming', '2026-03-23 10:53:56'),
(2, 'Music and Movement Night', 'An evening of live performances, social dancing, and campus music showcasing student bands and visiting artists.', '2026-03-25', '7:00 PM to 10:00 PM', 'Campus Amphitheater', 'event2.jpeg', 'Music and Arts', '[\"Music\", \"Social\", \"Live Performance\"]', 200, 85, 100, 'upcoming', '2026-03-23 10:53:56'),
(3, 'Spring Sports Tournament', 'Inter-faculty knockout tournament across multiple sports. Register your team and compete for the Spring Championship trophy and cash prize.', '2026-03-28', '9:00 AM to 5:00 PM', 'Athletic Center', 'event3.jpeg', 'Sports and Competition', '[\"Sports\", \"Competition\", \"Prize\"]', 50, 42, 150, 'upcoming', '2026-03-23 10:53:56'),
(4, 'Contemporary Dance Masterclass', 'An intensive contemporary and ballet masterclass taught by a visiting professional choreographer. Intermediate to advanced level recommended.', '2026-04-01', '4:00 PM to 6:00 PM', 'Arts Center Theater', 'event4.jpg', 'Performing Arts', '[\"Ballet\", \"Advanced\", \"Masterclass\"]', 20, 18, 200, 'upcoming', '2026-03-23 10:53:56');

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'confirmed',
  `attendees` int(11) DEFAULT 1,
  `special_requests` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `timing` varchar(255) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `category`, `description`, `capacity`, `is_available`, `timing`, `image`) VALUES
(1, 'Main Library', 'library', 'A fully equipped library with study rooms, computers, and a large book collection.', 200, 1, 'Mon-Sat 8:00AM - 9:00PM', 'library.jpg'),
(2, 'Computer Lab A', 'lab', 'High-performance computers with internet access and software tools for all courses.', 40, 1, 'Mon-Fri 7:00AM - 8:00PM', 'computer_lab.jpg'),
(3, 'Main Gymnasium', 'gym', 'Fully equipped gym with cardio machines, free weights, and a basketball court.', 100, 1, 'Mon-Sun 6:00AM - 10:00PM', 'gym.jpg'),
(4, 'Auditorium', 'event', 'Large auditorium suitable for seminars, presentations, and cultural events.', 500, 1, 'Mon-Sun 8:00AM - 10:00PM', 'auditorium.jpg'),
(5, 'Cafeteria', 'food', 'Campus cafeteria offering a wide variety of meals, snacks, and beverages.', 150, 1, 'Mon-Fri 7:00AM - 7:00PM', 'cafeteria.jpg'),
(6, 'Swimming Pool', 'sports', 'Olympic-size swimming pool available for recreational and competitive use.', 60, 0, 'Mon-Sat 6:00AM - 8:00PM', 'pool.jpg'),
(7, 'Study Hall', 'library', 'Quiet open study space with individual desks and free Wi-Fi.', 80, 1, 'Mon-Sun 7:00AM - 11:00PM', 'study_hall.jpg'),
(8, 'Science Lab', 'lab', 'Fully equipped science laboratory for chemistry, biology, and physics experiments.', 30, 1, 'Mon-Fri 8:00AM - 5:00PM', 'science_lab.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `facility_bookings`
--

CREATE TABLE `facility_bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `facility_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `purpose` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'confirmed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_bookings`
--

INSERT INTO `facility_bookings` (`id`, `user_id`, `facility_id`, `booking_date`, `start_time`, `end_time`, `purpose`, `status`, `created_at`) VALUES
(5, 1, 1, '2026-03-24', '09:00:00', '11:00:00', 'Group study session', 'approved', '2026-03-20 04:30:00'),
(6, 2, 3, '2026-03-24', '06:00:00', '07:30:00', 'Morning workout', 'approved', '2026-03-20 05:30:00'),
(7, 3, 4, '2026-03-25', '14:00:00', '17:00:00', 'Club annual presentation', 'pending', '2026-03-21 03:30:00'),
(8, 4, 2, '2026-03-25', '10:00:00', '12:00:00', 'Programming assignment', 'approved', '2026-03-21 05:00:00'),
(9, 1, 7, '2026-03-26', '08:00:00', '10:00:00', 'Exam preparation', 'approved', '2026-03-22 02:30:00'),
(10, 2, 8, '2026-03-26', '13:00:00', '15:00:00', 'Chemistry lab report', 'pending', '2026-03-22 03:30:00'),
(11, 3, 4, '2026-03-27', '10:00:00', '12:00:00', 'Freshers welcome event', 'rejected', '2026-03-22 08:30:00'),
(12, 4, 3, '2026-03-27', '17:00:00', '19:00:00', 'Basketball practice', 'approved', '2026-03-23 01:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `gym_bookings`
--

CREATE TABLE `gym_bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'confirmed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gym_bookings`
--

INSERT INTO `gym_bookings` (`id`, `user_id`, `class_id`, `booking_date`, `status`) VALUES
(1, 2, 8, '2026-03-24', 'confirmed'),
(2, 2, 8, '2026-03-24', 'confirmed'),
(3, 2, 2, '2026-03-24', 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `gym_classes`
--

CREATE TABLE `gym_classes` (
  `id` int(11) NOT NULL,
  `class_name` varchar(100) DEFAULT NULL,
  `instructor` varchar(100) DEFAULT NULL,
  `class_time` time DEFAULT NULL,
  `class_day` varchar(20) DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `current_bookings` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gym_classes`
--

INSERT INTO `gym_classes` (`id`, `class_name`, `instructor`, `class_time`, `class_day`, `max_participants`, `current_bookings`) VALUES
(1, 'HIIT Bootcamp', 'Coach Malshan', '06:00:00', 'Monday', 20, 0),
(2, 'Power Yoga', 'Instructor Sarala', '07:00:00', 'Tuesday', 15, 1),
(3, 'Spin Cycle', 'Coach Saman', '12:00:00', 'Wednesday', 25, 0),
(4, 'CrossFit WOD', 'Coach Alex', '17:00:00', 'Thursday', 12, 0),
(5, 'Zumba Dance', 'Instructor Maria', '18:30:00', 'Friday', 30, 0),
(6, 'HIIT Bootcamp', 'Coach Malshan', '06:00:00', 'Monday', 20, 12),
(7, 'Power Yoga', 'Instructor Sarala', '07:00:00', 'Tuesday', 15, 8),
(8, 'Spin Cycle', 'Coach Saman', '12:00:00', 'Wednesday', 25, 20),
(9, 'CrossFit WOD', 'Coach Alex', '17:00:00', 'Thursday', 12, 10),
(10, 'Zumba Dance', 'Instructor Maria', '18:30:00', 'Friday', 30, 15);

-- --------------------------------------------------------

--
-- Table structure for table `gym_membership`
--

CREATE TABLE `gym_membership` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `membership_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gym_memberships`
--

CREATE TABLE `gym_memberships` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `membership_type` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `job_type` varchar(50) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `posted_date` date DEFAULT NULL,
  `deadline` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `title`, `company`, `job_type`, `location`, `salary`, `duration`, `description`, `requirements`, `posted_date`, `deadline`) VALUES
(1, 'Automotive Design Engineer Intern', 'Toyota Lanka Ltd', 'intern', 'Colombo', 'Rs. 90,000/mo', '6 months', 'Work on vehicle body design using CATIA V5', NULL, NULL, '2026-05-30'),
(2, 'Full-Stack Developer Intern', 'TechCorp Solutions', 'intern', 'Remote', 'Rs. 95,000/mo', '3 months', 'Build scalable web applications', NULL, NULL, '2026-05-15'),
(3, 'Business Strategy Intern', 'ConsultPro Lanka', 'intern', 'Colombo', 'Rs. 85,000/mo', '4 months', 'Support strategy consultants', NULL, NULL, '2026-05-20');

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `job_id` int(11) DEFAULT NULL,
  `application_date` datetime DEFAULT current_timestamp(),
  `cover_letter` text DEFAULT NULL,
  `resume_path` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `library_books`
--

CREATE TABLE `library_books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `publication_year` int(11) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `total_copies` int(11) DEFAULT 1,
  `available_copies` int(11) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `library_books`
--

INSERT INTO `library_books` (`id`, `title`, `author`, `category`, `publication_year`, `isbn`, `total_copies`, `available_copies`, `created_at`) VALUES
(1, 'Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 2022, NULL, 5, 1, '2026-03-21 22:09:16'),
(2, 'Clean Code', 'Robert C. Martin', 'Software Engineering', 2023, NULL, 3, 1, '2026-03-21 22:09:16'),
(3, 'Database Systems', 'Raghu Ramakrishnan', 'Information Systems', 2024, NULL, 4, 1, '2026-03-21 22:09:16'),
(4, 'Aviation Safety Management', 'Stephen K. Cusick', 'Aviation', 2023, NULL, 2, 1, '2026-03-21 22:09:16'),
(5, 'Financial Accounting', 'Charles T. Horngren', 'Finance', 2025, NULL, 5, 1, '2026-03-21 22:09:16');

-- --------------------------------------------------------

--
-- Table structure for table `library_borrowings`
--

CREATE TABLE `library_borrowings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `borrow_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'borrowed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_listings`
--

CREATE TABLE `marketplace_listings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `item_condition` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'available',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_messages`
--

CREATE TABLE `marketplace_messages` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `sent_at` datetime DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `points_cost` int(11) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`id`, `name`, `description`, `points_cost`, `category`, `image`, `is_available`, `created_at`) VALUES
(1, 'Free Coffee', 'Any hot or cold drink at ORYN Cafe — barista-made, your choice of size and blend.', 150, 'cafe', 'free_coffee.jpg', 1, '2026-03-23 10:41:47'),
(2, 'Library Extension', 'Extend any borrowed book by 2 extra weeks with no late fees or penalties applied.', 200, 'library', 'library_exten.jpg', 1, '2026-03-23 10:41:47'),
(3, 'Event Pass', 'Free entry to any premium campus event, workshop, or cultural programme of your choice.', 300, 'events', 'free_ticket.jpg', 1, '2026-03-23 10:41:47'),
(4, 'Free Transit Pass', 'One full week of unlimited bus rides across all ORYN campus routes — any time, any bus.', 350, 'transit', 'free_trans.jpg', 1, '2026-03-23 10:41:47'),
(5, 'Course Discount', '20% off any certification course or short programme offered at ORYN Campus this semester.', 1000, 'academic', 'discount.jpg', 1, '2026-03-23 10:41:47');

-- --------------------------------------------------------

--
-- Table structure for table `reward_redemptions`
--

CREATE TABLE `reward_redemptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reward_id` int(11) NOT NULL,
  `points_spent` int(11) NOT NULL,
  `redeemed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reward_transactions`
--

CREATE TABLE `reward_transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transit_buses`
--

CREATE TABLE `transit_buses` (
  `id` int(11) NOT NULL,
  `bus_name` varchar(100) NOT NULL,
  `route_name` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transit_buses`
--

INSERT INTO `transit_buses` (`id`, `bus_name`, `route_name`, `capacity`, `status`) VALUES
(1, 'Bus A', 'Campus ↔ Colombo City', 45, 'active'),
(2, 'Bus B', 'Campus ↔ Kadawatha', 40, 'active'),
(3, 'Bus C', 'Campus ↔ City Center', 50, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `transit_location_shares`
--

CREATE TABLE `transit_location_shares` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `points_earned` int(11) DEFAULT 5,
  `shared_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transit_schedules`
--

CREATE TABLE `transit_schedules` (
  `id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `day_type` varchar(20) NOT NULL,
  `departure_time` time NOT NULL,
  `arrival_time` time DEFAULT NULL,
  `route_direction` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transit_schedules`
--

INSERT INTO `transit_schedules` (`id`, `bus_id`, `day_type`, `departure_time`, `arrival_time`, `route_direction`) VALUES
(1, 1, 'weekday', '06:00:00', NULL, 'Campus to City'),
(2, 1, 'weekday', '07:30:00', NULL, 'Campus to City'),
(3, 1, 'weekday', '09:00:00', NULL, 'Campus to City'),
(4, 1, 'weekday', '11:00:00', NULL, 'Campus to City'),
(5, 1, 'weekday', '13:00:00', NULL, 'Campus to City'),
(6, 1, 'weekday', '15:30:00', NULL, 'Campus to City'),
(7, 1, 'weekday', '17:00:00', NULL, 'Campus to City'),
(8, 2, 'weekday', '07:00:00', NULL, 'Campus to Kadawatha'),
(9, 2, 'weekday', '08:30:00', NULL, 'Campus to Kadawatha'),
(10, 2, 'weekday', '10:30:00', NULL, 'Campus to Kadawatha'),
(11, 2, 'weekday', '12:30:00', NULL, 'Campus to Kadawatha'),
(12, 2, 'weekday', '14:30:00', NULL, 'Campus to Kadawatha'),
(13, 2, 'weekday', '16:30:00', NULL, 'Campus to Kadawatha'),
(14, 2, 'weekday', '18:00:00', NULL, 'Campus to Kadawatha'),
(15, 3, 'weekday', '07:00:00', NULL, 'Campus to City Center'),
(16, 3, 'weekday', '08:00:00', NULL, 'City Center to Campus'),
(17, 3, 'weekday', '12:00:00', NULL, 'Campus to City Center'),
(18, 3, 'weekday', '13:30:00', NULL, 'City Center to Campus'),
(19, 3, 'weekday', '16:00:00', NULL, 'Campus to City Center'),
(20, 3, 'weekday', '17:30:00', NULL, 'City Center to Campus'),
(21, 3, 'weekday', '18:30:00', NULL, 'Campus to City Center'),
(22, 1, 'saturday', '08:00:00', NULL, 'Campus to City'),
(23, 1, 'saturday', '11:00:00', NULL, 'Campus to City'),
(24, 1, 'saturday', '14:00:00', NULL, 'Campus to City'),
(25, 1, 'saturday', '17:00:00', NULL, 'Campus to City'),
(26, 2, 'saturday', '08:30:00', NULL, 'Campus to Kadawatha'),
(27, 2, 'saturday', '12:00:00', NULL, 'Campus to Kadawatha'),
(28, 2, 'saturday', '16:00:00', NULL, 'Campus to Kadawatha'),
(29, 3, 'saturday', '09:00:00', NULL, 'Campus to City Center'),
(30, 3, 'saturday', '13:00:00', NULL, 'City Center to Campus'),
(31, 3, 'saturday', '17:00:00', NULL, 'Campus to City Center'),
(32, 1, 'sunday', '09:00:00', NULL, 'Campus to City'),
(33, 1, 'sunday', '13:00:00', NULL, 'Campus to City'),
(34, 1, 'sunday', '16:00:00', NULL, 'Campus to City'),
(35, 3, 'sunday', '10:00:00', NULL, 'Campus to City Center'),
(36, 3, 'sunday', '15:00:00', NULL, 'City Center to Campus');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `index_no` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `programme` varchar(100) DEFAULT NULL,
  `year_of_study` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reward_points` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `index_no`, `role`, `password`, `email`, `mobile`, `nic`, `address`, `faculty`, `programme`, `year_of_study`, `username`, `dob`, `gender`, `created_at`, `reward_points`) VALUES
(1, 'Ginuka', 'Weragoda', '1234', 'student', '$2b$10$28Viz/R7OjHYlvev15JgdueBXKyTtiv.T1e57DnwcJx7XYPo4lKiK', 'GinukaWeragoda@gmail.com', '+94 87287342', '342341342342', 'asdafevsdfserf', 'Faculty of Computing', 'BSc in Information Technology', 1, 'Ginuka', '2008-02-21', 'male', '2026-03-22 14:51:10', 0),
(2, 'Sansuni', 'Priyalakshi', '12346', 'student', '$2b$10$ToPKSQ/SUKJP7ujIFXAtC.M.qJH9FMGBH18CdHFrSC35Zo3OB0YhW', 'sandunipriyalakshi@gmail.com', '+94 75 816 3535', '123234353456456', 'asdafevsdfserf', 'Faculty of Computing', 'BSc in Information Technology', 2, 'Sanduni', '2008-02-08', 'female', '2026-03-22 14:57:45', 90),
(3, 'Mareena', 'Perera', '24688', 'student', '$2b$10$PklcL8MsDTkgMa8D.Gsi8eOx86dedGyKYzDiZsr9DOIuRR099.vlu', 'mareenaperera@gmail.com', '+94 351635637', '123234353456456', 'Malabe road, Colombo', 'Faculty of Computing', 'BSc in Information Technology', 3, 'Mareena248', '2002-02-22', 'female', '2026-03-22 15:31:31', 0),
(4, 'Nichole', 'Perera', '123456', 'student', '$2b$10$ViHJXzoirqQK9Uf1Gj2t3.pLiR81eV2EMOQlLE3VcBGgdwQvNG.m.', 'nicholeperera@gmail.com', '+94 877897008', '34234243154', 'Jaela, Colombo', 'Faculty of Computing', 'BSc in Information Technology', 3, 'Nichole2424', '2008-02-06', 'male', '2026-03-23 10:33:41', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cafe_menu`
--
ALTER TABLE `cafe_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cafe_orders`
--
ALTER TABLE `cafe_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cafe_order_items`
--
ALTER TABLE `cafe_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_item_id` (`menu_item_id`);

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `club_members`
--
ALTER TABLE `club_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_club_members_user` (`user_id`),
  ADD KEY `idx_club_members_club` (`club_id`),
  ADD KEY `idx_club_members_status` (`status`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`user_id`,`event_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_event` (`event_id`),
  ADD KEY `idx_event_registrations_user` (`user_id`),
  ADD KEY `idx_event_registrations_event` (`event_id`),
  ADD KEY `idx_event_registrations_status` (`status`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facility_bookings`
--
ALTER TABLE `facility_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `facility_id` (`facility_id`);

--
-- Indexes for table `gym_bookings`
--
ALTER TABLE `gym_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `gym_classes`
--
ALTER TABLE `gym_classes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gym_membership`
--
ALTER TABLE `gym_membership`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `gym_memberships`
--
ALTER TABLE `gym_memberships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `library_books`
--
ALTER TABLE `library_books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `library_borrowings`
--
ALTER TABLE `library_borrowings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `marketplace_messages`
--
ALTER TABLE `marketplace_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reward_redemptions`
--
ALTER TABLE `reward_redemptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reward_id` (`reward_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `reward_transactions`
--
ALTER TABLE `reward_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transit_buses`
--
ALTER TABLE `transit_buses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transit_location_shares`
--
ALTER TABLE `transit_location_shares`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `transit_schedules`
--
ALTER TABLE `transit_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `index_no` (`index_no`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cafe_menu`
--
ALTER TABLE `cafe_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cafe_orders`
--
ALTER TABLE `cafe_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cafe_order_items`
--
ALTER TABLE `cafe_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `club_members`
--
ALTER TABLE `club_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `facility_bookings`
--
ALTER TABLE `facility_bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `gym_bookings`
--
ALTER TABLE `gym_bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `gym_classes`
--
ALTER TABLE `gym_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `gym_membership`
--
ALTER TABLE `gym_membership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gym_memberships`
--
ALTER TABLE `gym_memberships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `library_books`
--
ALTER TABLE `library_books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `library_borrowings`
--
ALTER TABLE `library_borrowings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_messages`
--
ALTER TABLE `marketplace_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `reward_redemptions`
--
ALTER TABLE `reward_redemptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reward_transactions`
--
ALTER TABLE `reward_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transit_buses`
--
ALTER TABLE `transit_buses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transit_location_shares`
--
ALTER TABLE `transit_location_shares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transit_schedules`
--
ALTER TABLE `transit_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cafe_orders`
--
ALTER TABLE `cafe_orders`
  ADD CONSTRAINT `cafe_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cafe_order_items`
--
ALTER TABLE `cafe_order_items`
  ADD CONSTRAINT `cafe_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `cafe_orders` (`id`),
  ADD CONSTRAINT `cafe_order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `cafe_menu` (`id`);

--
-- Constraints for table `club_members`
--
ALTER TABLE `club_members`
  ADD CONSTRAINT `club_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `club_members_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`);

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facility_bookings`
--
ALTER TABLE `facility_bookings`
  ADD CONSTRAINT `facility_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `facility_bookings_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`);

--
-- Constraints for table `gym_bookings`
--
ALTER TABLE `gym_bookings`
  ADD CONSTRAINT `gym_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `gym_bookings_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `gym_classes` (`id`);

--
-- Constraints for table `gym_membership`
--
ALTER TABLE `gym_membership`
  ADD CONSTRAINT `gym_membership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gym_memberships`
--
ALTER TABLE `gym_memberships`
  ADD CONSTRAINT `gym_memberships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `job_applications_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`);

--
-- Constraints for table `library_borrowings`
--
ALTER TABLE `library_borrowings`
  ADD CONSTRAINT `library_borrowings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `library_borrowings_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `library_books` (`id`);

--
-- Constraints for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
  ADD CONSTRAINT `marketplace_listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `marketplace_messages`
--
ALTER TABLE `marketplace_messages`
  ADD CONSTRAINT `marketplace_messages_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `marketplace_listings` (`id`),
  ADD CONSTRAINT `marketplace_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `marketplace_messages_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reward_redemptions`
--
ALTER TABLE `reward_redemptions`
  ADD CONSTRAINT `reward_redemptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reward_redemptions_ibfk_2` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reward_transactions`
--
ALTER TABLE `reward_transactions`
  ADD CONSTRAINT `reward_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `transit_location_shares`
--
ALTER TABLE `transit_location_shares`
  ADD CONSTRAINT `transit_location_shares_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transit_location_shares_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `transit_buses` (`id`);

--
-- Constraints for table `transit_schedules`
--
ALTER TABLE `transit_schedules`
  ADD CONSTRAINT `transit_schedules_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `transit_buses` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
