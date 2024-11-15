const IDLE = "idle";
export const DRAW = "draw";
export const ERASE = "erase";
export const STAMP = "stamp";


export class Editor {
    #canvas;
    #pointerState = IDLE;
    #mode = DRAW;
    #path = [];
    #currentPaths = [];
    #pencilSize = 5;
    #color = "#000";
    #stamps = {
        stamp1: new Image(),
        stamp2: new Image(),
        stamp3: new Image(),
    };
    #currentStamp = "stamp1";


    constructor(canvas) {
        this.#canvas = canvas;

        this.#stamps.stamp1.src = "./img/catStamp.png";
        this.#stamps.stamp2.src = "./img/flowerStamp.png";
        this.#stamps.stamp3.src = "./img/snoopyStamp.png";

        this.#canvas.element.addEventListener("mousemove", (event) => {
            const coordinates = this.#recalculateCoordinates(event);
            switch (this.#pointerState) {
                case DRAW:
                    this.#path.push({
                        ...coordinates,
                        color: this.#color,
                        width: this.#pencilSize
                    });
                    this.#canvas.draw(this.#path);
                    break;
                case ERASE:
                    this.#path.push({
                        ...coordinates,
                        color: "#fff",
                        width: this.#pencilSize
                    });
                    this.#canvas.draw(this.#path);
            }
        })

        this.#canvas.element.addEventListener('mousedown', (event) => {
            if (this.#mode === STAMP && this.#currentStamp) {
                const coordinates = this.#recalculateCoordinates(event);
                this.#placeStamp(coordinates);
            } else {
                this.#pointerState = this.#mode;
            }
        });

        this.#canvas.element.addEventListener("mouseup", (event) => {
            this.#pointerState = IDLE;
            if (this.#path.length) {
                this.#currentPaths.push([...this.#path])
                this.#path = []
            }
        })
    }

    setMode(mode) {
        this.#mode = mode
    }

    setColor(color) {
        this.#color = color;
    }

    setPencilSize(size) {
        this.#pencilSize = size;
    }

    setStamp(stamp) {
        this.#currentStamp = stamp;
    }

    clear() {
        this.#canvas.clean();

    }

    undo() {
        const lastAction = this.#currentPaths.pop();
        if (!lastAction) return;

        this.#canvas.clean();

        this.#currentPaths.forEach((action) => {
            if (action.type === DRAW || action.type === ERASE) {
                this.#canvas.draw(action);
            } else if (action.type === STAMP) {
                const stamp = this.#stamps[action.stamp];
                this.#canvas.drawStamp(stamp, action.coordinates); // Redraw stamps
            }
        });
    }

    #recalculateCoordinates({ clientX, clientY }) {
        const rect = this.#canvas.element.getBoundingClientRect();
        return {
            x: ((clientX - rect.left) / rect.width) * this.#canvas.element.width,
            y: ((clientY - rect.top) / rect.height) * this.#canvas.element.height,
        };
    }

    #placeStamp(coordinates) {
        if (!this.#currentStamp) return;
        const currentStamp = this.#stamps[this.#currentStamp];
        this.#canvas.drawStamp(currentStamp, coordinates);

        this.#currentPaths.push({
            type: STAMP,
            stamp: this.#currentStamp,
            coordinates,
        });
    }
}