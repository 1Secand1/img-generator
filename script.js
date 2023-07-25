const imageHandler = createImageHandler();
const imageGenerator = createImageGenerator();
const selectionImageOverlay = createSelectionImageOverlay();
const parameterСhange = createParameterСhange("settings");

imageHandler.runTheFunctionAfterImported(async () => {
  let userImage = await imageHandler.importImageFromTheUser();
  let overlayImage;
  imageGenerator.addMainImage(userImage);

  selectionImageOverlay.clickEvents((event) => {
    const { src: selectedPicture } = event.target;
    overlayImage = selectedPicture;
    imageGenerator.overlayImage(userImage, selectedPicture, 0, 0);
  });

  parameterСhange.update((position, size) => {
    imageGenerator.overlayImage(
      userImage,
      overlayImage,
      position.y,
      position.x,
      size.width,
      size.height
    );
    console.log(position, size);
  });

  imageHandler.exportImage();
});

/**
 * @typedef {Object} ImageGenerator - объект, содержащий методы для отрисовки изображений на холсте
 * @property {function(url: string): void} addMainImage - метод для добавления главного изображения на холст
 * @property {function(url: string): void} overlayImage - метод для добавления изображения поверх уже нарисованного на холсте
 */
function createImageGenerator() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  /**
   * Загружает изображение по указанному URL и отрисовывает его на холсте.
   * Если isMainImage равен true, то изменяет размеры холста в соответствии с размерами изображения.
   * @param {string} url - URL изображения
   * @param {boolean} typeImage - флаг, указывающий, является ли изображение главным
   * @returns {void}
   */

  function drawImage(url, typeImage, x, y, width, height) {
    if (!url || !typeImage) {
      throw new Error("Указанны не все параметры");
    }

    const img = new Image();

    img.onload = () => {
      if (typeImage === "main") {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }

      if (typeImage === "overlay") {
        ctx.drawImage(img, x, y, width ?? 500, height ?? 500);
      }
    };
    img.src = url;
  }

  return {
    addMainImage(url) {
      drawImage(url, "main");
    },

    overlayImage(mainPicture, additionalImage, x, y, width, height) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImage(mainPicture, "main");
      drawImage(additionalImage, "overlay", x, y, width, height);
    },
  };
}

function createImageHandler() {
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
        canvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.download = "my-image.png";
          link.href = URL.createObjectURL(blob);
          link.click();
        });
      });
    },
  };
}

function createSelectionImageOverlay() {
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

function createParameterСhange(wrapButtons) {
  if (!wrapButtons) {
    throw new Error("Не указан один из параметров");
  }

  const wrap = document.getElementById(wrapButtons);

  const position = { x: 0, y: 0 };
  const size = { width: 500, height: 500 };

  function moveImage() {
    const moveAmount = 100;

    wrap.addEventListener("click", (event) => {
      if (event.target.tagName != "BUTTON") return;

      const button = event.target;

      switch (button.id) {
        case "up":
          position.x -= moveAmount;
          break;
        case "down":
          position.x += moveAmount;
          break;
        case "left":
          position.y -= moveAmount;
          break;
        case "right":
          position.y += moveAmount;
          break;
      }

      if (position.x < 0) {
        position.x = 0;
        return;
      }

      if (position.y < 0) {
        position.y = 0;
        return;
      }
    });
  }
  moveImage();

  function resizeImage() {
    wrap.addEventListener("click", (event) => {
      if (event.target.tagName != "BUTTON") return;

      const button = event.target;

      if (button.id === "enlarge") {
        size.width += 100;
        size.height += 100;
      }

      if (button.id === "reduce") {
        size.width -= 100;
        size.height -= 100;
      }
    });
  }
  resizeImage();

  return {
    update(arrowFunction) {
      wrap.addEventListener("click", (event) => {
        if (event.target.tagName != "BUTTON") return;
        arrowFunction(position, size);
      });
    },
  };
}
