export function setupUI(editor) {
    const drawButton = document.querySelector(".draw-button-js");
    const eraseButton = document.querySelector(".erase-button-js");
    const undoButton = document.querySelector(".undo-button-js");
    const stampButtons = document.querySelectorAll(".stamp-button-js");

    function updateActiveButton(clickedButton) {
        const activeButtons = document.querySelectorAll(".draw-button-js, .erase-button-js, .stamp-button-js");
        activeButtons.forEach((button) => button.classList.remove("active"));
        clickedButton.classList.add("active");
    }

    drawButton.addEventListener("click", () => {
        editor.setMode("draw");
        updateActiveButton(drawButton);
    });

    eraseButton.addEventListener("click", () => {
        editor.setMode("erase");
        updateActiveButton(eraseButton);
    });

    undoButton.addEventListener("click", () => {
        editor.undo();
    });

    stampButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const stamp = event.target.dataset.stamp;
            editor.setStamp(stamp);
            editor.setMode("stamp");
            updateActiveButton(button);
        });
    });
}
