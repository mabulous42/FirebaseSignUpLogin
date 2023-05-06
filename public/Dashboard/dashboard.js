let userName = document.getElementById("userName");
let postModal = document.getElementById("myPostModal");
let postBtn = document.getElementById("post-btn");
let content = document.getElementById("content");
let showPostTag = document.getElementById("show-post");

postModal.style.visibility = "hidden";

let currentUser = JSON.parse(localStorage.getItem("CU"));
console.log(currentUser);

console.log(currentUser.name);
// firebase.auth().signOut().then(() => {
//     // Sign-out successful.
//   }).catch((error) => {
//     // An error happened.
//   });

// function postBlog(ev) {
//     let data = {
//         author: author.value,
//         title: title.value,
//         content: content.value
//     }
//     console.log(data);
//     ev.preventDefault();
//     // Add a new document in collection "cities"
//     db.collection("tweets").doc().set(data)
//         .then(() => {
//             console.log("Document successfully written!");
//             window.location.href = "blog.html";
//         })
//         .catch((error) => {
//             console.error("Error writing document: ", error);
//         });
// }

function openPostModal() {
    postModal.style.visibility = "visible";
}

function closePostModal() {
    postModal.style.visibility = "hidden";
}

function enableButton() {
    postBtn.disabled = false;
}

function createPost() {
    let data = {
        author: currentUser.name,
        content: content.value
    }

    // Add a new document in collection "cities"
    db.collection("Feeds").doc().set(data)
        .then(() => {
            console.log("Document successfully written!");
            // window.location.href = "blog.html";

            content.value = "";
            postModal.style.visibility = "hidden";
            displayAllPost();

        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function displayAllPost() {
    showPostTag.innerHTML = "";
    db.collection("Feeds").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
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
                            <button class="like rounded w-100 text-center text-center d-flex align-items-center justify-content-center p-2">
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
                            <div class="w-100">
                                <input type="text" name="" id="" placeholder="Write a comment..." class="comment-input p-1 ps-3 rounded-pill w-100">
                            </div>
                        </div>
                    </div>
            `
        });
    });
}
displayAllPost();