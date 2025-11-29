-- MySQL dump for Vacations Tagging System
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `vacations_db`;
USE `vacations_db`;

-- Table structure for table `users`
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `vacations`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('user', 'admin') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `vacations`
CREATE TABLE `vacations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL CHECK (`price` >= 0 AND `price` <= 10000),
  `image_filename` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `likes` (junction table)
CREATE TABLE `likes` (
  `user_id` int NOT NULL,
  `vacation_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `vacation_id`),
  KEY `vacation_id` (`vacation_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert admin user (password: 'admin1234' - will be hashed by application)
-- For initial setup, using bcrypt hash of 'admin1234'
-- Admin user (password: 'admin1234')
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `role`) VALUES
('Admin', 'User', 'admin@vacations.com', '$2b$10$3iWMWWux.SPA6SsdLnXgSOeXvzEJ9FjMDJVKWgheY3nFHzg0UN2ka', 'admin');

-- Regular users (password: 'user1234')
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `role`) VALUES
('John', 'Doe', 'john@example.com', '$2b$10$MZqUyukUk5B3hnW1fZ4eyOo73c.WuBye/VKLa83dy5hP5.DQQL/u6', 'user'),
('Jane', 'Smith', 'jane@example.com', '$2b$10$MZqUyukUk5B3hnW1fZ4eyOo73c.WuBye/VKLa83dy5hP5.DQQL/u6', 'user');

-- Insert 12 vacations with real-world data
INSERT INTO `vacations` (`destination`, `description`, `start_date`, `end_date`, `price`, `image_filename`) VALUES
('Paris, France', 'Experience the magic of the City of Light. Visit the iconic Eiffel Tower, explore the Louvre Museum, stroll along the Champs-Élysées, and enjoy authentic French cuisine in charming cafés.', '2025-03-15', '2025-03-22', 2499.99, 'paris.jpg'),
('Tokyo, Japan', 'Discover the perfect blend of ancient tradition and cutting-edge technology. Explore historic temples, vibrant neighborhoods like Shibuya and Shinjuku, and savor world-class sushi and ramen.', '2025-04-01', '2025-04-10', 3299.99, 'tokyo.jpg'),
('Santorini, Greece', 'Relax on this stunning Greek island known for its white-washed buildings, blue-domed churches, and breathtaking sunsets over the Aegean Sea. Perfect for romantic getaways.', '2025-05-10', '2025-05-17', 2899.99, 'santorini.jpg'),
('New York City, USA', 'The city that never sleeps awaits! See the Statue of Liberty, walk through Central Park, catch a Broadway show, and experience the energy of Times Square.', '2025-02-20', '2025-02-27', 1999.99, 'newyork.jpg'),
('Bali, Indonesia', 'Find your inner peace in this tropical paradise. Enjoy pristine beaches, ancient temples, lush rice terraces, and rejuvenating spa treatments in a serene setting.', '2025-06-05', '2025-06-14', 1899.99, 'bali.jpg'),
('Rome, Italy', 'Walk through history in the Eternal City. Visit the Colosseum, throw a coin in the Trevi Fountain, explore Vatican City, and indulge in authentic Italian pasta and gelato.', '2025-04-15', '2025-04-22', 2199.99, 'rome.jpg'),
('Maldives', 'Ultimate luxury awaits in this island paradise. Stay in overwater bungalows, snorkel in crystal-clear waters, and watch stunning sunsets from your private deck.', '2025-07-01', '2025-07-08', 4999.99, 'maldives.jpg'),
('Barcelona, Spain', 'Experience the vibrant culture of Catalonia. Marvel at Gaudí''s architectural masterpieces, relax on Mediterranean beaches, and enjoy tapas and sangria.', '2025-03-25', '2025-04-01', 1799.99, 'barcelona.jpg'),
('Dubai, UAE', 'Experience modern luxury in this futuristic city. Visit the Burj Khalifa, shop in world-class malls, enjoy desert safaris, and dine in spectacular restaurants.', '2025-05-20', '2025-05-27', 2799.99, 'dubai.jpg'),
('Machu Picchu, Peru', 'Journey to the ancient Incan citadel high in the Andes Mountains. Trek through breathtaking landscapes and discover the mysteries of this UNESCO World Heritage site.', '2025-08-10', '2025-08-18', 3499.99, 'machupicchu.jpg'),
('Sydney, Australia', 'Explore the land down under! See the iconic Opera House and Harbour Bridge, relax on Bondi Beach, and discover unique wildlife at Taronga Zoo.', '2025-09-01', '2025-09-10', 3799.99, 'sydney.jpg'),
('Swiss Alps, Switzerland', 'Experience the majestic beauty of the Alps. Ski on world-renowned slopes, take scenic train rides, and enjoy fondue in cozy mountain villages.', '2025-12-15', '2025-12-24', 3999.99, 'swissalps.jpg');

-- Insert some sample likes
INSERT INTO `likes` (`user_id`, `vacation_id`) VALUES
(2, 1),  -- John likes Paris
(2, 3),  -- John likes Santorini
(2, 7),  -- John likes Maldives
(3, 1),  -- Jane likes Paris
(3, 2),  -- Jane likes Tokyo
(3, 5),  -- Jane likes Bali
(3, 6);  -- Jane likes Rome
