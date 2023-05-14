let currentUserTag = document.getElementById("showCurrent-userPost");
let profilePicture = document.getElementById("profile-picture");

//declaring a variable to save the name of the current user
let currentUser;
let thisUser;

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
        console.log(thisUser);
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
function displayAllPost() {
    currentUserTag.innerHTML = "";
    db.collection("Feeds").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().author == currentUser) {
                console.log("Perfect");

                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                currentUserTag.innerHTML += `
            <div class="rounded w-100 mb-3 p-3 my-post-div w-100">
                <div class="d-flex align-items-center pix-div">
                    <h6
                        class="me-2 text-black rounded-circle bg-white d-flex align-items-center justify-content-center pix" id="profilepix">
                        A</h6>
                    <h6 class="">${doc.data().author}</h6>
                </div>
                <div class="w-100">
                    <p>${doc.data().content}</p>
                </div>
                <div class="w-100">
                    <img src="../images/photo.webp" alt="" class="w-100">
                </div>
                <hr class="mb-1">
                <div class="d-flex align-items-center justify-content-center">
                    <button id="likeBtn" class="like rounded w-100 text-center text-center d-flex align-items-center justify-content-center p-2" onclick="isLike('${doc.id}')">
                        <div class="me-2">
                            <i class="fa-solid fa-thumbs-up like-icon"></i>
                        </div>
                        <div class="like1-text">Like</div>
                    </button>
                    <button class="comment rounded w-100 text-center d-flex align-items-center justify-content-center p-2">
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
                        <input type="text" name="" id="" placeholder="Write a comment..." class="comment-input p-1 ps-3 rounded-pill w-100">
                        <button class="position-absolute comment-btn d-flex align-items-center justify-content-center rounded-circle">
                        <i class="fa-solid fa-square-arrow-up-right send-comment"></i>
                        </button>
                    </div>
                </div>
            </div>
            `
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


