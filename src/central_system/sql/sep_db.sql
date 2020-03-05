-- --------------------------------------------------------

--
-- Definition of the table `Activity`
--

CREATE TABLE `Activity` (
  `id` int(11) NOT NULL,
  `discount` double NOT NULL,
  `cost` double NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `duration` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity_Session`
--

CREATE TABLE `Activity_Session` (
  `id_activity` int(11) NOT NULL,
  `id_session` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity_Timetable`
--

CREATE TABLE `Activity_Timetable` (
  `id_activity` int(11) NOT NULL,
  `id_timetable` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table ``
--

CREATE TABLE `BookedActivity` (
  `id` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Card`
--

CREATE TABLE `Card` (
  `id` int(11) NOT NULL,
  `number` varchar(21) NOT NULL,
  `cvv` int(11) NOT NULL,
  `expire_date` varchar(6) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Card_User`
--

CREATE TABLE `Card_User` (
  `id_card` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Facility`
--

CREATE TABLE `Facility` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `id_timetable` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Lecturer`
--

CREATE TABLE `Lecturer` (
  `id` int(11) NOT NULL,
  `full_name` varchar(500) NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Lecturer_Activity`
--

CREATE TABLE `Lecturer_Activity` (
  `id_lecturer` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Membership`
--

CREATE TABLE `Membership` (
  `id` int(11) NOT NULL,
  `validity` int(11) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Membership_User`
--

CREATE TABLE `Membership_User` (
  `id_membership` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Payment`
--

CREATE TABLE `Payment` (
  `id` int(11) NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL,
  `amount` double NOT NULL,
  `id_card` int(11) NOT NULL,
  `id_booked_activity` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Session`
--

CREATE TABLE `Session` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Sport`
--

CREATE TABLE `Sport` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` varchar(5000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Sport_Membership`
--

CREATE TABLE `Sport_Membership` (
  `id_sport` int(11) NOT NULL,
  `id_membership` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Timetable`
--

CREATE TABLE `Timetable` (
  `id` int(11) NOT NULL,
  `validity` int(11) NOT NULL,
  `creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `full_name` varchar(400) NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL,
  `birth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for table scaricate
--

--
-- Indexes for table `BookedActivity`
--
ALTER TABLE `BookedActivity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Card`
--
ALTER TABLE `Card`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Facility`
--
ALTER TABLE `Facility`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Lecturer`
--
ALTER TABLE `Lecturer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Membership`
--
ALTER TABLE `Membership`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Sport`
--
ALTER TABLE `Sport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Timetable`
--
ALTER TABLE `Timetable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for `Card`
--
ALTER TABLE `Card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for `Lecturer`
--
ALTER TABLE `Lecturer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for `Membership`
--
ALTER TABLE `Membership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
