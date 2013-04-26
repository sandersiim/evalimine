-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 26, 2013 at 06:50 PM
-- Server version: 5.5.24-log
-- PHP Version: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `evalimised`
--

-- --------------------------------------------------------

--
-- Table structure for table `ev_admins`
--

CREATE TABLE IF NOT EXISTS `ev_admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL,
  `password` varchar(63) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `ev_admins`
--

INSERT INTO `ev_admins` (`id`, `username`, `password`) VALUES
(1, 'mainadmin', 'A114489FB19F59AB059B6CCB20134187D516C08C');

-- --------------------------------------------------------

--
-- Table structure for table `ev_candidates`
--

CREATE TABLE IF NOT EXISTS `ev_candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `regionId` int(11) NOT NULL,
  `partyId` int(11) NOT NULL,
  `voteCount` int(11) NOT NULL DEFAULT '0',
  `firstName` varchar(63) NOT NULL,
  `lastName` varchar(63) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- Dumping data for table `ev_candidates`
--

INSERT INTO `ev_candidates` (`id`, `userId`, `regionId`, `partyId`, `voteCount`, `firstName`, `lastName`) VALUES
(10, 1001, 2, 4, 144, 'Augustus', 'Caesar'),
(11, 1002, 3, 2, 69, 'Gaius', 'Acilius'),
(12, 1003, 4, 3, 81, 'Aemilia', 'Scaura'),
(13, 1004, 5, 3, 78, 'Sextus', 'Calpurnius'),
(14, 1005, 6, 4, 142, 'Arusanius', 'Messius'),
(15, 1006, 7, 3, 93, 'Titus', 'Quinctius'),
(16, 1007, 8, 5, 11, 'Gaius', 'Longinus'),
(17, 1008, 9, 1, 13, 'Dionysus', 'Cato'),
(18, 1009, 10, 2, 49, 'Flavius', 'Sosipater'),
(19, 1010, 11, 4, 172, 'Marcus', 'Aurelius'),
(20, 1011, 12, 1, 143, 'Julius', 'Caesar'),
(21, 1012, 13, 3, 123, 'Sokrates', 'Philosophicae'),
(22, 1013, 14, 5, 13, 'Hugues', 'de Payens'),
(23, 1014, 6, 1, 138, 'Maximus', 'Meridius'),
(24, 1020, 1, 2, 35, 'Lampus', 'Maximus'),
(25, 1015, 2, 2, 101, 'Isidorus', 'Ispalensis'),
(26, 1016, 2, 1, 49, 'Spurius', 'Tricipitinus'),
(27, 1017, 3, 2, 105, 'Macrobius', 'Ambrosius'),
(28, 1018, 4, 3, 68, 'Gnaeus', 'Octavius'),
(29, 1019, 5, 3, 34, 'Paulus', 'Orosius'),
(30, 1030, 1, 3, 31, 'Esteticus', 'Lipicus'),
(31, 1031, 7, 1, 55, 'Pioneerus', 'Roppus'),
(32, 1032, 10, 5, 12, 'Marcus', 'Cicero'),
(33, 1033, 3, 4, 29, 'Paslicus', 'Samblic'),
(44, 1023, 15, 5, 33, 'Aplus', 'Peetus');

-- --------------------------------------------------------

--
-- Table structure for table `ev_parties`
--

CREATE TABLE IF NOT EXISTS `ev_parties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(31) NOT NULL,
  `displayName` varchar(63) NOT NULL,
  `color` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyword` (`keyword`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `ev_parties`
--

INSERT INTO `ev_parties` (`id`, `keyword`, `displayName`, `color`) VALUES
(1, 'legion', 'Leegionärid', 'red'),
(2, 'germaanid', 'Germaani hõimud', '#B38C62'),
(3, 'filosoofid', 'Filosoofid', '#435BF7'),
(4, 'pax', 'Pax Romana', 'white'),
(5, 'ryytlid', 'Templirüütlid', 'orange');

-- --------------------------------------------------------

--
-- Table structure for table `ev_regions`
--

CREATE TABLE IF NOT EXISTS `ev_regions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(31) NOT NULL,
  `displayName` varchar(63) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyword` (`keyword`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `ev_regions`
--

INSERT INTO `ev_regions` (`id`, `keyword`, `displayName`, `latitude`, `longitude`) VALUES
(1, 'harju', 'Harjumaa', 59.4301993, 24.7438055),
(2, 'hiiu', 'Hiiumaa', 58.9915704, 22.7239216),
(3, 'idaviru', 'Ida-Virumaa', 59.3583172, 27.4129738),
(4, 'jogeva', 'Jõgevamaa', 58.7458582, 26.3978809),
(5, 'jarva', 'Järvamaa', 58.8856169, 25.5718254),
(6, 'laane', 'Läänemaa', 58.9468339, 23.5315637),
(7, 'laaneviru', 'Lääne-Virumaa', 59.3494849, 26.3479999),
(8, 'polva', 'Põlvamaa', 58.0532036, 27.0515559),
(9, 'parnu', 'Pärnumaa', 58.383701, 24.4962052),
(10, 'rapla', 'Raplamaa', 59.0244395, 24.7703227),
(11, 'saare', 'Saaremaa', 58.2524238, 22.485269),
(12, 'tartu', 'Tartumaa', 58.3734987, 26.7196335),
(13, 'valga', 'Valgamaa', 57.7775553, 26.0337268),
(14, 'viljandi', 'Viljandimaa', 58.3631104, 25.5947057),
(15, 'voru', 'Võrumaa', 57.8481018, 26.9943342);

-- --------------------------------------------------------

--
-- Table structure for table `ev_users`
--

CREATE TABLE IF NOT EXISTS `ev_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL,
  `password` varchar(255) NOT NULL,
  `voteRegionId` int(11) NOT NULL DEFAULT '0',
  `votedCandidateId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1034 ;

--
-- Dumping data for table `ev_users`
--

INSERT INTO `ev_users` (`id`, `username`, `password`, `voteRegionId`, `votedCandidateId`) VALUES
(10, '39208100868', 'CDB6B4124D0E8965876BAADE0542340115E14F44', 1, 0),
(1001, '1001', 'A114489FB19F59AB059B6CCB20134187D516C08C', 2, 10),
(1002, '1002', 'A114489FB19F59AB059B6CCB20134187D516C08C', 3, 0),
(1003, '1003', 'A114489FB19F59AB059B6CCB20134187D516C08C', 4, 0),
(1004, '1004', 'A114489FB19F59AB059B6CCB20134187D516C08C', 5, 13),
(1005, '1005', 'A114489FB19F59AB059B6CCB20134187D516C08C', 6, 0),
(1006, '1006', 'A114489FB19F59AB059B6CCB20134187D516C08C', 7, 0),
(1007, '1007', 'A114489FB19F59AB059B6CCB20134187D516C08C', 8, 0),
(1008, '1008', 'A114489FB19F59AB059B6CCB20134187D516C08C', 9, 0),
(1009, '1009', 'A114489FB19F59AB059B6CCB20134187D516C08C', 10, 0),
(1010, '1010', 'A114489FB19F59AB059B6CCB20134187D516C08C', 11, 0),
(1011, '1011', 'A114489FB19F59AB059B6CCB20134187D516C08C', 12, 0),
(1012, '1012', 'A114489FB19F59AB059B6CCB20134187D516C08C', 13, 0),
(1013, '1013', 'A114489FB19F59AB059B6CCB20134187D516C08C', 14, 0),
(1014, '1014', 'A114489FB19F59AB059B6CCB20134187D516C08C', 6, 0),
(1015, '1015', 'A114489FB19F59AB059B6CCB20134187D516C08C', 2, 0),
(1016, '1016', 'A114489FB19F59AB059B6CCB20134187D516C08C', 2, 0),
(1017, '1017', 'A114489FB19F59AB059B6CCB20134187D516C08C', 3, 0),
(1018, '1018', 'A114489FB19F59AB059B6CCB20134187D516C08C', 4, 0),
(1019, '1019', 'A114489FB19F59AB059B6CCB20134187D516C08C', 5, 0),
(1020, '1020', 'A114489FB19F59AB059B6CCB20134187D516C08C', 1, 0),
(1021, '1021', 'A114489FB19F59AB059B6CCB20134187D516C08C', 1, 24),
(1022, '1022', 'A114489FB19F59AB059B6CCB20134187D516C08C', 1, 0),
(1023, '1023', 'A114489FB19F59AB059B6CCB20134187D516C08C', 15, 0),
(1030, '1030', 'A114489FB19F59AB059B6CCB20134187D516C08C', 1, 0),
(1031, '1031', 'A114489FB19F59AB059B6CCB20134187D516C08C', 7, 0),
(1032, '1032', 'A114489FB19F59AB059B6CCB20134187D516C08C', 10, 0),
(1033, '1033', 'A114489FB19F59AB059B6CCB20134187D516C08C', 3, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
