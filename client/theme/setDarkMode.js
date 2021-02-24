const toggle   = document.getElementById("dark-mode-toggle");
const circle   = document.getElementById("dark-mode-toggle-circle");
const body     = document.getElementById("body");
localStorage.theme = "light";

toggle.addEventListener("click", () => {
    if (localStorage.theme == "light") {
        // To dark
        localStorage.theme = "dark";
        toggle.style.justifyContent  = "flex-end";
        toggle.style.backgroundColor = "#000";
        circle.style.backgroundColor = "#000";
        circle.style.borderColor     = "#34495e";
        body.className = "dark-mode";
    } else {
        // To light
        localStorage.theme = "light";
        toggle.style.justifyContent = "flex-start";
        toggle.style.backgroundColor = "#ecf0f1";
        circle.style.backgroundColor = "#34495e";
        circle.style.borderColor     = "#34495e";
        body.className = "";
    }
});