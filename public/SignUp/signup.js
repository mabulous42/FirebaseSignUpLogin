let firstName = document.getElementById("user-name");
let email = document.getElementById("user-email");
let password = document.getElementById("user-password");
let surname = document.getElementById("surname");

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
                    displayName: firstName.value + " " + surname.value,
                }).then(() => {
                    alert("Signed up successfully");
                    firstName.value = "";
                    surname.value = "";
                    email.value = "";
                    password.value = "";
                    console.log(user);
                    setTimeout(() => {
                        window.location.href = "../index.html"                        
                    }, 2000);
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