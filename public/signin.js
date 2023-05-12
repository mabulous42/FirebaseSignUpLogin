let userEmail = document.getElementById("email");
let userPassword = document.getElementById("password");

function signIn(ev) {
    ev.preventDefault();
    firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        alert("Signed In successfully");
        console.log(user);
        window.location.href = "Dashboard/dashboard.html";
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
}

function gotoSignUpPage(ev) {
    ev.preventDefault();
    window.location.href = "./SignUp/signup.html";
}