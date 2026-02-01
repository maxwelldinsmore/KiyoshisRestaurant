-- Create a database (optional if POSTGRES_DB is set)
-- CREATE DATABASE kiyoshi_db;

\c kiyoshi_db;

CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phonenumber VARCHAR(10),
    customer_email VARCHAR(255),
    is_registered BOOLEAN DEFAULT FALSE,
    loyalty_points INT DEFAULT 0,
    contact_method VARCHAR(50)
);

CREATE TABLE customer_order (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_total DECIMAL(10,2) NOT NULL,
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    pick_up_time VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    order_item_quantity DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES customer_order(order_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);

CREATE TABLE item (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(100),
    item_description VARCHAR(500),
    item_price DECIMAL(10,2) NOT NULL,
    is_item_available BOOLEAN DEFAULT TRUE,
    is_on_discount BOOLEAN DEFAULT FALSE,
    item_discount_percent DECIMAL(10,2),
);

CREATE TABLE order_payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50),
    payment_note VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES customer_order(order_id)
);

CREATE TABLE supplier (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_email VARCHAR(255),
    supplier_phonenumber VARCHAR(20),
    supplier_notes VARCHAR(255)
);

CREATE TABLE inventory_item (
    inventory_id SERIAL PRIMARY KEY,
    inventory_item_id INT NOT NULL,
    supplier_id INT NOT NULL,
    purchase_date DATE,
    expiry_date DATE,
    quantity_available DECIMAL(10,2),
    unit VARCHAR(50),
    FOREIGN KEY (inventory_item_id) REFERENCES item(item_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);