let userName = document.getElementById("profile-name");
let postModal = document.getElementById("myPostModal");
let showPostTag = document.getElementById("show-post");
let writeAPostTag = document.getElementById("open-post-modal");
let whatsOnYourMindTag = document.getElementById("on-your-mind");

postModal.style.visibility = "hidden";

let currentUser = JSON.parse(localStorage.getItem("CU"));
console.log(currentUser);

console.log(currentUser.name);
userName.innerHTML = currentUser.name;
// firebase.auth().signOut().then(() => {
//     // Sign-out successful.
//   }).catch((error) => {
//     // An error happened.
//   });


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
                                        <p
                                            class="text-black rounded-circle bg-white d-flex align-items-center justify-content-center pix">
                                            A</p>
                                    </div>
                                    <div>Mustapha Abbas</div>
                                </div>
                                <div class="w-100 px-3">
                                    <textarea class="w-100 fs-4 write-content-input text-white" name="" id="content"
                                        cols="30" rows="6" placeholder="What's on your mind, ${currentUser.name}"
                                        onkeypress="enableButton()"></textarea>
                                </div>
                                <div class="px-3">
                                    <div
                                        class="d-flex align-items-center justify-content-between border border-white w-100 rounded p-1">
                                        <div>
                                            <button class="add-to-post p-2">Add to your post</button>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <div>B</div>
                                            <div>C</div>
                                            <div>D</div>
                                            <div>E</div>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary mt-3 w-100" id="post-btn" disabled
                                        onclick="createPost()">Post</button>
                                </div>
                            </div>
    `
}
writeSomething();


function openPostModal() {
    postModal.style.visibility = "visible";
}

function closePostModal() {
    postModal.style.visibility = "hidden";
}

let postBtn = document.getElementById("post-btn");
function enableButton() {
    postBtn.disabled = false;
}

let content = document.getElementById("content");
let num = Number(1);
function createPost() {
    let data = {
        id: num,
        author: currentUser.name,
        content: content.value,
        isLike: false
    }

    // Add a new document in collection "cities"
    db.collection("Feeds").doc().set(data)
        .then(() => {
            console.log("Document successfully written!");
            // window.location.href = "blog.html";
            
            content.value = "";
            postModal.style.visibility = "hidden";
            num++;
            displayAllPost();

        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

let ref;
function displayAllPost() {
    showPostTag.innerHTML = "";
    db.collection("Feeds").get().then((querySnapshot) => {
        querySnapshot.forEach((doc, index) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            console.log(doc.data().isLike);
            
            showPostTag.innerHTML += `
            <div class="rounded w-100 mb-3 p-3 my-post-div">
                <div class="d-flex align-items-center pix-div">
                    <h6
                        class="me-2 text-black rounded-circle bg-white d-flex align-items-center justify-content-center pix">
                        A</h6>
                    <h6 class="">${currentUser.name}</h6>
                </div>
                <div class="w-100">
                    <p>${doc.data().content}</p>
                </div>
                <div class="w-100">
                    <img src="../images/photo.webp" alt="" class="w-100">
                </div>
                <hr class="mb-1">
                <div class="d-flex align-items-center justify-content-center">
                    <button id="likeBtn" class="like rounded w-100 text-center text-center d-flex align-items-center justify-content-center p-2" onclick="isLike(${doc.data().id})">
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
        });
    });
}
displayAllPost();

let likedBtn = document.getElementById("likeBtn")
function isLike(id) {
    db.collection("Feeds").get().then((querySnapshot) => {
        querySnapshot.forEach((doc,index) => {
            // doc.data() is never undefined for query doc snapshots
            let liked = doc.data().id == id;
            if (liked == true) {

                console.log(liked);
            }
        })
    })
}