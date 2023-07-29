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

  parameterСhange.exportPrameters((position, size) => {
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

  imageHandler.downloadingImage();
});

/**
 * Обработчик отрисовки изображения содержет следующие методы:
 * @returns {object} addMainImage() - Добавление основного изображения
 * @returns {object} overlayImage() - Наложение изображения
 */
function createImageGenerator() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  /**
   * Отрисовывает изображение на холсте с задачами параметрами
   * @param {string} url - URL изображения
   * @param {string} typeImage - Тип изображения (main или overlay)
   * @param {number} x - Координата X верхнего левого угла изображения
   * @param {number} y - Координата Y верхнего левого угла изображения
   * @param {number} width - Ширена изображения
   * @param {number} height - Высота изображения
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
    /**
     * Добавляет основное изображение на холст.
     * @param {string} url - URL изображения
     */
    addMainImage(url) {
      drawImage(url, "main");
    },

    /**
     * Налагает дополнительное изображение на основное.
     * @param {string} mainPicture - URL основного изображения
     * @param {string} additionalImage - URL дополнительного изображения
     * @param {number} x - Координата X верхнего левого угла изображения
     * @param {number} y - Координата Y верхнего левого угла изображения
     * @param {number} [width=500] - Ширина изображения
     * @param {number} [height=500] - Высота изображения
     */
    overlayImage(mainPicture, additionalImage, x, y, width, height) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImage(mainPicture, "main");
      drawImage(additionalImage, "overlay", x, y, width, height);
    },
  };
}

/**
 * Обработчик изображения, содержащий методы:
 * @returns {Object} `importImageFromTheUser()`
 * @returns {Object} `runTheFunctionAfterImported()`
 * @returns {Object} `downloadingImage()`
 */
function createImageHandler() {
  const inputImportFile = document.querySelector(".result__send-file");
  return {
    /**
     * Получает изображение от пользователя
     * @returns {void}
     */
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

    /**
     * Запускает выполнение функции после того как пользовательское изображение будет загруженно.
     * @param {function} newFunction - функция которая будет выполнена
     * @returns {void}
     */
    async runTheFunctionAfterImported(newFunction) {
      inputImportFile.addEventListener("change", newFunction);
    },

    /**
     * Запускает скачивание изображения
     */
    downloadingImage() {
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

/**
 * Обработчик выбора накладываемого изображения, содержащий методы:
 * @returns `clickEvents()` - Запускает запускает передаваемую функцию при выборе картинки.
 */
function createSelectionImageOverlay() {
  const picturesBox = document.querySelector(".settings__pictures-box");

  return {
    clickEvents(newFunction) {
      picturesBox.addEventListener("click", (event) => {
        if (!event.target.classList.contains("settings__pictures")) {
          return;
        }

        newFunction(event);
      });
    },
  };
}

/**
 * Обработчик изменения параметров, содержащий методы:
 * @param {String} wrapButtons - ID элемента в котором находятся кнопки управления
 * @returns {Object} `exportPrameters()` - Передаёт изменённые параметры
 */
function createParameterСhange(wrapButtons) {
  if (!wrapButtons) {
    throw new Error("Не указан один из параметров");
  }

  const wrap = document.getElementById(wrapButtons);

  const position = { x: 0, y: 0 };
  const size = { width: 500, height: 500 };

  /**
   * Изменяет X,Y координаты накладываемого изображения
   */
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

  /**
   * Изменяет размер накладываемого изображения
   */
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
    /**
     * При клике вызывает функцию в которую передаёт изменённые параметры.
     * @param {callback} arrowFunction - Функция в которую передадутся изменённые параметры.
     */
    exportPrameters(arrowFunction) {
      wrap.addEventListener("click", (event) => {
        if (event.target.tagName != "BUTTON") return;
        arrowFunction(position, size);
      });
    },
  };
}
