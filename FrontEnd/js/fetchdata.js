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


allPosts.forEach( async post => {
   const postDiv = document.createElement("div")
   postDiv.classList.add("post")

   postDiv.innerHTML=`
    <div class="post-header">
         
            <div class="post-user-image">
                  <img src= ${post.postdUserImage} >
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
            <img src= ${post.postedImageUrl} >
        
        </div>
      `
postContainer.appendChild(postDiv);

// fetch all comments of a post

const postComments =await fetchAllComments(post.postId);
console.log("Post Comments: ", postComments);

postComments.forEach(comment => {
    const commentHolderDiv = document.createElement('div');
    commentHolderDiv.classList.add("comments-holder");
    commentHolderDiv.innerHTML =
     ` <div class="comment">
        <div class="comment-user-img">
        <img src=${comment.commenteduserImage} >
        </div>
        
        <div class="comment-text-container">
            <h4>${comment.commentedUserName} </h4>
            <p>${comment.commentText}</p>
        </div>
        
        
        </div> `

        postDiv.appendChild(commentHolderDiv);
})



});

}

const fetchAllComments = async (postId) => {
    let commentOfPost = [];

    try{
        const res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
        commentOfPost = await res.json();
    }catch(err){
        console.log("Error featching data form server", err);

    }finally{
        return commentOfPost;
    }

};



fetchAllPosts();