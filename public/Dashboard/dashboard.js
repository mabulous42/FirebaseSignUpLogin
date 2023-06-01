//getting my document by id from the html file
let profileName = document.getElementById("profile-name");
let userName = document.getElementById("user-name");
let postModal = document.getElementById("myPostModal");
let showPostTag = document.getElementById("show-post");
let writeAPostTag = document.getElementById("open-post-modal");
let whatsOnYourMindTag = document.getElementById("on-your-mind");
let userCommentInput = document.getElementById("user-comment-input");

// document.getElementById("live-video").style.backgroundColor = "blue";

//declaring a variable to save the name of the current user
let currentUser;

let userCommentText;
let thisUser;

//getting the displayName of the current user
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(user);
        //displaying the current user name
        profileName.innerHTML = user.displayName;
        userName.innerHTML = user.displayName;
        //passing the displayName into variable currentUser
        currentUser = user.displayName;
        thisUser = user.photoURL;
        // writeSomething(currentUser, thisUser);
        // displayAllPost(thisUser);
        document.getElementById("show-profile-photo").innerHTML = `
        <img src="${user.photoURL}" class="rounded-circle p-photo"/>        `
        // ...
    } else {
        // User is signed out
        // ...
        // document.getElementById("display-null").style.display = "none";
        window.location.href = "../index.html"
    }
});

//hiding the modal that shows where to type and post to timeline by using visibility hidden
postModal.style.visibility = "hidden";

//this function signs out the current user from the dashboard
function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.href = "../index.html";
    }).catch((error) => {
        // An error happened.
        alert(error);
    });
}

// this is a self invoke function that displays the field telling the user to write something to his/her timeling
function writeSomething() {
    writeAPostTag.innerHTML = `
    <div id="write-post-modal" class="w-75 shadow rounded">
        <div class="p-3 position-relative">
            <h5 class="fw-bold text-center">Create Post</h5>
            <i class="fa-solid fa-xmark position-absolute close-post-modal rounded-circle"
                onclick="closePostModal()"></i>
        </div>
        <hr class="mb-2 mt-0">
        <div class="d-flex align-items-center py-2 px-3">
            <div class="me-2 pix-div">
                <img src="${thisUser}" class="p-photo rounded-circle">
            </div>
            <div>${currentUser}</div>
        </div>
        <div class="w-100 px-3">
            <textarea class="w-100 fs-4 write-content-input text-white" name="" id="content"
                cols="30" rows="6" placeholder="What's on your mind, ${currentUser}"
                oninput="enableButton()"></textarea>
        </div>
        <div class="px-3">
            <div class="d-flex align-items-center justify-content-between border border-white w-100 rounded p-1">
                <div class="w-75">
                    <button class="add-to-post p-2">Add to your post</button>
                    <div>
                        <input type="file" id="post-image" onchange="contentImage(event)"/>
                    </div>
                </div>
                <div class="d-flex align-items-center">                    
                    <div>C</div>
                    <div>D</div>
                    <div>E</div>
                </div>
            </div>
            <button class="btn btn-primary mt-3 w-100" id="post-btn" onclick="createPost()">Post</button>
        </div>
    </div>
    `
}
//self invoking the function
writeSomething();

let postImage = document.getElementById("post-image");


function contentImage(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (e) => {
        console.log(e);
        let imgUrl = e.target.result;
        console.log(imgUrl);
    })

    if (file) {
        reader.readAsDataURL(file)
    }
}

//this is an onclick function that opens a modal to type in something
function openPostModal() {
    postModal.style.visibility = "visible";
}

//this is an onclick function the closes the modal where you can actually type in something
function closePostModal() {
    console.log(currentUser);
    postModal.style.visibility = "hidden";
}

//getting the document by id of the post button that post whatever the user types in the input
let postButton = document.getElementById("post-btn");

//displaying the button to avoid posting an empty input
postButton.disabled = true;

//this function changed the state of the post button from disable = true to disable = false based on some conditions
function enableButton() {
    //checking if the input box is not empty, if it's not empty, the button should be activated
    if (content.value.trim() !== "") {
        postButton.disabled = false;
    } else {
        //if the input box is empty, the button should be disable back
        postButton.disabled = true;
    }
}

//getting the input document by id from the html tag
let content = document.getElementById("content");

let date = new Date();
console.log(date);

//this function collects data to be posted by the user and save to the database
async function createPost() {

    let file = postImage.files[0];

    if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const imageRef = storage.child(fileName);

        try {
            const snapshot = await imageRef.put(file);
            console.log('Image uploaded successfully');

            const downloadURL = await imageRef.getDownloadURL();
            console.log('Download URL:', downloadURL);

            const data = {
                author: currentUser,
                image: downloadURL,
                content: content.value,
                numberOfLikes: 0,
                likedBy: [],
                numberOfComments: 0,
                commentsBy: [],
                time: firebase.firestore.Timestamp.now()
            };

            await db.collection("Feeds").doc().set(data);

            console.log("Document successfully written!");
            content.value = "";
            postModal.style.visibility = "hidden";
            displayAllPost();
        } catch (error) {
            console.error("Error uploading image or writing document: ", error);
        }
    } else {
        // No image selected, proceed with other data
        const data = {
            author: currentUser,
            image: null,
            content: content.value,
            numberOfLikes: 0,
            likedBy: [],
            numberOfComments: 0,
            commentsBy: [],
            time: firebase.firestore.Timestamp.now()
        };

        try {
            await db.collection("Feeds").doc().set(data);

            console.log("Document successfully written!");
            content.value = "";
            postModal.style.visibility = "hidden";
            displayAllPost();
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    }   
    
}

//this is a self invoke function that displays all the posts in the database by fetching from the database and then displays it
async function displayAllPost() {
    showPostTag.innerHTML = "";
    await db.collection("Feeds").orderBy("time", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            console.log(currentUser);
            let createdAt;

            let timeStampPostDate = doc.data().time.toDate();
            let postMinutes = Math.round((date - timeStampPostDate) / (1000 * 60));
            console.log("time diff: " + postMinutes);

            if (postMinutes < 1) {
                createdAt = "Just now";
            } else if (postMinutes === 1) {
                createdAt = '1 minute ago';
            } else if (postMinutes < 60) {
                createdAt = `${postMinutes} minutes ago`;
            } else if (postMinutes < 120) {
                createdAt = '1 hour ago';
            } else if (postMinutes < 1440) {
                createdAt = `${Math.floor(postMinutes / 60)} hours ago`;
            } else if (postMinutes < 2880) {
                createdAt = '1 day ago';
            } else {
                createdAt = `${Math.floor(postMinutes / 1440)} days ago`;
            }

            
            showPostTag.innerHTML += `
                <div class="rounded w-100 mb-3 p-3 my-post-div">
                    <div class="d-flex  pix-div mb-3">
                        <img src="" class="me-2 rounded-circle p-photo"/>
                        <div>
                            <h6 class="">${doc.data().author}</h6>
                            <h6>${createdAt}</h6>
                        </div>
                        
                    </div>
                    <div class="w-100">
                        <p>${doc.data().content}</p>
                    </div>
                    <div class="w-100">
                        <img src="${doc.data().image}" alt="" class="w-100">
                    </div>
                    <div class="mt-2 mb-2">
                        <span class="like-icon-div"><i class="bi bi-hand-thumbs-up-fill rounded-circle bg-primary like-icon"></i></span>
                        <span>${doc.data().numberOfLikes} like(s)</span>
                    </div>
                    <hr class="mb-1 mt-1">
                    <div class="d-flex align-items-center justify-content-center">
                        <button id="likeBtn" class="liked rounded w-100 text-center text-center d-flex align-items-center justify-content-center p-2" onclick="isLike('${doc.id}')">
                            <div>
                                <i class="fa-solid fa-thumbs-up like-icon" id="likeIcon${doc.id}"></i>
                            </div>
                            <div class="like1-text" id="like-text${doc.id}">Like</div>
                        </button>
                        <button class="comment rounded w-100 text-center d-flex align-items-center justify-content-center p-2" id="comment-btn" onclick="focusCommentInput('${doc.id}')">
                            <div class="me-2">
                                <i class="fa-sharp fa-solid fa-comment comment-icon"></i>
                            </div>
                            <div class="comment1-text">Comment</div>
                        </button>
                        <button class="share rounded w-100 text-center d-flex align-items-center justify-content-center p-2">
                            <div class="me-2"><i class="fa-solid fa-share share-icon"></i></div>
                            <div class="share1-text">Share</div>
                        </button>
                    </div>
                    <hr class="mt-1">
                    <div class="d-flex align-items-center">
                    <div class="pics-div me-2">
                    <h6 class="pics bg-white text-black rounded-circle d-flex align-items-center justify-content-center">B</h6>
                    </div>
                    <div class="w-100 position-relative">
                    <input type="text" name="" id="user-comment-input${doc.id}" placeholder="Write a comment..." class="comment-input p-1 ps-3 rounded-pill w-100">
                    <button onclick="sendComment('${doc.id}')" class="position-absolute comment-btn d-flex align-items-center justify-content-center rounded-circle">
                    <i class="fa-solid fa-square-arrow-up-right send-comment"></i>
                    </button>
                    </div>
                    </div>
                    <div id="comment-div${doc.id}"></div>
                </div>
                `
                doc.data().commentsBy.forEach((el)=> {
                    console.log(el);
                    document.getElementById(`comment-div${doc.id}`).innerHTML +=`
                    <div class='w-75 rounded mt-3 comment-div-inner bg-danger ms-5'>
                        <h6>${el.commentAuthor}</h6>                    
                        <span>${el.commentMsg}</span>
                    </div>
                    `
                })
            if (doc.data().likedBy.includes(currentUser)) {
                document.getElementById(`like-text${doc.id}`).style.color = "rgb(45,134,255)";
                document.getElementById(`likeIcon${doc.id}`).style.color = "rgb(45,134,255)";
            }
        });
    });
}
//self invoking function
displayAllPost();


let commentBtn = document.getElementById("comment-btn");

//this function when click on the comment button triggers the comment input box for the user to type in their comment
function focusCommentInput(id) {
    // userCommentInput.focus()
    document.getElementById(`user-comment-input${id}`).focus();
}
// let collect;
//this function updates the commentsBy field with both current user name and content of the text input in the database collection
function sendComment(id) {
    let userCommentText = document.getElementById(`user-comment-input${id}`);
    let commentsdisplayTag = document.getElementById(`comment-div${id}`);


    let commentsData = {
        commentAuthor: currentUser,
        commentMsg: userCommentText.value
    }

    var docRef = db.collection("Feeds").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            // Set the "capital" field of the city 'DC'
            return docRef.update({
                commentsBy: firebase.firestore.FieldValue.arrayUnion(commentsData),
                numberOfComments: doc.data().commentsBy.length + 1
            })
                .then(() => {
                    console.log("Document successfully updated!");
                    return docRef.get(); // Get the updated document
                })
                .then((doc) => {
                    console.log('Updated value of myField:', doc.data().commentsBy);
                    displayAllPost();
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}

// console.log(collect);

//getting the like button document id from the html tag
let likedBtn = document.getElementById("likeBtn");

//this function checks if a post is liked, it unlike a liked post when clicked on and also like a post if is not liked yet
function isLike(id) {
    console.log(currentUser);
    var docRef = db.collection("Feeds").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data())
            if (doc.data().likedBy.includes(currentUser)) {
                docRef.update({
                    // Atomically remove a user that unliked the post to "likedBy" array field.
                    likedBy: firebase.firestore.FieldValue.arrayRemove(currentUser),
                    //decreasing the number of likes by 1  
                    numberOfLikes: doc.data().numberOfLikes - 1
                })
                    .then(() => {
                        console.log("Document successfully updated!");
                        return docRef.get(); // Get the updated document
                    })
                    .then((doc) => {
                        console.log('Updated value of myField:', doc.data().likedBy);
                        displayAllPost();
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            } else {
                docRef.update({
                    // Atomically add a user that liked the post to "likedBy" array field.
                    likedBy: firebase.firestore.FieldValue.arrayUnion(currentUser),
                    //increasing the number of likes by 1
                    numberOfLikes: doc.data().numberOfLikes + 1
                })
                    .then(() => {
                        console.log("Document successfully updated!");
                        return docRef.get(); // Get the updated document
                    })
                    .then((doc) => {
                        console.log('Updated value of myField:', doc.data().likedBy);
                        displayAllPost();
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

//this function navigate from the dashboard to the profile page
function gotoProfile() {
    window.location.href = "../Profile/profile.html"
}