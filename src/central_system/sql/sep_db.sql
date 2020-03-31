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
-- Definition of the table `Image`
--

CREATE TABLE `Image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ext` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Facility`
--

CREATE TABLE `Facility` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(5000) NOT NULL,
  `price` double NOT NULL,
  `icon` varchar(400) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `FacilityImage`
--

CREATE TABLE `FacilityImage` (
  `id_image` int(11) NOT NULL,
  `id_facility` int(11) NOT NULL,
  PRIMARY KEY (`id_image`, `id_facility`),
  FOREIGN KEY(`id_image`) REFERENCES Image(`id`),
  FOREIGN KEY(`id_facility`) REFERENCES Facility(`id`) ON DELETE CASCADE
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
  `type` int(11) NOT NULL DEFAULT 1,
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
  FOREIGN KEY(`id_card`) REFERENCES Card(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`id_user`) REFERENCES User(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Activity`
--

CREATE TABLE `Activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `description` varchar(5000) NOT NULL,
  `discount` double DEFAULT 0,
  `cost` double NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `duration` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  `id_facility` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY(`id_sport`) REFERENCES Sport(`id`),
  FOREIGN KEY(`id_facility`) REFERENCES Facility(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `ActivityImage`
--

CREATE TABLE `ActivityImage` (
  `id_image` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  PRIMARY KEY (`id_image`, `id_activity`),
  FOREIGN KEY(`id_image`) REFERENCES Image(`id`),
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`) ON DELETE CASCADE
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
  FOREIGN KEY (`id_activity`) REFERENCES Activity(`id`) ON DELETE CASCADE
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
  FOREIGN KEY(`id_activity`) REFERENCES Activity(`id`) ON DELETE CASCADE
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
-- Definition of the table `Activity_Session`
--

CREATE TABLE `Log_User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`id_user`) REFERENCES User(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Definition of the table `Payment`
--

CREATE TABLE `Payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT 1,
  `amount` double NOT NULL,
  `id_card` int(11) NOT NULL,
  `id_booked_activity` int(11),
  `id_membership` int(11),
  `id_user` int(11) NOT NULL,
  `id_employee` int(11),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_booked_activity`) REFERENCES BookedActivity(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_membership`) REFERENCES Membership(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_card`) REFERENCES Card(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Definition of the table `Pricing`
--

CREATE TABLE `Pricing` (
  
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sport` int(11) NOT NULL DEFAULT 1,
  
  -- 1: monthly, 2: yearly, 3: sports pass --
  `type` int(11) NOT NULL DEFAULT 1,
  
  `amount` double NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_sport`) REFERENCES Sport(`id`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- SAMPLE DATA
--

-- Creating user (psw: 123456)
INSERT INTO User(name, surname, email, password, phone, address_1, zipcode, city) VALUES ('John', 'Doe', 'test@mail.com', 'e10adc3949ba59abbe56e057f20f883e', '+44 1234567890', 'Weetwood Lane', 'LS166IL', 'Leeds');

-- Creating employee (psw: test123)
INSERT INTO User(name, surname, email, type, password, phone, address_1, zipcode, city) VALUES ('Mr', 'Employee', 'employee@mail.com', 2, 'cc03e747a6afbbcbf8be7668acfebee5', '+44 1234567890', 'Weetwood Lane', 'LS166IL', 'Leeds');

-- Creating manager (psw: test123)
INSERT INTO User(name, surname, email, type, password, phone, address_1, zipcode, city) VALUES ('Mr', 'Admin', 'admin@mail.com', 3, 'cc03e747a6afbbcbf8be7668acfebee5', '+44 1234567890', 'Weetwood Lane', 'LS166IL', 'Leeds');

-- Creating a Facility
INSERT INTO Facility (name, description, price, icon) VALUES ('F.Pellegrini Swimming Pool', 'The swimming pool is very nice you might like 8====D', 1000,  'swim-white');
INSERT INTO Facility (name, description, price, icon) VALUES ('M. Ali Box', 'Where the kick boxing happens innit blud', '53.804326', 'gym-white');

-- Create image references
INSERT INTO Image(ext) VALUES('jpg');
INSERT INTO Image(ext) VALUES('jpg');
INSERT INTO Image(ext) VALUES('jpg');
INSERT INTO Image(ext) VALUES('JPG');

-- Create image/facility references
INSERT INTO FacilityImage(id_image, id_facility) VALUES (1,1);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (2,1);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (3,2);
INSERT INTO FacilityImage(id_image, id_facility) VALUES (4,2);

-- Creating a sport with an activity by a lecturer
INSERT INTO Sport(name, description) VALUES ('Swimming', 'Free swimming, Sub Classes, Competitive Freestyle Swimming.');
INSERT INTO Sport(name, description) VALUES ('Kick Box', 'Lightweight, agility-based martial arts discipline.');
INSERT INTO Lecturer(full_name, email, phone) VALUES ('John Fish', 'iswimalot@gmail.com', '+44 1234567890');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('Swimming for funsies', 'lets all go swimming, for fun!', 15, 60, 1, 1, '2020-03-23 15:30:10');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility, start_time) VALUES ('Swimming for funsies', 'lets all go swimming, for fun!', 15, 60, 1, 1, '2020-03-25');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility,  start_time) VALUES ('Swimming for funsies', 'lets all go swimming, for fun!', 15, 60, 2, 2, '2020-03-27');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility,  start_time) VALUES ('Swimming for funsies', 'lets all go swimming, for fun!', 15, 60, 1, 1, '2020-03-24 12:30:05');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility,  start_time) VALUES ('Swimming for funsies', 'lets all go swimming, for fun!', 15, 60, 1, 1, '2020-03-26 10:00:00');
INSERT INTO Activity (name, description, cost, duration, id_sport, id_facility,  start_time) VALUES ('Swimming for funsies', 'lets all go swimming, for fun!', 15, 60, 1, 1, '2020-03-24');
INSERT INTO Lecturer_Activity (id_lecturer, id_activity) VALUES (1, 1);

-- Creating a membership
INSERT INTO Membership(validity, id_user, id_sport) VALUES (31, 1, 1);
INSERT INTO Membership(validity, id_user, id_sport) VALUES (-14, 1, 2);

-- Payment simulation
INSERT INTO Card (number, cvv, expire_date, type) VALUES ('0000000000000000', '000', '00/00', '__CASH__');
INSERT INTO Card (number, cvv, expire_date, type) VALUES ('12345678901234567890', '123', '01/02', 'VISA');
INSERT INTO Card (number, cvv, expire_date, type) VALUES ('09876543210987654321', '321', '02/01', 'MasterCard');
INSERT INTO Card_User(id_card, id_user) VALUES (1, 1);
INSERT INTO Card_User(id_card, id_user) VALUES (2, 1);

INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (1, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (1, '2020-01-01');

INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (2, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (2, '2020-01-01');

INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (3, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (4, '2020-01-01');
INSERT INTO BookedActivity (id_activity, purchase_date) VALUES (5, '2020-01-01');

INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 1, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 2, 2);

INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-03', 1, 150, 1, 2, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-03', 1, 150, 1, 2, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-03', 1, 150, 1, 2, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-03', 1, 150, 1, 2, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-03', 1, 150, 1, 2, 1);

INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-03', 1, 150, 1, 3, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-03', 1, 150, 1, 4, 1);

INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-04', 1, 150, 1, 2, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-04', 1, 150, 1, 2, 1);

INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 3, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 4, 1);
INSERT INTO Payment (purchase_date, status, amount, id_card, id_booked_activity, id_user) VALUES ('2020-01-01', 1, 150, 1, 5, 1);

INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-02-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-01-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-01-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-02-01', 2);
INSERT INTO Log_User (id_user, time, type) VALUES (1, '2020-01-01', 2);
  
INSERT INTO Pricing (id_sport, type, amount) VALUES (1, 1, 20);
INSERT INTO Pricing (id_sport, type, amount) VALUES (1, 2, 240);
INSERT INTO Pricing (type, amount) VALUES (3, 2400);
