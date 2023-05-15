let currentUserTag = document.getElementById("showCurrent-userPost");
let profilePicture = document.getElementById("profile-picture");
let displayProfilePix = document.getElementById("display-profile-pix");
let profileNameTag = document.getElementById("profile-name");




//declaring a variable to save the name of the current user
let currentUser;
let thisUser;
let profilePix;

let date = new Date();

//getting the displayName of the current user
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(user);
        //passing the displayName into variable currentUser
        currentUser = user.displayName;
        thisUser = user
        profilePix = user.photoURL;
        console.log(thisUser);
        profileNameTag.innerHTML = currentUser;
        displayProfilePix.innerHTML = `

    <img src="${profilePix}" class="picture rounded-circle"/>

`
        // ...
    } else {
        // User is signed out
        // ...
        // document.getElementById("display-null").style.display = "none";
        window.location.href = "../index.html"
    }
    console.log(currentUser);
    firstLetter = currentUser.charAt(0);
});



//this is a self invoke function that displays all the posts in the database by fetching from the database and then displays it
async function displayAllPost() {
    currentUserTag.innerHTML = "";
    await db.collection("Feeds").orderBy("time", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().author == currentUser) {
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

                currentUserTag.innerHTML += `
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
                    <div id="comment-div${doc.id}"></div>
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
                </div>
                `
                if (doc.data().likedBy.includes(currentUser)) {
                    document.getElementById(`like-text${doc.id}`).style.color = "rgb(45,134,255)";
                    document.getElementById(`likeIcon${doc.id}`).style.color = "rgb(45,134,255)";
                }
            }

        });
    });
}

displayAllPost();

function gotoHome() {
    window.location.href = "../Dashboard/dashboard.html";
}

function uploadImage(event) {
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

function savePictureToStorage(event) {
    event.preventDefault();
    let file = profilePicture.files[0]
    let imgName = profilePicture.files[0].name

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storage.child(imgName).put(file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                thisUser.updateProfile({
                    photoURL: downloadURL
                }).then(() => {
                    console.log("Profile successfully updated");
                }).catch((error) => {
                    console.log(error.message);
                });
            });
        });
}




