let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");

function signUp(ev) {
    ev.preventDefault();
    if (password.value.length < 8) {
        alert("Password must be atleast 8 characters long")
    } else {
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                user.updateProfile({
                    displayName: userName.value,
                }).then(() => {
                    alert("Signed up successfully");
                    userName.value = "";
                    email.value = "";
                    password.value = "";
                    console.log(user);
                    window.location.href = "../index.html"
                }).catch((error) => {
                    // An error occurred
                    // ...
                });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }
}

function gotoSignInPage(ev) {
    ev.preventDefault();
    window.location.href = "../index.html";
}