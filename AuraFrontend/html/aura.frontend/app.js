const favoriteButtons = document.querySelectorAll(".favorite-button");
const addCartButtons = document.querySelectorAll("[data-add-cart]");
const studioModeButtons = document.querySelectorAll("[data-studio-mode]");
const designLayer = document.querySelector("#designLayer");
const previewText = document.querySelector("#previewText");
const previewMode = document.querySelector("#previewMode");
const customText = document.querySelector("#customText");
const customColor = document.querySelector("#customColor");
const customScale = document.querySelector("#customScale");
const customRotate = document.querySelector("#customRotate");
const aiSuggestion = document.querySelector("#aiSuggestion");
const generateDesignButton = document.querySelector("[data-generate-design]");
const conceptCards = document.querySelectorAll("[data-concept]");
const garmentPreview = document.querySelector("#garmentPreview");
const garmentButtons = document.querySelectorAll("[data-garment]");
const beforeAfter = document.querySelector("[data-before-after]");
const compareSlider = document.querySelector("#compareSlider");

favoriteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-saved");
    button.textContent = button.classList.contains("is-saved") ? "♥" : "♡";
  });
});

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "Added";
    button.classList.add("is-added");
    window.setTimeout(() => {
      button.textContent = "Add to Cart";
      button.classList.remove("is-added");
    }, 1400);
  });
});

function updateStudioPreview() {
  if (!designLayer) {
    return;
  }

  const scale = Number(customScale?.value || 100) / 100;
  const rotation = Number(customRotate?.value || -4);
  const color = customColor?.value || "#d8c26a";
  const text = customText?.value || "AURA";

  previewText.textContent = text.slice(0, 12).toUpperCase();
  designLayer.style.color = color;
  designLayer.style.transform = `translateX(-50%) rotate(${rotation}deg) scale(${scale})`;
}

[customText, customColor, customScale, customRotate].forEach((control) => {
  control?.addEventListener("input", updateStudioPreview);
});

studioModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    studioModeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const mode = button.dataset.studioMode;
    designLayer?.classList.toggle("is-print", mode === "print");
    if (previewMode) {
      previewMode.textContent = mode === "print" ? "print concept" : "embroidered concept";
    }
    if (aiSuggestion) {
      aiSuggestion.textContent =
        mode === "print"
          ? "This artwork reads best oversized across the back with a small chest mark."
          : "Black hoodie matches best with gold embroidery centered high on the chest.";
    }
  });
});

const generatedConcepts = [
  {
    text: "LUXE",
    color: "#d8c26a",
    suggestion: "Gold thread creates a premium contrast on black fleece.",
  },
  {
    text: "TOKYO",
    color: "#e54646",
    suggestion: "Red linework works better as a bold back print.",
  },
  {
    text: "BLOOM",
    color: "#f1b6c8",
    suggestion: "Soft pink embroidery feels warmer on white or grey garments.",
  },
];

generateDesignButton?.addEventListener("click", () => {
  const concept = generatedConcepts[Math.floor(Math.random() * generatedConcepts.length)];
  if (customText) customText.value = concept.text;
  if (customColor) customColor.value = concept.color;
  if (aiSuggestion) aiSuggestion.textContent = concept.suggestion;
  updateStudioPreview();
});

conceptCards.forEach((card) => {
  card.addEventListener("click", () => {
    conceptCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    if (customText) {
      customText.value = card.dataset.concept || "AURA";
    }
    updateStudioPreview();
  });
});

const garmentSuggestions = {
  black: "Black hoodie matches best with gold embroidery centered high on the chest.",
  white: "White shirts make colorful print artwork sharper and more editorial.",
  grey: "Grey tees work well with black typography and cool silver thread.",
  dress: "A dress looks stronger with a smaller embroidered mark near the collar.",
  skirt: "Skirts suit repeating border patterns instead of one large center graphic.",
  jacket: "Jackets look premium with back artwork and a small front monogram.",
};

garmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    garmentButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const garment = button.dataset.garment || "black";
    garmentPreview?.setAttribute("data-garment", garment);
    if (aiSuggestion) {
      aiSuggestion.textContent = garmentSuggestions[garment] || garmentSuggestions.black;
    }
  });
});

compareSlider?.addEventListener("input", () => {
  beforeAfter?.style.setProperty("--reveal", `${compareSlider.value}%`);
});

updateStudioPreview();
