let userEmail = document.getElementById("email");
let userPassword = document.getElementById("password");

let registeredUsers = JSON.parse(localStorage.getItem("users"));
function signIn(ev) {
    ev.preventDefault();
    let currentUser = registeredUsers.find(user => user.email == userEmail.value);
    console.log(currentUser);
    firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        alert("Signed In successfully");
        console.log(user);
        window.location.href = "Dashboard/dashboard.html";
        localStorage.setItem("CU", JSON.stringify(currentUser));
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
}