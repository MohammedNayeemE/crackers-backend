export const Admin = {
    GetAdmin    : 'SELECT * FROM Admin WHERE admin_email = $1 AND admin_password = $2',
    InsertAdmin : 'INSERT INTO Admin (admin_email, admin_password) VALUES ($1 , $2)' ,

}