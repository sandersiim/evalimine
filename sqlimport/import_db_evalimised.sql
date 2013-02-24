-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 24, 2013 at 08:38 PM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `ev_candidates`
--

INSERT INTO `ev_candidates` (`id`, `userId`, `regionId`, `partyId`, `voteCount`, `firstName`, `lastName`) VALUES
(2, 1, 1, 1, 1, 'Mikk', 'Kukk'),
(3, 4, 2, 4, 1, 'Johanna', 'Hernes'),
(4, 5, 9, 4, 1, 'Richard', 'Burks'),
(5, 6, 9, 3, 0, 'Anna', 'Pihlakas'),
(6, 7, 9, 5, 1, 'Tõnu', 'Huup'),
(7, 8, 9, 2, 0, 'Joonas', 'Karu'),
(8, 9, 9, 3, 3, 'Mihkel', 'Mõhkel');

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
(1, 'toopartei', 'Raske töö partei'),
(2, 'niisama', 'Lihtsalt niisama partei'),
(3, 'vpp', 'Vasak-parem-partei'),
(4, 'kiir', 'Eesti Kiirtoidupartei'),
(5, 'eeskuju', 'Hea Eeskuju Partei');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=238 ;

--
-- Dumping data for table `ev_regions`
--

INSERT INTO `ev_regions` (`id`, `keyword`, `displayName`, `mapCoordsX`, `mapCoordsY`) VALUES
(1, 'tallinn_haabersti', 'Tallinn, Haabersti linnaosa', 0, 0),
(2, 'tallinn_kristiine', 'Tallinn, Kristiine linnaosa', 0, 0),
(3, 'tallinn_pohja', 'Tallinn, Põhja-Tallinn', 0, 0),
(5, 'tallinn_kesklinn', 'Tallinn, Kesklinn', 0, 0),
(6, 'tallinn_pirita', 'Tallinn, Pirita linnaosa', 0, 0),
(7, 'tallinn_mustamae', 'Tallinn, Mustamäe linnaosa', 0, 0),
(8, 'tallinn_nomme', 'Tallinn, Nõmme linnaosa', 0, 0),
(9, 'tartu', 'Tartu linn', 0, 0),
(14, 'harju_aegviidu', 'Harjumaa, Aegviidu vald', 0, 0),
(15, 'harju_anija', 'Harjumaa, Anija vald', 0, 0),
(16, 'harju_harku', 'Harjumaa, Harku vald', 0, 0),
(17, 'harju_joelahtme', 'Harjumaa, Jõelähtme vald', 0, 0),
(18, 'harju_keilavald', 'Harjumaa, Keila vald', 0, 0),
(19, 'harju_keila', 'Harjumaa, Keila linn', 0, 0),
(20, 'harju_kernu', 'Harjumaa, Kernu vald', 0, 0),
(21, 'harju_kiili', 'Harjumaa, Kiili vald', 0, 0),
(22, 'harju_kose', 'Harjumaa, Kose vald', 0, 0),
(23, 'harju_kuusalu', 'Harjumaa, Kuusalu vald', 0, 0),
(24, 'harju_koue', 'Harjumaa, Kõue vald', 0, 0),
(25, 'harju_loksa', 'Harjumaa, Loksa linn', 0, 0),
(26, 'harju_maardu', 'Harjumaa, Maardu linn', 0, 0),
(27, 'harju_nissi', 'Harjumaa, Nissi vald', 0, 0),
(28, 'harju_padise', 'Harjumaa, Padise vald', 0, 0),
(29, 'harju_paldiski', 'Harjumaa, Paldiski linn', 0, 0),
(30, 'harju_raasiku', 'Harjumaa, Raasiku vald', 0, 0),
(31, 'harju_rae', 'Harjumaa, Rae vald', 0, 0),
(32, 'harju_saku', 'Harjumaa, Saku vald', 0, 0),
(33, 'harju_sauevald', 'Harjumaa, Saue vald', 0, 0),
(34, 'harju_saue', 'Harjumaa, Saue linn', 0, 0),
(35, 'harju_vasalemma', 'Harjumaa, Vasalemma vald', 0, 0),
(36, 'harju_viimsi', 'Harjumaa, Viimsi vald', 0, 0),
(37, 'rapla_juuru', 'Raplamaa, Juuru vald', 0, 0),
(38, 'rapla_jarvakandi', 'Raplamaa, Järvakandi vald', 0, 0),
(39, 'rapla_kaiu', 'Raplamaa, Kaiu vald', 0, 0),
(40, 'rapla_kehtna', 'Raplamaa, Kehtna vald', 0, 0),
(41, 'rapla_kohila', 'Raplamaa, Kohila vald', 0, 0),
(42, 'rapla_karu', 'Raplamaa, Käru vald', 0, 0),
(43, 'rapla_marjamaa', 'Raplamaa, Märjamaa vald', 0, 0),
(44, 'rapla_raikkula', 'Raplamaa, Raikküla vald', 0, 0),
(45, 'rapla_rapla', 'Raplamaa, Rapla vald', 0, 0),
(46, 'rapla_vigala', 'Raplamaa, Vigala vald', 0, 0),
(47, 'hiiu_emmaste', 'Hiiumaa, Emmaste vald', 0, 0),
(48, 'hiiu_kaina', 'Hiiumaa, Käina vald', 0, 0),
(49, 'hiiu_kardla', 'Hiiumaa, Kärdla linn', 0, 0),
(50, 'hiiu_korgessaare', 'Hiiumaa, Kõrgessaare vald', 0, 0),
(51, 'hiiu_puhalepa', 'Hiiumaa, Pühalepa vald', 0, 0),
(52, 'laane_haapsalu', 'Läänemaa, Haapsalu linn', 0, 0),
(53, 'laane_hanila', 'Läänemaa, Hanila vald', 0, 0),
(54, 'laane_kullamaa', 'Läänemaa, Kullamaa vald', 0, 0),
(55, 'laane_lihula', 'Läänemaa, Lihula vald', 0, 0),
(56, 'laane_martna', 'Läänemaa, Martna vald', 0, 0),
(57, 'laane_noarootsi', 'Läänemaa, Noarootsi vald', 0, 0),
(58, 'laane_nova', 'Läänemaa, Nõva vald', 0, 0),
(59, 'laane_oru', 'Läänemaa, Oru vald', 0, 0),
(60, 'laane_ridala', 'Läänemaa, Ridala vald', 0, 0),
(61, 'laane_risti', 'Läänemaa, Risti vald', 0, 0),
(62, 'laane_taebla', 'Läänemaa, Taebla vald', 0, 0),
(63, 'laane_vormsi', 'Läänemaa, Vormsi vald', 0, 0),
(64, 'saare_kaarma', 'Saaremaa, Kaarma vald', 0, 0),
(65, 'saare_kihelkonna', 'Saaremaa, Kihelkonna vald', 0, 0),
(66, 'saare_kuressaare', 'Saaremaa, Kuressaare linn', 0, 0),
(67, 'saare_karla', 'Saaremaa, Kärla vald', 0, 0),
(68, 'saare_laimjala', 'Saaremaa, Laimjala vald', 0, 0),
(69, 'saare_leisi', 'Saaremaa, Leisi vald', 0, 0),
(70, 'saare_lumanda', 'Saaremaa, Lümanda vald', 0, 0),
(71, 'saare_muhu', 'Saaremaa, Muhu vald', 0, 0),
(72, 'saare_mustjala', 'Saaremaa, Mustjala vald', 0, 0),
(73, 'saare_orissaare', 'Saaremaa, Orissaare vald', 0, 0),
(74, 'saare_pihtla', 'Saaremaa, Pihtla vald', 0, 0),
(75, 'saare_poide', 'Saaremaa, Pöide vald', 0, 0),
(76, 'saare_ruhnu', 'Saaremaa, Ruhnu vald', 0, 0),
(77, 'saare_salme', 'Saaremaa, Salme vald', 0, 0),
(78, 'saare_torgu', 'Saaremaa, Torgu vald', 0, 0),
(79, 'saare_valjala', 'Saaremaa, Valjala vald', 0, 0),
(80, 'laaneviru_haljala', 'Lääne-Virumaa, Haljala vald', 0, 0),
(81, 'laaneviru_kadrina', 'Lääne-Virumaa, Kadrina vald', 0, 0),
(82, 'laaneviru_kunda', 'Lääne-Virumaa, Kunda linn', 0, 0),
(83, 'laaneviru_laekvere', 'Lääne-Virumaa, Laekvere vald', 0, 0),
(84, 'laaneviru_rakke', 'Lääne-Virumaa, Rakke vald', 0, 0),
(85, 'laaneviru_rakverevald', 'Lääne-Virumaa, Rakvere vald', 0, 0),
(86, 'laaneviru_rakvere', 'Lääne-Virumaa, Rakvere linn', 0, 0),
(87, 'laaneviru_ragavere', 'Lääne-Virumaa, Rägavere vald', 0, 0),
(88, 'laaneviru_someru', 'Lääne-Virumaa, Sõmeru vald', 0, 0),
(89, 'laaneviru_tamsalu', 'Lääne-Virumaa, Tamsalu vald', 0, 0),
(90, 'laaneviru_tapa', 'Lääne-Virumaa, Tapa vald', 0, 0),
(91, 'laaneviru_vihula', 'Lääne-Virumaa, Vihula vald', 0, 0),
(92, 'laaneviru_vinni', 'Lääne-Virumaa, Vinni vald', 0, 0),
(93, 'laaneviru_virunigula', 'Lääne-Virumaa, Viru-Nigula vald', 0, 0),
(94, 'laaneviru_vaikemaarja', 'Lääne-Virumaa, Väike-Maarja vald', 0, 0),
(95, 'idaviru_alajoe', 'Ida-Virumaa, Alajõe vald', 0, 0),
(96, 'idaviru_aseri', 'Ida-Virumaa, Aseri vald', 0, 0),
(97, 'idaviru_avinurme', 'Ida-Virumaa, Avinurme vald', 0, 0),
(98, 'idaviru_iisaku', 'Ida-Virumaa, Iisaku vald', 0, 0),
(99, 'idaviru_illuka', 'Ida-Virumaa, Illuka vald', 0, 0),
(100, 'idaviru_johvi', 'Ida-Virumaa, Jõhvi vald', 0, 0),
(101, 'idaviru_kivioli', 'Ida-Virumaa, Kiviõli linn', 0, 0),
(102, 'idaviru_kohtla', 'Ida-Virumaa, Kohtla vald', 0, 0),
(103, 'idaviru_kohtlajarve', 'Ida-Virumaa, Kohtla-Järve linn', 0, 0),
(104, 'idaviru_kohtlanomme', 'Ida-Virumaa, Kohtla-Nõmme vald', 0, 0),
(105, 'idaviru_lohusuu', 'Ida-Virumaa, Lohusuu vald', 0, 0),
(106, 'idaviru_luganuse', 'Ida-Virumaa, Lüganuse vald', 0, 0),
(107, 'idaviru_maidla', 'Ida-Virumaa, Maidla vald', 0, 0),
(108, 'idaviru_maetaguse', 'Ida-Virumaa, Mäetaguse vald', 0, 0),
(109, 'idaviru_narva', 'Ida-Virumaa, Narva linn', 0, 0),
(110, 'idaviru_narvajoesuu', 'Ida-Virumaa, Narva-Jõesuu linn', 0, 0),
(111, 'idaviru_pussi', 'Ida-Virumaa, Püssi linn', 0, 0),
(112, 'idaviru_sillamae', 'Ida-Virumaa, Sillamäe linn', 0, 0),
(113, 'idaviru_sonda', 'Ida-Virumaa, Sonda vald', 0, 0),
(114, 'idaviru_toila', 'Ida-Virumaa, Toila vald', 0, 0),
(115, 'idaviru_tudulinna', 'Ida-Virumaa, Tudulinna vald', 0, 0),
(116, 'idaviru_vaivara', 'Ida-Virumaa, Vaivara vald', 0, 0),
(117, 'jarva_albu', 'Järvamaa, Albu vald', 0, 0),
(118, 'jarva_ambla', 'Järvamaa, Ambla vald', 0, 0),
(119, 'jarva_imavere', 'Järvamaa, Imavere vald', 0, 0),
(120, 'jarva_jarvajaani', 'Järvamaa, Järva-Jaani vald', 0, 0),
(121, 'jarva_kareda', 'Järvamaa, Kareda vald', 0, 0),
(122, 'jarva_koeru', 'Järvamaa, Koeru vald', 0, 0),
(123, 'jarva_koigi', 'Järvamaa, Koigi vald', 0, 0),
(124, 'jarva_paidevald', 'Järvamaa, Paide vald', 0, 0),
(125, 'jarva_paide', 'Järvamaa, Paide linn', 0, 0),
(126, 'jarva_roosnaalliku', 'Järvamaa, Roosna-Alliku vald', 0, 0),
(127, 'jarva_turi', 'Järvamaa, Türi vald', 0, 0),
(128, 'jarva_vaatsa', 'Järvamaa, Väätsa vald', 0, 0),
(129, 'viljandi_abja', 'Viljandimaa, Abja vald', 0, 0),
(130, 'viljandi_halliste', 'Viljandimaa, Halliste vald', 0, 0),
(131, 'viljandi_kolgajaani', 'Viljandimaa, Kolga-Jaani vald', 0, 0),
(132, 'viljandi_koo', 'Viljandimaa, Kõo vald', 0, 0),
(133, 'viljandi_kopu', 'Viljandimaa, Kõpu vald', 0, 0),
(134, 'viljandi_moisakula', 'Viljandimaa, Mõisaküla linn', 0, 0),
(135, 'viljandi_paistu', 'Viljandimaa, Paistu vald', 0, 0),
(136, 'viljandi_karksi', 'Viljandimaa, Karksi vald', 0, 0),
(137, 'viljandi_parsti', 'Viljandimaa, Pärsti vald', 0, 0),
(138, 'viljandi_saarepeedi', 'Viljandimaa, Saarepeedi vald', 0, 0),
(139, 'viljandi_suurejaani', 'Viljandimaa, Suure-Jaani vald', 0, 0),
(140, 'viljandi_tarvastu', 'Viljandimaa, Tarvastu vald', 0, 0),
(141, 'viljandi_viiratsi', 'Viljandimaa, Viiratsi vald', 0, 0),
(142, 'viljandi_viljandi', 'Viljandimaa, Viljandi linn', 0, 0),
(143, 'viljandi_vohma', 'Viljandimaa, Võhma linn', 0, 0),
(144, 'jogeva_jogevavald', 'Jõgevamaa, Jõgeva vald', 0, 0),
(145, 'jogeva_jogeva', 'Jõgevamaa, Jõgeva linn', 0, 0),
(146, 'jogeva_mustvee', 'Jõgevamaa, Mustvee linn', 0, 0),
(147, 'jogeva_pajusi', 'Jõgevamaa, Pajusi vald', 0, 0),
(148, 'jogeva_pala', 'Jõgevamaa, Pala vald', 0, 0),
(149, 'jogeva_palamuse', 'Jõgevamaa, Palamuse vald', 0, 0),
(150, 'jogeva_puurmani', 'Jõgevamaa, Puurmani vald', 0, 0),
(151, 'jogeva_poltsamaavald', 'Jõgevamaa, Põltsamaa vald', 0, 0),
(152, 'jogeva_poltsamaa', 'Jõgevamaa, Põltsamaa linn', 0, 0),
(153, 'jogeva_kasepaa', 'Jõgevamaa, Kasepää vald', 0, 0),
(154, 'jogeva_saare', 'Jõgevamaa, Saare vald', 0, 0),
(155, 'jogeva_tabivere', 'Jõgevamaa, Tabivere vald', 0, 0),
(156, 'jogeva_torma', 'Jõgevamaa, Torma vald', 0, 0),
(157, 'tartumaa_alatskivi', 'Tartumaa, Alatskivi vald', 0, 0),
(158, 'tartumaa_elva', 'Tartumaa, Elva linn', 0, 0),
(159, 'tartumaa_haaslava', 'Tartumaa, Haaslava vald', 0, 0),
(160, 'tartumaa_kallaste', 'Tartumaa, Kallaste linn', 0, 0),
(161, 'tartumaa_kambja', 'Tartumaa, Kambja vald', 0, 0),
(162, 'tartumaa_konguta', 'Tartumaa, Konguta vald', 0, 0),
(163, 'tartumaa_laeva', 'Tartumaa, Laeva vald', 0, 0),
(164, 'tartumaa_luunja', 'Tartumaa, Luunja vald', 0, 0),
(165, 'tartumaa_meeksi', 'Tartumaa, Meeksi vald', 0, 0),
(166, 'tartumaa_maksa', 'Tartumaa, Mäksa vald', 0, 0),
(167, 'tartumaa_noo', 'Tartumaa, Nõo vald', 0, 0),
(168, 'tartumaa_peipsiaare', 'Tartumaa, Peipsiääre vald', 0, 0),
(169, 'tartumaa_piirissaare', 'Tartumaa, Piirissaare vald', 0, 0),
(170, 'tartumaa_puhja', 'Tartumaa, Puhja vald', 0, 0),
(171, 'tartumaa_rannu', 'Tartumaa, Rannu vald', 0, 0),
(172, 'tartumaa_rongu', 'Tartumaa, Rõngu vald', 0, 0),
(173, 'tartumaa_tartu', 'Tartumaa, Tartu vald', 0, 0),
(174, 'tartumaa_tahtvere', 'Tartumaa, Tähtvere vald', 0, 0),
(175, 'tartumaa_vara', 'Tartumaa, Vara vald', 0, 0),
(176, 'tartumaa_vonnu', 'Tartumaa, Võnnu vald', 0, 0),
(177, 'tartumaa_ulenurme', 'Tartumaa, Ülenurme vald', 0, 0),
(178, 'voru_antsla', 'Võrumaa, Antsla vald', 0, 0),
(179, 'voru_haanja', 'Võrumaa, Haanja vald', 0, 0),
(180, 'voru_lasva', 'Võrumaa, Lasva vald', 0, 0),
(181, 'voru_meremae', 'Võrumaa, Meremäe vald', 0, 0),
(182, 'voru_misso', 'Võrumaa, Misso vald', 0, 0),
(183, 'voru_moniste', 'Võrumaa, Mõniste vald', 0, 0),
(184, 'voru_rouge', 'Võrumaa, Rõuge vald', 0, 0),
(185, 'voru_somerpalu', 'Võrumaa, Sõmerpalu vald', 0, 0),
(186, 'voru_urvaste', 'Võrumaa, Urvaste vald', 0, 0),
(187, 'voru_varstu', 'Võrumaa, Varstu vald', 0, 0),
(188, 'voru_vastseliina', 'Võrumaa, Vastseliina vald', 0, 0),
(189, 'voru_voruvald', 'Võrumaa, Võru vald', 0, 0),
(190, 'voru_voru', 'Võrumaa, Võru linn', 0, 0),
(191, 'valga_helme', 'Valgamaa, Helme vald', 0, 0),
(192, 'valga_hummuli', 'Valgamaa, Hummuli vald', 0, 0),
(193, 'valga_karula', 'Valgamaa, Karula vald', 0, 0),
(194, 'valga_palupera', 'Valgamaa, Palupera vald', 0, 0),
(195, 'valga_puka', 'Valgamaa, Puka vald', 0, 0),
(196, 'valga_podrala', 'Valgamaa, Põdrala vald', 0, 0),
(197, 'valga_otepaa', 'Valgamaa, Otepää vald', 0, 0),
(198, 'valga_sangaste', 'Valgamaa, Sangaste vald', 0, 0),
(199, 'valga_taheva', 'Valgamaa, Taheva vald', 0, 0),
(200, 'valga_tolliste', 'Valgamaa, Tõlliste vald', 0, 0),
(201, 'valga_torva', 'Valgamaa, Tõrva linn', 0, 0),
(202, 'valga_valga', 'Valgamaa, Valga linn', 0, 0),
(203, 'valga_oru', 'Valgamaa, Õru vald', 0, 0),
(204, 'polva_ahja', 'Põlvamaa, Ahja vald', 0, 0),
(205, 'polva_kanepi', 'Põlvamaa, Kanepi vald', 0, 0),
(206, 'polva_kolleste', 'Põlvamaa, Kõlleste vald', 0, 0),
(207, 'polva_laheda', 'Põlvamaa, Laheda vald', 0, 0),
(208, 'polva_mikitamae', 'Põlvamaa, Mikitamäe vald', 0, 0),
(209, 'polva_mooste', 'Põlvamaa, Mooste vald', 0, 0),
(210, 'polva_orava', 'Põlvamaa, Orava vald', 0, 0),
(211, 'polva_polvavald', 'Põlvamaa, Põlva vald', 0, 0),
(212, 'polva_polva', 'Põlvamaa, Põlva linn', 0, 0),
(213, 'polva_rapina', 'Põlvamaa, Räpina vald', 0, 0),
(214, 'polva_valgjarve', 'Põlvamaa, Valgjärve vald', 0, 0),
(215, 'polva_vastsekuuste', 'Põlvamaa, Vastse-Kuuste vald', 0, 0),
(216, 'polva_veriora', 'Põlvamaa, Veriora vald', 0, 0),
(217, 'polva_varska', 'Põlvamaa, Värska vald', 0, 0),
(218, 'parnu_are', 'Pärnumaa, Are vald', 0, 0),
(219, 'parnu_audru', 'Pärnumaa, Audru vald', 0, 0),
(220, 'parnu_halinga', 'Pärnumaa, Halinga vald', 0, 0),
(221, 'parnu_haademeeste', 'Pärnumaa, Häädemeeste vald', 0, 0),
(222, 'parnu_kihnu', 'Pärnumaa, Kihnu vald', 0, 0),
(223, 'parnu_koonga', 'Pärnumaa, Koonga vald', 0, 0),
(224, 'parnu_lavassaare', 'Pärnumaa, Lavassaare vald', 0, 0),
(225, 'parnu_paikuse', 'Pärnumaa, Paikuse vald', 0, 0),
(226, 'parnu_parnu', 'Pärnumaa, Pärnu linn', 0, 0),
(227, 'parnu_saarde', 'Pärnumaa, Saarde vald', 0, 0),
(228, 'parnu_sauga', 'Pärnumaa, Sauga vald', 0, 0),
(229, 'parnu_sindi', 'Pärnumaa, Sindi linn', 0, 0),
(230, 'parnu_surju', 'Pärnumaa, Surju vald', 0, 0),
(231, 'parnu_tootsi', 'Pärnumaa, Tootsi vald', 0, 0),
(232, 'parnu_tori', 'Pärnumaa, Tori vald', 0, 0),
(233, 'parnu_tostamaa', 'Pärnumaa, Tõstamaa vald', 0, 0),
(234, 'parnu_tahkuranna', 'Pärnumaa, Tahkuranna vald', 0, 0),
(235, 'parnu_varbla', 'Pärnumaa, Varbla vald', 0, 0),
(236, 'parnu_vandravald', 'Pärnumaa, Vändra vald', 0, 0),
(237, 'parnu_vandra', 'Pärnumaa, Vändra alev', 0, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `ev_users`
--

INSERT INTO `ev_users` (`id`, `username`, `password`, `voteRegionId`, `votedCandidateId`) VALUES
(1, '39010101234', 'A114489FB19F59AB059B6CCB20134187D516C08C', 1, 2),
(2, '48902114321', 'A114489FB19F59AB059B6CCB20134187D516C08C', 1, 0),
(4, '48912110486', 'A114489FB19F59AB059B6CCB20134187D516C08C', 2, 3),
(5, '38512218487', 'A114489FB19F59AB059B6CCB20134187D516C08C', 9, 8),
(6, '49302275148', 'A114489FB19F59AB059B6CCB20134187D516C08C', 9, 8),
(7, '38201102548', 'A114489FB19F59AB059B6CCB20134187D516C08C', 9, 8),
(8, '37905255149', 'A114489FB19F59AB059B6CCB20134187D516C08C', 9, 6),
(9, '39111145848', 'A114489FB19F59AB059B6CCB20134187D516C08C', 9, 4);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
