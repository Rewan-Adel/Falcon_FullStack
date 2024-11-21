CREATE DATABASE falcon;
USE falcon;

CREATE TABLE User(
    userID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(25),
    lastName  VARCHAR(25),
	username  VARCHAR(50)  UNIQUE,
    phone     VARCHAR(14)  UNIQUE,
    email     VARCHAR(100) UNIQUE,
    password  VARCHAR(255) , 
    confirmPassword VARCHAR(255) ,
    avatarURL       VARCHAR(255),
    avatarPublicId VARCHAR(255),
    country        VARCHAR(50), 
    state          VARCHAR(50),   
    city           VARCHAR(50),
    gender         VARCHAR(50),
    birthday       DATE,
    description    TEXT,   
    auctionBid     DECIMAL(10, 2), 
    
	role         enum('user','role'),
    signupWay    varchar(25) ,
    isVerified   boolean DEFAULT 0,
    
    googleToken  varchar(255),
    otp          varchar(255),
    otpCount     integer,
    otpLimit      integer,
    otpExpires    datetime,
    passChangedAt datetime,
    passResetToken VARCHAR(255),
    passResetExpires datetime
);

CREATE TABLE Identity(
    identityID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    cardImageURL VARCHAR(255), 
    selfieImageURL VARCHAR(255),
    Verification enum('approved', 'refused', 'pending', 'review'),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Falcon(
    FalconID INT PRIMARY KEY AUTO_INCREMENT,
    ownerID INT,
    name VARCHAR(100) ,
    description TEXT,
    category VARCHAR(50) ,
    price DECIMAL(10,2) ,
    state VARCHAR(50),    
    city VARCHAR(50),      
    color VARCHAR(50), 
    images JSON,    
    -- mediaURL VARCHAR(255) ,
    -- mediaPublicId VARCHAR(255),

    conditionOfUse ENUM('New', "Used", "Light Used","Like New"),
    communicationMethod ENUM("Chat","Mobile phone", "Both"),
    status ENUM('Running', 'Expired') DEFAULT 'Running',     

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerID) REFERENCES User(userID)
);

CREATE TABLE Post(
    postID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    groupID INT,
    content VARCHAR(255),
    images json,
	privacy ENUM('public', 'private') DEFAULT 'public',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (groupID) REFERENCES Group_(groupID)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Comment(
    commentID INT PRIMARY KEY AUTO_INCREMENT,
    postID INT,
    eventID INT,
    userID INT,
    parentCommentID INT,
    content VARCHAR(255) ,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(userID)    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (postID) REFERENCES Post(postID)    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (eventID) REFERENCES Event(eventID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Likes (
    likeID INT PRIMARY KEY AUTO_INCREMENT,
    postID INT,
    commentID INT,
    userID INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (postID) REFERENCES Post(postID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (commentID) REFERENCES Comment(commentID)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Follow (
    followID  INT PRIMARY KEY AUTO_INCREMENT,
    followerID INT,  
    followedID INT,    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- PRIMARY KEY (followerID, followedID),
    FOREIGN KEY (followerID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (followedID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);
-- CREATE TABLE Friendship (
--     friendshipID INT PRIMARY KEY AUTO_INCREMENT,
--     userID1 INT,
--     userID2 INT,
--     isApproval BOOLEAN,
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (userID1) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (userID2) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
-- );

CREATE TABLE Group_(
    groupID INT PRIMARY KEY AUTO_INCREMENT,
    creatorID INT,
    name VARCHAR(255),
    description TEXT,
	privacy ENUM('Public', 'Private') DEFAULT 'Public',
    isHidden BOOLEAN,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (creatorID) REFERENCES User(userID)
);

CREATE TABLE GroupMember (
    groupID INT,
    userID INT,
    isAdmin BOOLEAN DEFAULT 0,
    PRIMARY KEY (groupID, userID), 
    FOREIGN KEY (groupID) REFERENCES Group_(groupID)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (userID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Message (
    messageID INT PRIMARY KEY AUTO_INCREMENT,
    senderID INT,
    receiverID INT,
    content VARCHAR(255),
    mediaURL VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderID) REFERENCES User(userID)    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (receiverID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Notifications (
    notificationID INT PRIMARY KEY AUTO_INCREMENT,
    receiverID INT,
    content VARCHAR(255) ,
    isRead BOOLEAN DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receiverID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Event(
    eventID INT PRIMARY KEY AUTO_INCREMENT,
    ownerID INT,
    name VARCHAR(100),
    description TEXT,
    startDate DATE ,
    endDate DATE ,
    startTime TIME,
    endTime TIME ,
    country VARCHAR(50) ,
    state VARCHAR(50) ,  
    city VARCHAR(50) ,    
    privacy ENUM('Public', 'Private') DEFAULT 'Public',
    attendanceLimit INT,
    ticketPrice DECIMAL(10, 2),
    mediaURL VARCHAR(255), 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE EventAttendee(
    eventID INT,
    userID INT,
    attendanceStatus ENUM('Interested', 'Going'),
    PRIMARY KEY (eventID, userID),
    FOREIGN KEY (eventID) REFERENCES Event(eventID),
    FOREIGN KEY (userID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Ticket(
    ticketID INT PRIMARY KEY AUTO_INCREMENT,
    eventID INT,
    userID INT,
    noTickets INT  DEFAULT 1,
    attendantName VARCHAR(255) ,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventID) REFERENCES Event(eventID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (userID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE Auction (
    auctionID INT PRIMARY KEY AUTO_INCREMENT,
    ownerID INT,
    winnerID INT,
    productName VARCHAR(255),
    description TEXT,
    category VARCHAR(50) ,
    subCategory VARCHAR(50),
    price DECIMAL(10,2),
    startTime TIME,
    endTime TIME,
    mediaURL VARCHAR(255),
    maxBid DECIMAL(10, 2), 
    minBid DECIMAL(10, 2), 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (winnerID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ownerID) REFERENCES User(userID)   ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE AuctionParticipant (
    auctionID INT,
    userID INT,
    PRIMARY KEY (auctionID, userID),
    FOREIGN KEY (auctionID) REFERENCES Auction(auctionID)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (userID) REFERENCES User(userID)  ON DELETE CASCADE ON UPDATE CASCADE
);


select  * from user;
INSERT INTO User (
    userID,
    firstName,
    lastName,
    phone,
    email,
    password,
    confirmPassword,
    username,
    avatarURL,
    avatarPublicId,
    country,
    state,
    city,
    birthday,
    description,
    gender,
    auctionBid,
    role,
    isVerified,
    signupWay,
    googleToken
) VALUES
-- Dummy record 1
(2, 'John', 'Doe', '1234567890', 'john.doe@example.com', 'password123', 'password123', 'johndoe', 
 "https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg", "default_j5ftby_jspjve",
 'USA', 'California', 'Los Angeles', '1990-01-01', 'I am a software developer.', 'male', 100.50, 'user', true, 'email', NULL),
-- Dummy record 2
(3, 'Jane', 'Smith', '0987654321', 'jane.smith@example.com', 'password456', 'password456', 'janesmith', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'Canada', 'Ontario', 'Toronto', '1992-02-02', 'I am a graphic designer.', 'female', 200.75, 'admin', false, 'phone', 'dummyGoogleToken123'),
-- Dummy record 3
(4, 'Michael', 'Johnson', '1122334455', 'michael.johnson@example.com', 'password789', 'password789', 'michaeljohnson', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'UK', 'London', 'London', '1988-03-03', 'A passionate musician.', 'male', 150.00, 'user', true, 'apple', NULL),
-- Dummy record 4
(5, 'Emily', 'Davis', '2233445566', 'emily.davis@example.com', 'password012', 'password012', 'emilydavis', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'Australia', 'New South Wales', 'Sydney', '1995-04-04', 'I love traveling and photography.', 'female', 180.00, 'user', false, 'twitter', 'dummyGoogleToken456'),
 -- Dummy record 6
(6, 'Alice', 'Brown', '4455667788', 'alice.brown@example.com', 'password678', 'password678', 'alicebrown', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'Germany', 'Berlin', 'Berlin', '1994-06-06', 'Food enthusiast and chef.', 'female', 250.30, 'user', true, 'email', NULL),
-- Dummy record 7
(7, 'Charles', 'Wilson', '5566778899', 'charles.wilson@example.com', 'password901', 'password901', 'charleswilson', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'France', 'Île-de-France', 'Paris', '1987-07-07', 'Tech entrepreneur.', 'male', 300.00, 'admin', true, 'phone', 'dummyGoogleToken789'),
-- Dummy record 8
(8, 'Sophia', 'Martinez', '6677889900', 'sophia.martinez@example.com', 'password234', 'password234', 'sophiamartinez', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'Spain', 'Madrid', 'Madrid', '1991-08-08', 'Digital artist and photographer.', 'female', 180.45, 'user', false, 'apple', NULL),
-- Dummy record 9
(9, 'David', 'Taylor', '7788990011', 'david.taylor@example.com', 'password567', 'password567', 'davidtaylor', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'Italy', 'Lazio', 'Rome', '1989-09-09', 'Loves architecture and history.', 'male', 190.25, 'user', true, 'google', NULL),
 
 -- Dummy record 10
(10, 'Robert', 'Williams', '3344556677', 'robert.williams@example.com', 'password345', 'password345', 'robertwilliams', 
 'https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg', 'default_j5ftby_jspjve',
 'New Zealand', 'Wellington', 'Wellington', '1985-05-05', 'Avid reader and writer.', 'male', 90.25, 'admin', true, 'email', NULL);
 
 
 

