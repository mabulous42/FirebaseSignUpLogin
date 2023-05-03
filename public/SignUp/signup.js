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
                alert("Signed up successfully");
                userName.value = "";
                email.value = "";
                password.value = "";
                console.log(user);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }
}