------------------------   DB CREATION ------------------------

-- Admins Table
CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    admin_email VARCHAR(255) NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    UNIQUE (admin_email)
);

-- Categories Table
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- Items Table
CREATE TABLE Items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_price INTEGER NOT NULL CHECK (item_price >= 0),
    item_image VARCHAR(255) NOT NULL,
    item_stock INTEGER NOT NULL CHECK (item_stock >= 0),
    item_description VARCHAR(255),
    category_id INTEGER REFERENCES Categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- User Details Table
CREATE TABLE User_Details (
    ud_id SERIAL PRIMARY KEY,
    pincode INTEGER NOT NULL,
    state VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

-- Orders Table
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    order_status BOOLEAN DEFAULT FALSE,
    ud_id INTEGER REFERENCES User_Details(ud_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Users Table (Each user has a unique cart)
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_phone_number VARCHAR(255) NOT NULL,
    order_id INTEGER REFERENCES Orders(order_id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE (user_email),
	UNIQUE(user_phone_number)
);

-- Carts Table (Each cart is associated with multiple items)
CREATE TABLE Carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES Users(user_id) ON DELETE CASCADE, -- Ensure unique cart for each user
    total_quantity INTEGER DEFAULT 0 CHECK (total_quantity >= 0)
);

-- Cart_Items Table (Many-to-many relationship between carts and items)
CREATE TABLE Cart_Items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES Carts(cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_id INTEGER REFERENCES Items(item_id) ON DELETE CASCADE ON UPDATE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Order_Items Table (Linking orders with items)
CREATE TABLE Order_Items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES Orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_id INTEGER REFERENCES Items(item_id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_quantity INTEGER NOT NULL CHECK (item_quantity > 0)
);

------------------------ CUSTOM FUNCTIONS ------------------------

create or replace function create_user
(
	f_user_email varchar(255) ,
	f_user_password varchar(255) ,
	f_user_name varchar(255) ,
	f_user_phone_number varchar(255)
) returns integer as $$
declare 
	temp_user_id integer;
	temp_cart_id integer;
begin
	insert into "users" (user_email , user_password , user_name , user_phone_number , order_id) 
	values (f_user_email , f_user_password , f_user_name , f_user_phone_number , NULL) 
	returning user_id into temp_user_id;
	
	insert into "carts" (user_id , total_quantity) 
	values (temp_user_id , 0)
	returning cart_id into temp_cart_id;
	
	return temp_user_id;
end;

$$ language plpgsql;



