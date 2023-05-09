let currentUserTag = document.getElementById("showCurrent-userPost");

//declaring a variable to save the name of the current user
let currentUser;
let firstLetter;

//getting the displayName of the current user
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(user);
        //displaying the current user name
        // profileName.innerHTML = user.displayName;
        // userName.innerHTML = user.displayName;
        //passing the displayName into variable currentUser
        currentUser = user.displayName;
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
            <div class="rounded w-100 mb-3 p-3 my-post-div">
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


