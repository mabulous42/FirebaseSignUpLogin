let userName = document.getElementById("userName");
let postModal = document.getElementById("myPostModal");

postModal.style.visibility = "hidden";

let currentUser = JSON.parse(localStorage.getItem("CU"));
console.log(currentUser);

userName.innerHTML = currentUser.name;
// firebase.auth().signOut().then(() => {
//     // Sign-out successful.
//   }).catch((error) => {
//     // An error happened.
//   });

function postBlog(ev) {
    let data = {
        author: author.value,
        title: title.value,
        content: content.value
    }
    console.log(data);
    ev.preventDefault();
    // Add a new document in collection "cities"
    db.collection("tweets").doc().set(data)
        .then(() => {
            console.log("Document successfully written!");
            window.location.href = "blog.html";
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function openPostModal() {
    postModal.style.visibility = "visible";    
}

function closePostModal() {
    postModal.style.visibility = "hidden";

}