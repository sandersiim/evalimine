-- phpMyAdmin SQL Dump
-- version 3.5.0
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 15, 2013 at 12:42 PM
-- Server version: 5.1.61-0+squeeze1
-- PHP Version: 5.3.15-1~dotdeb.0

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
-- Table structure for table `ev_candidates`
--

CREATE TABLE IF NOT EXISTS `ev_candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `regionId` int(11) NOT NULL,
  `partyId` int(11) NOT NULL,
  `voteCount` int(11) NOT NULL,
  `realName` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ev_users`
--

CREATE TABLE IF NOT EXISTS `ev_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL,
  `password` varchar(255) NOT NULL,
  `voteRegionId` int(11) NOT NULL,
  `votedCandidateId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `ev_users`
--

INSERT INTO `ev_users` (`id`, `username`, `password`, `voteRegionId`, `votedCandidateId`) VALUES
(1, 'testuser', 'A114489FB19F59AB059B6CCB20134187D516C08C', 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
