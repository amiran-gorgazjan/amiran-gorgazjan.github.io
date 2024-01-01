// Molecular Dynamics simulation module
// The simulation is based on the Verlet integration method.
// Uses forces from the Lennard-Jones potential.
// The simulation is in 2D.
//const atoms : number[] = [];

import { X, Y, VX, VY, AX, AY, SIGMA, EPSILON, MASS, numProps } from "./constants";
import { calculateTemperature } from "./utils";

const particles = 400;

const atoms = new Float64Array(particles * numProps);
// const atoms : number[] = [];
const numWorkers = window.navigator.hardwareConcurrency * 2 + 1

// Precalculate the indices of the atoms that each worker will be responsible for
const atomsPerWorker = Math.ceil(particles / numWorkers);

const workerConfigs = Array.from({ length: numWorkers }).map((_, i) => {
    const worker = new Worker("./worker.js");

    const start = i * atomsPerWorker;
    const end = Math.min((i + 1) * atomsPerWorker, particles);

    return {
        worker,
        range: [start, end],
        busy: false,
        updatedAtoms: null,
    };
});

type CreateAtomProps = {
    x: number
    y: number
    vx: number
    vy: number
    ax: number
    ay: number
    sigma: number
    epsilon: number
    mass: number
}

function createAtom(p: CreateAtomProps) {
    const arr = new Array(numProps);
    arr[X] = p.x;
    arr[Y] = p.y;
    arr[VX] = p.vx;
    arr[VY] = p.vy;
    arr[AX] = p.ax;
    arr[AY] = p.ay;
    arr[SIGMA] = p.sigma;
    arr[EPSILON] = p.epsilon;
    arr[MASS] = p.mass;
    return arr;
}

function init(width: number, height: number) {
    // Initialize the atoms array
    // A spiral of atoms
    const dist = 3.4 * 1.1;
    const x0 = width / 2;
    const y0 = height / 2;
    const sigma = 3.4;
    const epsilon = 1;
    const mass = 1;

    const columns = Math.ceil(Math.sqrt(particles));

    for (let i = 0; i < particles; i++) {
        const x = x0 + dist * (i % columns);
        const y = y0 + dist * Math.floor(i / columns);
        const vx = (Math.random() - 0.5) * 5;
        const vy = (Math.random() - 0.5) * 5;
        const ax = 0;
        const ay = 0;
        const atom = createAtom({x, y, vx, vy, ax, ay, sigma, epsilon, mass });

        for (let k = 0; k < numProps; k++) {
            atoms[i * numProps + k] = atom[k];
        }
    }
}

let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let temperature = 0;
let elapsedTime = 0;
let lastTimestamp = Date.now();
let frameCounter = 0;

function draw(ctx : CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw all atoms
    for (let i = 0; i < atoms.length; i += numProps) {
        const x = atoms[i + X];
        const y = atoms[i + Y];
        const sigma = atoms[i + SIGMA];

        ctx.beginPath();
        ctx.fillStyle = "#000000";

        // Adjust position based on zoom and offset
        const xAdjusted = (x - offsetX) / zoom;
        const yAdjusted = (y - offsetY) / zoom;

        ctx.arc(xAdjusted, yAdjusted, sigma / zoom / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Type the temperature to the lower left corner
    // Thin out the text
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Temperature: ${temperature}`, 10, height - 10);
    // Elapsed time
    ctx.fillText(`Elapsed time: ${elapsedTime}`, 10, height - 25);
    // Average time between frames
    const now = Date.now();
    const dt = now - lastTimestamp;
    lastTimestamp = now;
    ctx.fillText(`Frame time: ${dt} ms`, 10, height - 40);
    // number of cores
    ctx.fillText(`Number of worker threads: ${numWorkers}`, 10, height - 55);

    frameCounter++;
}

const dtPerFrame = 0.001;
const framesPerTemperatureUpdate = 10;
const dt = dtPerFrame;
let numFullUpdates = 0;

function postMessages() {
    workerConfigs.forEach((workerConfig) => {
        workerConfig.worker.postMessage({
            atoms,
            range: workerConfig.range,
            dt,
        });
        workerConfig.busy = true;
    });
}

function main() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    if (!ctx) {
        throw new Error("Could not get canvas context");
    };

    init(width, height);
    postMessages();

    function update() {
        if (frameCounter % framesPerTemperatureUpdate === 0) {
            temperature = calculateTemperature(atoms);
        }
        elapsedTime += dt;

        draw(ctx!, width, height);
    }

    workerConfigs.forEach((workerConfig) => {
        workerConfig.worker.onmessage = (e) => {
            const { atoms: newAtoms } = e.data;

            const startIdx = workerConfig.range[0] * numProps;
            const endIdx = workerConfig.range[1] * numProps;

            for (let i = startIdx; i < endIdx; i++) {
                atoms[i] = newAtoms[i];
            }
            workerConfig.busy = false;
    
            // If all workers are done
            if (workerConfigs.every(w => !w.busy)) {
                numFullUpdates++;

                if (numFullUpdates % 10 === 0) {
                    numFullUpdates = 0;
                    update()
                }
                postMessages();
            }
        };
    });

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
    
        // Calculate the new zoom level
        const newZoom = zoom * Math.pow(1.1, -e.deltaY / 100);
    
        // Update the offsets to center the zoom on the mouse position
        // (e.offsetX, e.offsetY) is the mouse position on the canvas
        offsetX = (offsetX - e.offsetX) * (newZoom / zoom) + e.offsetX;
        offsetY = (offsetY - e.offsetY) * (newZoom / zoom) + e.offsetY;
    
        // Set the new zoom level
        zoom = newZoom;
    });

    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        lastMouseX = e.offsetX;
        lastMouseY = e.offsetY;
    });

    canvas.addEventListener("mouseup", (e) => {
        isDragging = false;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const dx = e.offsetX - lastMouseX;
            const dy = e.offsetY - lastMouseY;
            lastMouseX = e.offsetX;
            lastMouseY = e.offsetY;

            offsetX -= dx * zoom;
            offsetY -= dy * zoom;
        }
    });
}

main();