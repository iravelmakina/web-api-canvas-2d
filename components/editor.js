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
    #stamps = {};
    #currentStamp = null


    constructor(canvas, stampSources) {
        this.#canvas = canvas;

        Object.keys(stampSources).forEach((key) => {
            const image = new Image();
            image.src = stampSources[key];
            this.#stamps[key] = image;
        });

        this.#currentStamp = Object.keys(this.#stamps)[0];

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

        this.#canvas.element.addEventListener("mouseup", () => {
            this.#pointerState = IDLE;
            if (this.#path.length) {
                this.#currentPaths.push({
                    type: this.#mode,
                    path: [...this.#path],
                    color: this.#color,
                    width: this.#pencilSize,
                });
                this.#path = [];
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
        this.#currentPaths = [];
    }

    undo() {
        if (this.#currentPaths.length === 0) {
            return;
        }

        this.#currentPaths.pop();
        this.#canvas.clean();

        this.#currentPaths.forEach((action) => {
            if (action.type === DRAW || action.type === ERASE) {
                this.#canvas.draw(action.path);
            } else if (action.type === STAMP) {
                const stamp = this.#stamps[action.stamp];
                this.#canvas.drawStamp(stamp, action.coordinates);
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