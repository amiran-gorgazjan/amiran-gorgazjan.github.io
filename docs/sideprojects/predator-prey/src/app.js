const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = parseInt(canvas.getAttribute('width'), 10);
const canvasHeight = parseInt(canvas.getAttribute('height'), 10);

statsRenderer.initCanvases();
settingsControls = new SettingsControls(settings);

const world = {
    width: canvasWidth,
    height: canvasHeight,

    grass: create2dArray(1, canvasWidth, canvasHeight),

    rabbitField: create2dArray(null, canvasWidth, canvasHeight),
    rabbits: [],

    wolfField: create2dArray(null, canvasWidth, canvasHeight),
    wolves: [],
};

// Controls
const canvasControls = new CanvasControls({
    canvas: '#canvas',
});

canvasControls.on('click.canvas', pos => {
    if (settings.clickCreature === 'Rabbit') {
        return addCreature(world, new Rabbit(pos, {
            energyGiven: settings.genetics.Rabbit.energyGiven.value,
            birthingEnergy: settings.genetics.Rabbit.birthingEnergy.value,
            minEatEnergy: settings.genetics.Rabbit.minEatEnergy.value,
            moveProbability: settings.genetics.Rabbit.moveProbability.value,
        }));
    }

    if (settings.clickCreature === 'Wolf') {
        return addCreature(world, new Wolf(pos, {
            energyGiven: settings.genetics.Wolf.energyGiven.value,
            birthingEnergy: settings.genetics.Wolf.birthingEnergy.value,
            moveProbability: settings.genetics.Wolf.moveProbability.value,
        }));
    }
});

canvasControls.connect();

// Loop
// updateGrass = stats.createMeasuredFunction(updateGrass);
// updateCreatures = stats.createMeasuredFunction(updateCreatures);
// renderField = stats.createMeasuredFunction(renderField);
// renderCreatures = stats.createMeasuredFunction(renderCreatures);

function loop() {
    stats.steps += 1;

    if (stats.steps % 2 === 0) {
        updateGrass(world.grass, settings);
    }

    updateCreatures(world, 'rabbits');
    updateCreatures(world, 'wolves');
    removeCreatures(world, 'rabbits')

    renderField(world.grass, ctx);

    if (settings.showRabbits.value) {
        renderCreatures(world, 'rabbits', ctx);
    }

    if (settings.showWolves.value) {
        renderCreatures(world, 'wolves', ctx);
    }

    if (stats.steps % 10 === 0) {
        stats.measureWorldState(world);
        statsRenderer.render();
    }

    if (settings.simSpeed.value < 60) {
        setTimeout(loop, 1000 / settings.simSpeed.value);
    } else {
        window.requestAnimationFrame(loop);
    }
};

// loop = stats.createMeasuredFunction(loop);

window.requestAnimationFrame(loop);