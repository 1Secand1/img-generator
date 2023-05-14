const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

AddImageСanvas("/144-20220104_220553-1536x1152.jpg");

(function displayPictureOnClick() {
  const picturesBox = document.querySelector(".settings__pictures-box");

  picturesBox.addEventListener("click", (event) => {
    if (!event.target.classList.contains("settings__pictures")) return;

    const { src: PictureUrl } = event.target;

    redrawingCanvas("/144-20220104_220553-1536x1152.jpg", PictureUrl);
  });
})();



function redrawingCanvas(mainPicture, additionalImage) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  AddImageСanvas(mainPicture);
  AddImageСanvas(additionalImage);
}

function AddImageСanvas(url) {
  var img = new Image();

  img.onload = () => ctx.drawImage(img, 0, 0, 300, 200);

  img.src = url;
}
