const handleLogin = async() => {
    
const userIdinput = document.getElementById("user-id");
const userPassinput = document.getElementById("password");

const userId = userIdinput.value;
const password= userPassinput.value;

const user ={
userId: userId,
password: password,
}

 const userInfo = await fetchUserInfo(user);

 const errorElement = document.getElementById("error-messsage");

//  check login data with database

 if(userInfo.length ==0){
    errorElement.classList.remove("hidden");
 }else{
    errorElement.classList.add("hidden");

    //save user data to local storage before jump next page
localStorage.setItem("logedInUser", JSON.stringify(userInfo[0]));

    // jump to next page
    window.location.href = "/post.html";
 }
 
}

const fetchUserInfo = async (user) => {
let data;
try{
    const res =await fetch("http://localhost:5000/getUserInfo",{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(user),
         });
        data = await res.json();
}catch(err){
    console.log("error connecting to the database", err);
}
finally{
return data;
}
}