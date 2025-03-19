const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const port= 5000;
const app = express();

//middlewaes

app.use(cors());
app.use(express.json());

//connect with mysql server

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'postbook'
  });
   
  db.connect((err) => {
    if(err){
        console.log('Something went Wrong when Connection to the Data base: ', err);
        throw err
    }
else{
    console.log('Database Connected...');
}
  });

//getting user data from login page

app.post ("/getUserInfo", (req, res) =>{
const {userId, password}=req.body;

const getUserInfoSql = `SELECT userId, userName, userImage FROM users WHERE users.userId=? AND users.userPassword=?`;
let query = db.query(getUserInfoSql,[userId, password], (err, result)=>{
  if(err){
    console.log("eror getting data from server", err);
    throw err;
  }else{
    res.send(result);
  }
})
});

app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
    
})
