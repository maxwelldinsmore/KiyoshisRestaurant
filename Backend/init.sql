-- Create a database (optional if POSTGRES_DB is set)
-- CREATE DATABASE kiyoshi_db;
--pqsl
-- CREATE DATABASE kiyoshi_db;

-- use kiyoshi_db;

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_definition VARCHAR(20) NOT NULL
);

CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    employee_first_name VARCHAR(30) NOT NULL,
    employee_last_name VARCHAR(30) NOT NULL,
    employee_phone_number VARCHAR(10)
);

CREATE TABLE registered_customer (
    customer_id SERIAL PRIMARY KEY,
    customer_first_name VARCHAR(30) NOT NULL,
    customer_last_name VARCHAR(30) NOT NULL,
    customer_phonenumber VARCHAR(10),
    customer_email VARCHAR(80),
    contact_method VARCHAR(50),
    number_of_visits SMALLINT DEFAULT 0,
    promo_opt_in BOOLEAN DEFAULT FALSE
);

CREATE TABLE supplier (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(50) NOT NULL,
    supplier_email VARCHAR(80),
    supplier_phonenumber VARCHAR(10),
    supplier_notes TEXT
);

CREATE TABLE menu_item (
    menu_item_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES category(category_id),
    menu_item_name VARCHAR(100) NOT NULL,
    menu_item_price DECIMAL(5, 2) NOT NULL,
    menu_item_description VARCHAR(140),
    is_item_available BOOLEAN DEFAULT TRUE,
    menu_item_discount_percent DECIMAL(3, 2) DEFAULT 0.00
);

CREATE TABLE inventory_item (
    inventory_item_id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES supplier(supplier_id),
    purchase_date TIMESTAMP,
    quantity_available SMALLINT DEFAULT 0,
    unit_weight_available DECIMAL(4, 4)
);

CREATE TABLE inventory_menu_item (
    menu_item_id INTEGER REFERENCES menu_item(menu_item_id),
    inventory_item_id INTEGER REFERENCES inventory_item(inventory_item_id),
    quantity_required DECIMAL(4, 4),
    PRIMARY KEY (menu_item_id, inventory_item_id)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES registered_customer(customer_id),
    employee_id INTEGER REFERENCES employee(employee_id),
    guest_phone_num VARCHAR(20),
    guest_email VARCHAR(100),
    order_total DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pick_up_time TIMESTAMP,
    order_status VARCHAR(50),
    order_type VARCHAR(50)
);

CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    menu_item_id INTEGER REFERENCES menu_item(menu_item_id),
    order_item_quantity INTEGER NOT NULL
);

CREATE TABLE order_payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    payment_method VARCHAR(6) NOT NULL,
    payment_note VARCHAR(140)
);

CREATE TABLE rewards (
    reward_id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_item(menu_item_id),
    required_visits SMALLINT NOT NULL
);

CREATE TABLE rewards_redemption (
    redemption_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES registered_customer(customer_id),
    reward_id INTEGER REFERENCES rewards(reward_id),
    order_id INTEGER REFERENCES orders(order_id)
);

CREATE TABLE customer_promotion (
    customer_promotion_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES registered_customer(customer_id),
    promotion_name VARCHAR(30),
    discount_value DECIMAL(3, 2),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_preference (
    preference_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES registered_customer(customer_id),
    menu_item_id INTEGER REFERENCES menu_item(menu_item_id)
);

CREATE TABLE inventory_transaction (
    inventory_transaction_id SERIAL PRIMARY KEY,
    inventory_item_id INTEGER REFERENCES inventory_item(inventory_item_id),
    purchase_date TIMESTAMP,
    expiry_date TIMESTAMP,
    quantity_purchased SMALLINT,
    unit_weight DECIMAL(3, 4)
);

CREATE TABLE waste_log (
    waste_log_id SERIAL PRIMARY KEY,
    inventory_item_id INTEGER REFERENCES inventory_item(inventory_item_id),
    waste_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_value_loss DECIMAL(5, 2),
    quantity_wasted DECIMAL(3, 4),
    unit_type VARCHAR(30)
);