import { CanvasAPI } from "./components/canvas.js";
import { Editor } from "./components/editor.js";
import { setupUI } from "./ui/event-listeners.js";


const stampSources = {
    stamp1: "./images/cat-stamp.png",
    stamp2: "./images/flower-stamp.png",
    stamp3: "./images/snoopy-stamp.png",
};

const canvasElement = document.querySelector(".canvas-js");
const canvas = new CanvasAPI(canvasElement);
const editor = new Editor(canvas, stampSources);

editor.setMode("draw");

setupUI(editor);

const colorSelector = document.querySelector(".color-selector-js");
colorSelector.addEventListener("input", (event) => {
    const color = event.target.value;
    editor.setColor(color);
});

const pencilSize = document.querySelector(".pencil-size-js");
const pencilSizeDisplay = document.querySelector(".pencil-size-display-js");
pencilSize.addEventListener("input", (event) => {
    const size = event.target.value;
    editor.setPencilSize(size);
    pencilSizeDisplay.textContent = size;
});

const clearButton = document.querySelector(".clear-button-js");
clearButton.addEventListener("click", () => {
    editor.clear();
});
