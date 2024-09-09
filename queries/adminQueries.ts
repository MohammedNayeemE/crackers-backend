export const Admin = {
    addAdmin : `insert into "admins" (admin_email , admin_password) values($1 , $2) ;` ,
    signIn   : `select * from "admins" where admin_email = $1 ;`,
    get_pending : `select o.order_id , o.order_date , o.order_status , o.ud_id , oi.item_id , oi.item_quantity from "orders" o join "order_items" oi on o.order_id = oi.order_id where o.order_status = false order by o.order_date asc ;`,
    get_complete : `select o.order_id , o.order_date , o.order_status , o.ud_id , oi.item_id , oi.item_quantity from "orders" o join "order_items" oi on o.order_id = oi.order_id where o.order_status = true order by o.order_date desc; `,    
    get_items : `select * from "items" where category_id = $1`,
    get_categories : `select * from "categories";`,
    add_item : `insert into "items" (item_name , item_price , item_image , item_stock , item_description , category_id) values ($1 , $2 , $3 , $4 , $5 , $6) ;` ,
    add_category : `insert into "categories" (category_name) values($1);` ,
    update_items : `
                    update "items" set 
                    item_name = coalesce($1 , item_name) ,
                    item_price = coalesce($2 , item_price) ,
                    item_image = coalesce($3 , item_image) ,
                    item_stock = coalesce($4 , item_stock) ,
                    item_description = coalesce($5 , item_description) , 
                    category_id = coalesce($6 , category_id) 
                    where item_id = $7;
    ` ,
    update_order_status : `update "orders" set order_status = true where order_id = $1 ;` ,
    get_user_details : `select * from "user_details" where ud_id = $1;`,


}
