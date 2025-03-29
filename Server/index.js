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

app.get("/getAllPosts", (req, res) =>{

  const sqlforAllPosts= `SELECT users.userName AS postedUserName, users.userImage AS postdUserImage, posts.postId, posts.postedTime, posts.postedText, posts.postedImageUrl FROM posts INNER JOIN users ON posts.postedUserId=users.userId ORDER BY posts.postedTime DESC`;

  let query = db.query(sqlforAllPosts, (err, result) =>{
    if(err){
      console.log("eror loading posts", err);
      throw err;
    }else{
      console.log(result);
      res.send(result);
    }
  })

})


app.get("/getAllComments/:postId", (req, res) =>{

  let id = req.params.postId;

  let sqlForAllComments = `SELECT users.userName AS commentedUserName, users.userImage AS commenteduserImage, comments.commentId, comments.commentOfpostId, comments.commentText, comments.commentTime
FROM comments INNER JOIN users ON comments.commentedUserId=users.userId WHERE comments.commentOfpostId=${id}`;

    let query = db.query(sqlForAllComments, (err, result) =>{
    if(err){
      console.log("eror loading posts", err);
      throw err;
    }else{
     
      res.send(result);
    }
  })

})


app.post("/postComment", (req, res) =>{

  const {commentOfpostId, commentedUserId, commentText, commentTime } = req.body;

  let aqlForAddingComment = 
  `
  INSERT INTO comments (commentId, commentOfpostId, commentedUserId, commentText, commentTime) VALUES (NULL, ?, ?, ?, ?);
  `;
  let query = db.query(aqlForAddingComment, [commentOfpostId, commentedUserId, commentText, commentTime], (err, result) =>{

    if(err){
      console.log("error Sending data to server", err);
    }else{
      res.send(result);
    }

  }
);
  
});




app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
    
})
