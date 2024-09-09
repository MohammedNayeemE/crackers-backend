export const User = {
    addUser : `select create_user($1 , $2 , $3 , $4)`,
    signin : `select * from "users" where user_email = $1;`,
    get_cart_items : `select * from "carts" where cart_id = $1;`,

    update_cart_items : `update "carts" set cart_quantity = case 
                         when item_id is not null cart_quantity + $3 
                         else $3 
                         end ,
                         item_id = $2
                         where cart_id = $1;
                          `
}
