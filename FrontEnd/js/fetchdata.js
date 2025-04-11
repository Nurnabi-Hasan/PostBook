const showLoggedInUserName = async () => {

    const loggedUserElement = document.getElementById("logged-userName");

    //gettng user name form Local Storage
    let user = localStorage.getItem("logedInUser");

    if (user) {
        user = JSON.parse(user);
    }

    loggedUserElement.innerText = user.userName;

}

const handleAddNewPOst = async () => {

    //collect Commented User id form Local Storage

    let user = localStorage.getItem('logedInUser')
    if (user) {

        user = JSON.parse(user);

    }
    const postedUserId = user.userId;

    //current time of comment 

    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let timeOfPost = now.toISOString();
    console.log(timeOfPost);

    // post text

    const postTextElement = document.getElementById("post-text");
    const postText = postTextElement.value;


    //post Image
    const postImageElement = document.getElementById("image-url");
    const postImage = postImageElement.value;

    const postObject =
    {

        postedUserId: postedUserId,
        postedTime: timeOfPost,
        postedText: postText,
        postedImageUrl: postImage,

    }

    try {
        const res = await fetch("http://localhost:5000/addNewPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postObject),
        });
        const data = await res.json();
    } catch (err) {
        console.log("Error Sending data to Database", err);
    } finally {
        location.reload();
    }
    console.log("Sending data ", postObject);
}

const checkForLoggedInUser = () => {

    let user = localStorage.getItem("logedInUser");
    if (user) {
        user = JSON.parse(user);
    } else {
        window.location.href = '/index.html';
    }

}

const logOut = () => {
    localStorage.clear();
    checkForLoggedInUser();
}

const fetchAllPosts = async () => {
    let data;

    try {

        const res = await fetch("http://localhost:5000/getAllPosts")
        data = await res.json();
        console.log(data)
        showAllPosts(data)

    }
    catch (err) {

        console.log("Error Featching data from Server")
    }
}


const showAllPosts = (allPosts) => {

    const postContainer = document.getElementById("post-container")
    postContainer.innerHTML = "";

    
    const userdata = JSON.parse(
        localStorage.getItem("logedInUser")
      ).userId;




    allPosts.forEach(async post => {
       
        const postDiv = document.createElement("div")
        postDiv.classList.add("post")
        postDiv.id =  `post-${post.postId}`;

        postDiv.innerHTML = `
    
    <div class="post-header-button">
    <div class="post-header">
         
            <div class="post-user-image">
                  <img src= ${post.postdUserImage} >
            </div>
        
        <div class="post-username-time">
            <p class="post-username">${post.postedUserName}</p>
            <div class="post-time">
                <span>${timeDiffence(post.postedTime)}</span>
                <span>ago</span>
            </div>
        
        </div>
    
        </div>

        <div class="post-actions ${userdata === post.postedUserId ? "visible" : "hidden"}">
            <button onclick="deletePost(${post.postId})" id="deleteBtn">Delete</button>
            <button id = "editBtn" onclick='populateUpdateForm(${JSON.stringify(post)})'>Edit</button>
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

        const postComments = await fetchAllComments(post.postId);
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

        // adding comment to post

        const addCommentToPost = document.createElement("div");
        addCommentToPost.classList.add("comment-input-holder");

        addCommentToPost.innerHTML =
            `
        <div class="comment-input-field-holder">
            <input type="text" 
            placeholder="Write your comment" 
            class="comment-input-field" 
            id="comment-input-for-postId-${post.postId}">
        </div> 
        
        <div class="comment-btn-holder">
        
            <button class="comment-btn" onClick= handlepostComment(${post.postId}) id="btn">Comment</button>
        
        </div>
`
        postDiv.appendChild(addCommentToPost);
    });


}

const fetchAllComments = async (postId) => {
    let commentOfPost = [];

    try {
        const res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
        commentOfPost = await res.json();
    } catch (err) {
        console.log("Error featching data form server", err);

    } finally {
        return commentOfPost;
    }

};


const handlepostComment = async (postId) => {

    //collect Commented User id form Local Storage

    let user = localStorage.getItem('logedInUser')
    if (user) {

        user = JSON.parse(user);

    }
    const commentedUserId = user.userId;

    // getting comment Text

    const commentedTextElement = document.getElementById(`comment-input-for-postId-${postId}`);

    const commentedText = commentedTextElement.value;

    //current time of comment 

    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let timeOfComment = now.toISOString();
    console.log(timeOfComment);


    const commentObject = {

        commentOfpostId: postId,
        commentedUserId: commentedUserId,
        commentText: commentedText,
        commentTime: timeOfComment,
    };

    try {
        const res = await fetch("http://localhost:5000/postComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commentObject),
        });
        // const data = await res.json();
    } catch (err) {
        console.log("Error Sending data to Database", err);
    } finally {
        location.reload();
    }



}

const deletePost = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) {
        return; // if cancel then not delete
    }
    try {
        
        const res = await fetch(`http://localhost:5000/getAllPosts/${id}`, {
         method: 'DELETE'
        });
    } catch(err) {
        console.log(err)
    } finally{
        location.reload();
    }
};

const handleUpdatePost = async () => {
    const postId = document.getElementById('update-post-id').value;

    const postTextElement = document.getElementById('updatePost-text');
    const postedText = postTextElement.value;

    const postImageElement = document.getElementById('updatePost-image');
    const postedImageUrl = postImageElement.value;

    try {
        const res = await fetch(`http://localhost:5000/updatePost/${postId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postedText,
                postedImageUrl
            }),
        });

        const data = await res.json();

        document.getElementById('update-post-container').style.display = 'none';
        document.getElementById('add-post-container').style.display = 'block';

        await fetchAllPosts();
    } catch (err) {
        console.log("Error while updating post: ", err);
    } finally {
        location.reload();
    }
};

const populateUpdateForm = (post) => {
    document.getElementById('update-post-id').value = post.postId;
    document.getElementById('updatePost-text').value = post.postedText;
    document.getElementById('updatePost-image').value = post.postedImageUrl;
    // document.getElementById('update-post-container').style.display = 'block';
    document.getElementById('update-post-container').style.display = 'block';
    document.getElementById('addnewpost').style.display = 'none';
};




fetchAllPosts();
showLoggedInUserName();
checkInputs()


function hideUpdatePostSection() {
    // Hide update section
    document.getElementById('update-post-container').style.display = 'none';

    // Show the add post section again
    document.getElementById('addnewpost').style.display = 'block';
  }
