-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 26, 2013 at 01:44 AM
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- Dumping data for table `ev_candidates`
--

INSERT INTO `ev_candidates` (`id`, `userId`, `regionId`, `partyId`, `voteCount`, `firstName`, `lastName`) VALUES
(10, 1001, 2, 4, 144, 'Augustus', 'Caesar'),
(11, 1002, 3, 2, 69, 'Gaius', 'Acilius'),
(12, 1003, 4, 3, 81, 'Aemilia', 'Scaura'),
(13, 1004, 5, 3, 77, 'Sextus', 'Calpurnius'),
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
(29, 1019, 5, 3, 34, 'Paulus', 'Orosius');

-- --------------------------------------------------------

--
-- Table structure for table `ev_parties`
--

CREATE TABLE IF NOT EXISTS `ev_parties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(31) NOT NULL,
  `displayName` varchar(63) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyword` (`keyword`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `ev_parties`
--

INSERT INTO `ev_parties` (`id`, `keyword`, `displayName`) VALUES
(1, 'legion', 'Leegionärid'),
(2, 'germaanid', 'Germaani hõimud'),
(3, 'filosoofid', 'Filosoofid'),
(4, 'pax', 'Pax Romana'),
(5, 'ryytlid', 'Templirüütlid');

-- --------------------------------------------------------

--
-- Table structure for table `ev_regions`
--

CREATE TABLE IF NOT EXISTS `ev_regions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(31) NOT NULL,
  `displayName` varchar(63) NOT NULL,
  `mapCoordsX` int(11) NOT NULL,
  `mapCoordsY` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyword` (`keyword`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `ev_regions`
--

INSERT INTO `ev_regions` (`id`, `keyword`, `displayName`, `mapCoordsX`, `mapCoordsY`) VALUES
(1, 'porta_capena', 'Porta Capena', 0, 0),
(2, 'caelimontium', 'Caelimontium', 0, 0),
(3, 'isis_et_seraphis', 'Isis et Seraphis', 0, 0),
(4, 'templum_pacis', 'Templum Pacis', 0, 0),
(5, 'esquiliae', 'Esquiliae', 0, 0),
(6, 'alta_semita', 'Alta Semita', 0, 0),
(7, 'via_lata', 'Via Lata', 0, 0),
(8, 'forum_romanum', 'Forum Romanum', 0, 0),
(9, 'circus_flaminius', 'Circus Flaminius', 0, 0),
(10, 'palatium', 'Palatium', 0, 0),
(11, 'circus_maximus', 'Circus Maximus', 0, 0),
(12, 'piscina_publica', 'Piscina Publica', 0, 0),
(13, 'aventinus', 'Aventinus', 0, 0),
(14, 'transtiberim', 'Transtiberim', 0, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `ev_users`
--

INSERT INTO `ev_users` (`id`, `username`, `password`, `voteRegionId`, `votedCandidateId`) VALUES
(10, '39208100868', 'CDB6B4124D0E8965876BAADE0542340115E14F44', 1, 0),
(1001, '1001', 'A114489FB19F59AB059B6CCB20134187D516C08C', 2, 10),
(1002, '1002', 'A114489FB19F59AB059B6CCB20134187D516C08C', 3, 0),
(1003, '1003', 'A114489FB19F59AB059B6CCB20134187D516C08C', 4, 0),
(1004, '1004', 'A114489FB19F59AB059B6CCB20134187D516C08C', 5, 0),
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
(1022, '1022', 'A114489FB19F59AB059B6CCB20134187D516C08C', 1, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
