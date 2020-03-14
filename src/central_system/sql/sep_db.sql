CREATE DATABASE comp2913_sep;
USE comp2913_sep;

-- --------------------------------------------------------

--
-- Definition of the table `Card`
--

CREATE TABLE `Card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(21) NOT NULL,
  `cvv` int(11) NOT NULL,
  `expire_date` varchar(6) NOT NULL,
  `type` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Facility`
--

CREATE TABLE `Facility` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `id_timetable` int(11) NOT NULL,
  `pic` varchar(400) NOT NULL DEFAULT '',
  `icon` varchar(400) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Lecturer`
--

CREATE TABLE `Lecturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(500) NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Sport`
--

CREATE TABLE `Sport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(5000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Timetable`
--

CREATE TABLE `Timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `validity` int(11) NOT NULL,
  `creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_pic` varchar(400) DEFAULT '',
  `name` varchar(400) NOT NULL,  
  `surname` varchar(400) NOT NULL,  
  `email` varchar(200) NOT NULL,
  `password` varchar(400) NOT NULL,
  `phone` varchar(200) NOT NULL,
  `address_1` varchar(500) NOT NULL,
  `address_2` varchar(500) DEFAULT '',
  `zipcode` varchar(8) NOT NULL,  
  `city` varchar(200) NOT NULL,
  `birth` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Membership`
--

CREATE TABLE `Membership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `validity` int(11) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_user` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_user`) REFERENCES User(`id`),
  FOREIGN KEY (`id_sport`) REFERENCES Sport(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Card_User`
--

CREATE TABLE `Card_User` (
  `id_card` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  FOREIGN KEY(`id_card`) REFERENCES Card(`id`),
  FOREIGN KEY(`id_user`) REFERENCES User(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity`
--

CREATE TABLE `Activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discount` double NOT NULL DEFAULT 0,
  `cost` double NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `duration` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY(`id_sport`) REFERENCES Sport(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Definition of the table `BookedActivity`
--

CREATE TABLE `BookedActivity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_activity` int(11) NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_activity`) REFERENCES Activity(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Session`
--

CREATE TABLE `Session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Lecturer_Activity`
--

CREATE TABLE `Lecturer_Activity` (
  `id_lecturer` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  FOREIGN KEY(`id_lecturer`) REFERENCES Lecturer(`id`),
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity_Session`
--

CREATE TABLE `Activity_Session` (
  `id_activity` int(11) NOT NULL,
  `id_session` int(11) NOT NULL,
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`),
  FOREIGN KEY(`id_session`) REFERENCES Session(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity_Timetable`
--

CREATE TABLE `Activity_Timetable` (
  `id_activity` int(11) NOT NULL,
  `id_timetable` int(11) NOT NULL,
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`),
  FOREIGN KEY(`id_timetable`) REFERENCES Timetable(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------


-- --------------------------------------------------------

--
-- Definition of the table `Payment`
--

CREATE TABLE `Payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL,
  `amount` double NOT NULL,
  `id_card` int(11) NOT NULL,
  `id_booked_activity` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_booked_activity`) REFERENCES BookedActivity(`id`),
  FOREIGN KEY (`id_card`) REFERENCES Card(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- SAMPLE DATA
--

-- Creating user (psw: 123456)
INSERT INTO User(name, surname, email, password, phone, address_1, zipcode, city) VALUES ('John', 'Doe', 'test@mail.com', 'e10adc3949ba59abbe56e057f20f883e', '+44 1234567890', 'Weetwood Lane', 'LS166IL', 'Leeds');

-- Creating a Facility with a timetable
INSERT INTO Timetable(validity) VALUES (365);
INSERT INTO Timetable(validity) VALUES (365);
INSERT INTO Facility (name, latitude, longitude, id_timetable, pic, icon) VALUES ('F.Pellegrini Swimming Pool', '53.804326', '-1.553167', 1, 'https://5rd1122q2fb2q9nsj36dtnqz-wpengine.netdna-ssl.com/wp-content/uploads/2015/04/swimming-pool-100x400.jpg', 'gym-white.png');
INSERT INTO Facility (name, latitude, longitude, id_timetable, pic, icon) VALUES ('M. Ali Box', '53.804326', '-1.553167', 2, 'https://cdn.squaremile.com/featured_image/5af42ccf55937.jpeg', 'gym-white.png');

-- Creating a sport with an activity by a lecturer
INSERT INTO Sport(name, description) VALUES ('Swimming', 'Free swimming, Sub Classes, Competitive Freestyle Swimming.');
INSERT INTO Sport(name, description) VALUES ('Kick Box', 'Lightweight, agility-based martial arts discipline.');
INSERT INTO Lecturer(full_name, email, phone) VALUES ('John Fish', 'iswimalot@gmail.com', '+44 1234567890');
INSERT INTO Activity (cost, duration, id_sport, start_time) VALUES (15, 60, 1, '2019-01-02');
INSERT INTO Activity (cost, duration, id_sport, start_time) VALUES (15, 60, 2, '2019-01-03');
INSERT INTO Activity (cost, duration, id_sport, start_time) VALUES (15, 60, 1, '2019-01-04');
INSERT INTO Activity (cost, duration, id_sport, start_time) VALUES (15, 60, 2, '2019-01-05');
INSERT INTO Activity (cost, duration, id_sport, start_time) VALUES (15, 60, 1, '2019-01-06');
INSERT INTO Lecturer_Activity (id_lecturer, id_activity) VALUES (1, 1);

-- Linking the activity to the facility timetable
INSERT INTO Activity_Timetable (id_activity, id_timetable) VALUES (1, 1);
INSERT INTO Activity_Timetable (id_activity, id_timetable) VALUES (2, 2);
INSERT INTO Activity_Timetable (id_activity, id_timetable) VALUES (3, 1);
INSERT INTO Activity_Timetable (id_activity, id_timetable) VALUES (4, 2);
INSERT INTO Activity_Timetable (id_activity, id_timetable) VALUES (5, 1);

-- Creating a membership
INSERT INTO Membership(validity, id_user, id_sport) VALUES (31, 1, 1);
INSERT INTO Membership(validity, id_user, id_sport) VALUES (14, 1, 2);

-- Payment simulation
INSERT INTO Card (number, cvv, expire_date, type) VALUES ('12345678901234567890', '123', '01/02', 'VISA');
INSERT INTO Card_User(id_card, id_user) VALUES (1, 1);

INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (1, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (2, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (3, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (4, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (5, '2020-01-01');

INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 1, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 2, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 3, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 4, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 5, 1);