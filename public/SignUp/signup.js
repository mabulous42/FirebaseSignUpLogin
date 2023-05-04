let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");

let userData = JSON.parse(localStorage.getItem("users")) || [];
function signUp(ev) {
    ev.preventDefault();
    if (password.value.length < 8) {
        alert("Password must be atleast 8 characters long")
    } else {
        let data = {
            name: userName.value,
            email: email.value,
            password: password.value 
        }
        userData.push(data);
        localStorage.setItem("users", JSON.stringify(userData));
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                alert("Signed up successfully");
                userName.value = "";
                email.value = "";
                password.value = "";
                console.log(user);
                window.location.href = "../index.html"
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }
}