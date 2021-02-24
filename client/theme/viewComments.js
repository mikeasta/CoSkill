const viewBtn  = document.getElementById("post_id-view-comments");
const comments = document.getElementById("post_id-comments");
let isComments = false;

viewBtn.addEventListener("click", () => {
    comments.style.display = isComments ? "none" : "block";
    isComments = !isComments;
});