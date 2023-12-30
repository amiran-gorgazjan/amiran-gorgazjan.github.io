class CanvasControls extends Observable {
    constructor(selectors) {
        super();
        this.canvasEl = document.querySelector(selectors.canvas);
    }

    connect() {
        this.canvasEl.addEventListener('click', event => {
            const widthRatio = event.target.width / event.target.clientWidth;
            const heightRatio = event.target.height / event.target.clientHeight;
            
            let x = Math.floor(event.offsetX * widthRatio);
            let y = Math.floor(event.offsetY * heightRatio);

            x = Math.min(Math.max(0, x), event.target.width);
            y = Math.min(Math.max(0, y), event.target.height);

            this.trigger(`click.canvas`, { x, y });
        });
    }
}