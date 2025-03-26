const fetchAllPosts = async () =>{
    let data;

    try{

        const res = await fetch("http://localhost:5000/getAllPosts")
        data = await res.json();
         console.log(data)
        showAllPosts(data)
    
    }
    catch(err)
    {

        console.log("Error Featching data from Server")
    }
}


const showAllPosts = (allPosts) => {

const postContainer = document.getElementById("post-container")
postContainer.innerHTML="";


allPosts.forEach(post => {
   const postDiv = document.createElement("div")
   postDiv.classList.add("post")

   postDiv.innerHTML=`
    <div class="post-header">
         
            <div class="post-user-image">
                <img src=${post.postdUserImage} />
            </div>
        
        <div class="post-username-time">
            <p class="post-username">${post.postedUserName}</p>
            <div class="post-time">
                <span>${post.postedTime}</span>
                <span>hour ago</span>
            </div>
        
        </div>
        
        </div>
        
        <div class="post-text">
        <p class="post-text-content">${post.postedText}</p>
        
        </div>
        
        <div class="post-image">
            <img src= ${post.postdUserImage} />
        
        </div>
   
   `

postContainer.appendChild(postDiv);


});

}



fetchAllPosts();