"use strict";
function main() {
  const canvas = document.querySelector("#canvas");
  let ctx = canvas.getContext("2d");

  async function getPictureFromTheUser() {
    const inputSendFile = document.querySelector(".result__send-file");
    const file = inputSendFile.files[0];
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  async function canvasRendering() {
    const inputSendFile = document.querySelector(".result__send-file");

    inputSendFile.addEventListener("change", async () => {
      const userPicture = await getPictureFromTheUser();
      cleanupCanvas();
      resizingCanvas(userPicture);
      AddImageCanvas(userPicture);
      addSelectedPictureTheMainPicture(userPicture);
    });
  }
  canvasRendering();

  function addSelectedPictureTheMainPicture(mainPicture) {
    const picturesBox = document.querySelector(".settings__pictures-box");

    picturesBox.addEventListener("click", (event) => {
      if (!event.target.classList.contains("settings__pictures")) return;
      const { src: selectedPicture } = event.target;

      redrawCanvas(mainPicture, selectedPicture);
    });
  }

  function redrawCanvas(mainPicture, additionalImage) {
    cleanupCanvas();
    AddImageCanvas(mainPicture);
    AddImageCanvas(additionalImage);
  }

  function AddImageCanvas(url) {
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  }

  function cleanupCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function resizingCanvas(userPicture) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
    };
    img.src = userPicture;
  }
}
main();
