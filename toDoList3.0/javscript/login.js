const userinput = document.getElementById("username");
const passwordinput = document.getElementById("password");
const logoutBtnss = document.getElementById("logoutbtn");

// ================= LOGIN =================
const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", () => {
  const username = userinput.value;
  const password = passwordinput.value;

  if (username === "" || password === "") {
    alert("please fill the data ");
  } else {
    if (password.length < 6) {
      alert("Password must be at least 6 characters long. ");
    }
    const containsNumber = /\d/.test(password);
    if (!containsNumber) {
      alert("Password must contain at least one number.");
      return;
    }
    alert(`Welcome ${username}!`);
    // Example: redirect to dashboard page
    window.location.href = "/html/home.html";
  }

  // ============== REDIRETED FROM OTHER PAGE ================
  localStorage.setItem("loginUser", JSON.stringify(userinput.value));
  window.location.href = "/html/toDo.html";
});                                                             