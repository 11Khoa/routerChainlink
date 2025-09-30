const year = new Date().getFullYear();
const copy=`<footer style="text-align: center;">&copy; ${year}</footer>`
document.body.insertAdjacentHTML("beforeend",copy)