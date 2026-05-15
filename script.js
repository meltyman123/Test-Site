// Button click message
function showMessage() {
    alert("Hey! Thanks for clicking! 🎉");
}

// Form submit
function submitForm(event) {
    event.preventDefault(); // stops page from reloading

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    document.getElementById("form-response").textContent =
        `Thanks ${name}! We'll reach out to ${email} soon. ✅`;

    // Clear the form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
}
