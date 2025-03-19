const handleLogin = () => {
    
const userIdinput = document.getElementById("user-id");
const userPassinput = document.getElementById("password");

const userId = userIdinput.value;
const password= userPassinput.value;

const user ={
userId: userId,
password: password,
}

fetchUserInfo(user);

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
}finally{
console.log("user data from server", data);
}
}
