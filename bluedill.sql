-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2024 at 07:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bluedill`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` varchar(191) NOT NULL,
  `userEmail` varchar(191) NOT NULL,
  `userMessage` varchar(191) NOT NULL,
  `senderUserId` varchar(191) NOT NULL,
  `receiverUserId` varchar(191) NOT NULL,
  `isReceivedStatus` tinyint(1) NOT NULL DEFAULT 0,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collaboratedocs`
--

CREATE TABLE `collaboratedocs` (
  `id` varchar(191) NOT NULL,
  `docid` varchar(191) NOT NULL,
  `docname` varchar(191) NOT NULL,
  `roomId` varchar(191) NOT NULL,
  `requestingSignature` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collaborator`
--

CREATE TABLE `collaborator` (
  `id` varchar(191) NOT NULL,
  `collabId` varchar(191) NOT NULL,
  `collaboratorEmail` varchar(191) NOT NULL,
  `isSigned` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `docsencryption`
--

CREATE TABLE `docsencryption` (
  `id` varchar(191) NOT NULL,
  `decryptionLink` varchar(191) NOT NULL,
  `encryptionLink` varchar(191) NOT NULL,
  `encryptionPassword` varchar(191) NOT NULL,
  `encryptDocsId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` varchar(191) NOT NULL,
  `docid` varchar(191) NOT NULL,
  `docname` varchar(191) NOT NULL,
  `doclink` varchar(191) NOT NULL,
  `userUpdateDoc` varchar(191) NOT NULL,
  `templateType` varchar(191) NOT NULL,
  `isEncrypted` tinyint(1) NOT NULL DEFAULT 0,
  `securityCode` varchar(191) DEFAULT NULL,
  `docformat` varchar(191) NOT NULL DEFAULT 'lexical',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generatepassword`
--

CREATE TABLE `generatepassword` (
  `id` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` varchar(191) NOT NULL,
  `user` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `userMessage` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `company` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `firstname` varchar(191) DEFAULT NULL,
  `hashpassword` varchar(191) NOT NULL,
  `lastname` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `salt` varchar(191) NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1419ecad-c2b3-45f3-b481-4e0322b2ac6d', '12009b48b25fba8eabe839606e57ebec72612877f9a260600836578aeb049338', '2024-06-26 17:08:40.715', '20240626170840_bluedill', NULL, NULL, '2024-06-26 17:08:40.645', 1),
('c22bf198-513a-46c9-b031-b024a89636be', '326002ddc17685d77b19bfcbb4eae5853a600b5687cb9b918cb3afa86ca359dd', '2024-06-26 17:10:36.308', '20240626171035_bluedill', NULL, NULL, '2024-06-26 17:10:35.852', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Chat_userEmail_key` (`userEmail`),
  ADD KEY `Chat_userId_idx` (`userId`);

--
-- Indexes for table `collaboratedocs`
--
ALTER TABLE `collaboratedocs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collaborator`
--
ALTER TABLE `collaborator`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Collaborator_collabId_idx` (`collabId`);

--
-- Indexes for table `docsencryption`
--
ALTER TABLE `docsencryption`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DocsEncryption_encryptDocsId_idx` (`encryptDocsId`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Document_docid_key` (`docid`);

--
-- Indexes for table `generatepassword`
--
ALTER TABLE `generatepassword`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `Chat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `collaborator`
--
ALTER TABLE `collaborator`
  ADD CONSTRAINT `Collaborator_collabId_fkey` FOREIGN KEY (`collabId`) REFERENCES `collaboratedocs` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
