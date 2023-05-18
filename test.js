const canvas = document.querySelector("#canvas");

// test("/144-20220104_220553-1536x1152.jpg");

// let url = nam();

// function nam() {
//   const picturesBox = document.querySelector(".settings__pictures-box");
//   picturesBox.addEventListener("click", (event) => {
//     if (!event.target.classList.contains("settings__pictures")) return;
//     url = event.target.src;

//   });
// }

/**
 * @param {HTMLCanvasElement} canvas
 */
function initImageGenerator(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas is not defined!");
  }

  const ctx = canvas.getContext("2d");

  const images = [];

  return {
    /**
     * @param {string} pathToImage
     * @param {number} multiplier
     */
    addImage(pathToImage, multiplier = 1) {
      let img = new Image();
      img.src = pathToImage;

      console.log(img.width, img.width);

      img.width = img.width / multiplier;
      img.height = img.height / multiplier;

      images.push(img);

      return this;
    },

    render() {
      images.forEach((image) => {
        image.addEventListener('load', () => {

          const { width, height } = image;

          ctx.drawImage(image, 0, 0);

          if (canvas.width < width) {
            canvas.width = width;
          }
          if (canvas.height < height) {
            canvas.height = height;
          }
        })
      })

      return this;
    },
  };
}



const generator = initImageGenerator(canvas)
  .addImage();


generator.addImage(getPictureFromTheUser())
// .....
generator.render()