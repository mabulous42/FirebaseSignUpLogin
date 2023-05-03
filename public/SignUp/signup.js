let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");


function signUp(ev) {
    ev.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        alert("Signed up successfully");
        console.log(user);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
}