-- Seed Data for Kiyoshi's Restaurant Database
-- Run this after init.sql to populate the database with sample data

-- Insert Categories
INSERT INTO category (category_definition) VALUES
('Sushi Rolls'),
('Nigiri'),
('Sashimi'),
('Appetizers'),
('Beverages'),
('Desserts');

-- Insert Employees (2 logins for staff)
INSERT INTO employee (employee_first_name, employee_last_name, employee_phone_number) VALUES
('Kenshin', 'Kiyoshi', '5551234567'),
('Yuki', 'Kiyoshi', '5559876543');

-- Insert Registered Customers
INSERT INTO registered_customer (customer_first_name, customer_last_name, customer_phonenumber, customer_email, contact_method, number_of_visits, promo_opt_in) VALUES
('Emily', 'Chen', '5552223333', 'emily.chen@email.com', 'email', 5, TRUE),
('Marcus', 'Johnson', '5554445555', 'marcus.j@email.com', 'phone', 12, TRUE),
('Sarah', 'Williams', '5556667777', 'sarah.w@email.com', 'email', 3, FALSE),
('David', 'Kim', '5558889999', 'david.kim@email.com', 'email', 8, TRUE);

-- Insert Suppliers
INSERT INTO supplier (supplier_name, supplier_email, supplier_phonenumber, supplier_notes) VALUES
('Pacific Seafood Co', 'orders@pacificseafood.com', '5551112222', 'Fresh fish delivery daily, premium quality'),
('Tokyo Rice Imports', 'sales@tokyorice.com', '5553334444', 'Authentic Japanese rice and nori'),
('Fresh Produce Market', 'info@freshproduce.com', '5555556666', 'Vegetables, avocado, ginger'),
('Asian Specialty Foods', 'contact@asianspecialty.com', '5557778888', 'Soy sauce, wasabi, pickled ginger');

-- Insert Menu Items
INSERT INTO menu_item (category_id, menu_item_name, menu_item_price, menu_item_description, is_item_available, menu_item_discount_percent) VALUES
-- Sushi Rolls
(1, 'California Roll', 8.99, 'Crab, avocado, cucumber', TRUE, 0.00),
(1, 'Spicy Tuna Roll', 10.99, 'Spicy tuna, cucumber, sesame seeds', TRUE, 0.00),
(1, 'Dragon Roll', 14.99, 'Eel, cucumber topped with avocado', TRUE, 0.00),
(1, 'Rainbow Roll', 13.99, 'California roll topped with assorted fish', TRUE, 0.00),
(1, 'Philadelphia Roll', 9.99, 'Salmon, cream cheese, cucumber', TRUE, 0.00),
-- Nigiri
(2, 'Salmon Nigiri', 5.99, 'Two pieces of fresh salmon', TRUE, 0.00),
(2, 'Tuna Nigiri', 6.99, 'Two pieces of premium tuna', TRUE, 0.00),
(2, 'Eel Nigiri', 6.99, 'Two pieces of grilled eel', TRUE, 0.00),
(2, 'Shrimp Nigiri', 5.49, 'Two pieces of cooked shrimp', TRUE, 0.00),
-- Sashimi
(3, 'Salmon Sashimi', 12.99, 'Six pieces of fresh salmon', TRUE, 0.00),
(3, 'Tuna Sashimi', 14.99, 'Six pieces of premium tuna', TRUE, 0.00),
(3, 'Mixed Sashimi Platter', 24.99, 'Assorted fresh fish, 12 pieces', TRUE, 0.00),
-- Appetizers
(4, 'Edamame', 4.99, 'Steamed soybeans with sea salt', TRUE, 0.00),
(4, 'Gyoza', 6.99, 'Pan-fried pork dumplings, 6 pieces', TRUE, 0.00),
(4, 'Miso Soup', 3.49, 'Traditional soybean soup', TRUE, 0.00),
(4, 'Seaweed Salad', 5.49, 'Marinated wakame seaweed', TRUE, 0.00),
-- Beverages
(5, 'Green Tea', 2.99, 'Hot or iced Japanese green tea', TRUE, 0.00),
(5, 'Ramune', 3.99, 'Japanese soda, original flavor', TRUE, 0.00),
(5, 'Sake (Small)', 8.99, 'Premium sake, 180ml', TRUE, 0.00),
-- Desserts
(6, 'Mochi Ice Cream', 5.99, 'Three pieces, assorted flavors', TRUE, 0.00),
(6, 'Green Tea Cheesecake', 6.99, 'Matcha-flavored cheesecake', TRUE, 0.00);

-- Insert Inventory Items
INSERT INTO inventory_item (supplier_id, purchase_date, quantity_available, unit_weight_available) VALUES
(1, '2026-03-10 08:00:00', 50, 0.0000), -- Fresh Salmon (lbs)
(1, '2026-03-10 08:00:00', 30, 0.0000), -- Fresh Tuna (lbs)
(1, '2026-03-10 08:00:00', 25, 0.0000), -- Eel (lbs)
(1, '2026-03-10 08:00:00', 40, 0.0000), -- Crab (lbs)
(1, '2026-03-10 08:00:00', 35, 0.0000), -- Shrimp (lbs)
(2, '2026-03-09 10:00:00', 100, 0.0000), -- Sushi Rice (lbs)
(2, '2026-03-09 10:00:00', 200, 0.0000), -- Nori Sheets (count)
(3, '2026-03-10 07:00:00', 60, 0.0000), -- Avocado (count)
(3, '2026-03-10 07:00:00', 40, 0.0000), -- Cucumber (count)
(3, '2026-03-10 07:00:00', 10, 0.0000), -- Ginger Root (lbs)
(4, '2026-03-05 09:00:00', 20, 0.0000), -- Soy Sauce (bottles)
(4, '2026-03-05 09:00:00', 15, 0.0000), -- Wasabi Paste (tubes)
(4, '2026-03-05 09:00:00', 25, 0.0000); -- Pickled Ginger (containers)

-- Insert Inventory Menu Item Relationships (recipe requirements)
INSERT INTO inventory_menu_item (menu_item_id, inventory_item_id, quantity_required) VALUES
-- California Roll
(1, 4, 0.2500), -- Crab
(1, 6, 0.3000), -- Rice
(1, 7, 1.0000), -- Nori
(1, 8, 0.5000), -- Avocado
(1, 9, 0.3000), -- Cucumber
-- Spicy Tuna Roll
(2, 2, 0.3000), -- Tuna
(2, 6, 0.3000), -- Rice
(2, 7, 1.0000), -- Nori
-- Salmon Nigiri
(6, 1, 0.1500), -- Salmon
(6, 6, 0.2000); -- Rice

-- Insert Orders
INSERT INTO orders (customer_id, employee_id, guest_phone_num, guest_email, order_total, order_date, pick_up_time, order_status, order_type) VALUES
(1, 1, NULL, NULL, 42.95, '2026-03-09 18:30:00', '2026-03-09 19:00:00', 'completed', 'pickup'),
(2, 2, NULL, NULL, 67.43, '2026-03-10 12:15:00', '2026-03-10 12:45:00', 'completed', 'pickup'),
(3, 1, NULL, NULL, 29.96, '2026-03-10 17:00:00', '2026-03-10 17:30:00', 'completed', 'pickup'),
(NULL, 2, '5551239999', 'guest@email.com', 35.95, '2026-03-11 13:00:00', '2026-03-11 13:30:00', 'in_progress', 'pickup');

-- Insert Order Items
INSERT INTO order_item (order_id, menu_item_id, order_item_quantity) VALUES
-- Order 1
(1, 1, 2), -- 2x California Roll
(1, 6, 2), -- 2x Salmon Nigiri
(1, 13, 1), -- 1x Edamame
(1, 15, 1), -- 1x Miso Soup
(1, 17, 1), -- 1x Green Tea
-- Order 2
(2, 3, 1), -- 1x Dragon Roll
(2, 4, 1), -- 1x Rainbow Roll
(2, 7, 2), -- 2x Tuna Nigiri
(2, 14, 1), -- 1x Gyoza
(2, 20, 1), -- 1x Mochi Ice Cream
(2, 18, 2), -- 2x Ramune
-- Order 3
(3, 2, 1), -- 1x Spicy Tuna Roll
(3, 9, 1), -- 1x Shrimp Nigiri
(3, 16, 1), -- 1x Seaweed Salad
(3, 17, 1), -- 1x Green Tea
-- Order 4 (in progress)
(4, 5, 2), -- 2x Philadelphia Roll
(4, 14, 1), -- 1x Gyoza
(4, 17, 2); -- 2x Green Tea

-- Insert Order Payments
INSERT INTO order_payment (order_id, payment_method, payment_note) VALUES
(1, 'card', 'Visa ending in 4532'),
(2, 'card', 'Mastercard ending in 8821'),
(3, 'cash', 'Exact change provided'),
(4, 'card', 'Processing payment');

-- Insert Rewards
INSERT INTO rewards (menu_item_id, required_visits) VALUES
(1, 10), -- Free California Roll after 10 visits
(13, 5), -- Free Edamame after 5 visits
(17, 3), -- Free Green Tea after 3 visits
(20, 15); -- Free Mochi Ice Cream after 15 visits

-- Insert Rewards Redemptions
INSERT INTO rewards_redemption (customer_id, reward_id, order_id) VALUES
(2, 3, 2); -- Marcus redeemed free green tea

-- Insert Customer Promotions
INSERT INTO customer_promotion (customer_id, promotion_name, discount_value, start_date, end_date, created_at) VALUES
(1, 'Welcome Discount', 0.10, '2026-03-01 00:00:00', '2026-03-31 23:59:59', '2026-03-01 10:00:00'),
(2, 'Loyalty Member', 0.15, '2026-03-01 00:00:00', '2026-12-31 23:59:59', '2026-02-15 14:30:00'),
(4, 'Birthday Special', 0.20, '2026-03-08 00:00:00', '2026-03-15 23:59:59', '2026-03-08 09:00:00');

-- Insert Customer Preferences
INSERT INTO customer_preference (customer_id, menu_item_id) VALUES
(1, 1), -- Emily likes California Roll
(1, 6), -- Emily likes Salmon Nigiri
(2, 3), -- Marcus likes Dragon Roll
(2, 4), -- Marcus likes Rainbow Roll
(2, 20), -- Marcus likes Mochi Ice Cream
(3, 2), -- Sarah likes Spicy Tuna Roll
(4, 5), -- David likes Philadelphia Roll
(4, 10); -- David likes Salmon Sashimi

-- Insert Inventory Transactions
INSERT INTO inventory_transaction (inventory_item_id, purchase_date, expiry_date, quantity_purchased, unit_weight) VALUES
(1, '2026-03-10 08:00:00', '2026-03-13 23:59:59', 50, 0.0000), -- Salmon
(2, '2026-03-10 08:00:00', '2026-03-13 23:59:59', 30, 0.0000), -- Tuna
(3, '2026-03-10 08:00:00', '2026-03-15 23:59:59', 25, 0.0000), -- Eel
(4, '2026-03-10 08:00:00', '2026-03-12 23:59:59', 40, 0.0000), -- Crab
(5, '2026-03-10 08:00:00', '2026-03-12 23:59:59', 35, 0.0000), -- Shrimp
(6, '2026-03-09 10:00:00', '2026-06-09 23:59:59', 100, 0.0000), -- Rice
(7, '2026-03-09 10:00:00', '2026-09-09 23:59:59', 200, 0.0000), -- Nori
(8, '2026-03-10 07:00:00', '2026-03-17 23:59:59', 60, 0.0000), -- Avocado
(9, '2026-03-10 07:00:00', '2026-03-17 23:59:59', 40, 0.0000), -- Cucumber
(10, '2026-03-10 07:00:00', '2026-04-10 23:59:59', 10, 0.0000); -- Ginger

-- Insert Waste Log
INSERT INTO waste_log (inventory_item_id, waste_date, estimated_value_loss, quantity_wasted, unit_type) VALUES
(1, '2026-03-08 20:00:00', 15.50, 0.5000, 'lbs'), -- Salmon went bad
(8, '2026-03-07 21:00:00', 4.25, 3.0000, 'count'), -- Avocados overripe
(9, '2026-03-06 22:00:00', 2.00, 2.0000, 'count'); -- Cucumbers wilted

-- Display success message
SELECT 'Seed data successfully inserted!' as message;
