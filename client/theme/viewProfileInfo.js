const activator = document.getElementById("profile-more-activator");
const hidden    = document.getElementById("profile-more-hidden");
let isActive    = false;

activator.addEventListener("click", () => {
    hidden.style.display = isActive ? "none" : "flex";
    isActive = !isActive; 
});