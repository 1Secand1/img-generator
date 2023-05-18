imageHandler().runTheFunctionAfterImported(async () => {
  let userImage = await imageHandler().importImageFromTheUser();
  imageGenerator().addMainImage(userImage);

  selectionImageOverlay().clickEvents((event) => {
    const { src: selectedPicture } = event.target;
    imageGenerator().redrawCanvas(userImage, selectedPicture);
  });

  imageHandler().exportImage();
});

/**
 * @typedef {Object} ImageGenerator - объект, содержащий методы для отрисовки изображений на холсте
 * @property {function(url: string): void} addMainImage - метод для добавления главного изображения на холст
 * @property {function(url: string): void} overlayImage - метод для добавления изображения поверх уже нарисованного на холсте
 */
function imageGenerator() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  /**
   * Загружает изображение по указанному URL и отрисовывает его на холсте.
   * Если isMainImage равен true, то изменяет размеры холста в соответствии с размерами изображения.
   * @param {string} url - URL изображения
   * @param {boolean} isMainImage - флаг, указывающий, является ли изображение главным
   * @returns {void}
   */
  function drawImage(url, isMainImage) {
    const img = new Image();

    img.onload = () => {
      if (isMainImage) {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  }

  return {
    addMainImage(url) {
      drawImage(url, true);
    },

    overlayImage(url) {
      drawImage(url, false);
    },
    redrawCanvas(mainPicture, additionalImage) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImage(mainPicture, true);

      const img = new Image();
      img.onload = () => {
        drawImage(additionalImage, false);
      };
      img.src = additionalImage;
    },
  };
}

function imageHandler() {
  const inputImportFile = document.querySelector(".result__send-file");
  return {
    async runTheFunctionAfterImported(newFunction) {
      inputImportFile.addEventListener("change", newFunction);
    },
    async importImageFromTheUser() {
      const file = inputImportFile.files[0];
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    },
    exportImage() {
      const download = document.querySelector("#download-imege");
      download.addEventListener("click", () => {
        console.log(canvas.toDataURL());
      });
    },
  };
}

function selectionImageOverlay() {
  const picturesBox = document.querySelector(".settings__pictures-box");

  return {
    clickEvents(newFunction) {
      picturesBox.addEventListener("click", (event) => {
        if (!event.target.classList.contains("settings__pictures")) return;
        newFunction(event);
      });
    },
  };
}
