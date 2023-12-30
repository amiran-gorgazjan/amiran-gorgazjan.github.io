const statsRenderer = {
    canvases: {},

    initCanvases() {
        this.canvases.rabbitsHistogram = this.getStatsCanvas('rabbits-histogram');
        this.canvases.wolvesHistogram = this.getStatsCanvas('wolves-histogram');
        this.canvases.rabbitsPopulation = this.getStatsCanvas('rabbits-population');
        this.canvases.wolvesPopulation = this.getStatsCanvas('wolves-population');

        this.debugEl = document.getElementById('debug');
    },

    getStatsCanvas(id) {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
    
        return {
            canvasWidth: parseInt(canvas.getAttribute('width'), 10),
            canvasHeight: parseInt(canvas.getAttribute('height'), 10),
            ctx: ctx,
        };
    },

    render() {
        this.renderDebugger();

        this.renderHistogram('rabbits', 'rgba(0, 100, 200, 0.6)', this.canvases.rabbitsHistogram);
        this.renderHistogram('wolves', 'rgba(255, 105, 0, 0.6)', this.canvases.wolvesHistogram);

        this.renderPopulation('rabbits', 'rgba(0, 100, 200, 0.3)', this.canvases.rabbitsPopulation);
        this.renderPopulation('wolves', 'rgba(255, 105, 0, 0.3)', this.canvases.wolvesPopulation);
    },

    renderDebugger() {
        const el = this.debugEl;

        el.textContent = '';

        el.appendChild(createNode(`<p>Total steps: ${stats.steps}</p>`));

        each(stats.performance, (key, value) => {
            const avg = Math.round(value.time / value.count);

            el.appendChild(createNode(`<p>${key}: ${avg} (ms)</p>`));
        });

        el.appendChild(createNode(`<p>- - -</p>`));

        each(stats.averages, (index, metrics) => {
            const population = stats.population[index];

            el.appendChild(createNode(`<p><strong>${index}</strong></p>`));

            if (population.length) {
                el.appendChild(createNode(`<p>Count: ${population[population.length - 1]}</p>`));
            }

            each(metrics, (metric, averages) => {
                if (!averages.length) {
                    return;
                }

                const lastValue = Math.round(averages[averages.length - 1] * 100) / 100;
                el.appendChild(createNode(`<p>${metric}: ${lastValue}</p>`));
            });
        });
    },

    renderHistogram(key, fillStyle, { ctx, canvasWidth, canvasHeight }) {
        const scale = settings.graphScale;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const histograms = stats.histograms[key];
        const entries = Object.entries(histograms);

        for (const [metric, histogram] of entries) {
            const categories = Object.entries(histogram);

            ctx.fillStyle = fillStyle;

            for (const [categoryKey, category] of categories) {
                const x = (category.value * 100) * scale.x;
                const height = category.count * scale.y * 10;
                const y = canvasHeight - height;
                const width = 1 * scale.x;

                ctx.fillRect(x, y, width, height);
            }
        }
    },

    renderPopulation(key, strokeStyle, { ctx, canvasWidth, canvasHeight }) {
        const values = stats.population[key];
        const len = values.length;
        const scale = settings.graphScale;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeStyle;

        let x = canvasWidth;
        let y = canvasHeight - (values[len - 1] * scale.y / 2);

        ctx.moveTo(x, y);

        for (let i = len - 2; i > 0 || x > 0; i--) {
            x -= scale.x;
            y = canvasHeight - (values[i] * scale.y / 2);

            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }
}