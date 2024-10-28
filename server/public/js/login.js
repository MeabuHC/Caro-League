const form = document.querySelector("form");
const errorDiv = document.querySelector(".error");

//Reset error
errorDiv.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //Get value
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.status === "error" || data.status === "fail") {
      errorDiv.textContent = data.message;
      errorDiv.style.display = "block";
    } else if (data.status === "success") {
      location.assign("/");
    }
  } catch (err) {
    console.log(err);
  }
});
