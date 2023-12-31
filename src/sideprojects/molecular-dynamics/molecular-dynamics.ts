// Molecular Dynamics simulation module
// The simulation is based on the Verlet integration method.
// Uses forces from the Lennard-Jones potential.
// The simulation is in 2D.
//const atoms : number[] = [];

const X = 0;
const Y = 1;
const VX = 2;
const VY = 3;
const AX = 4;
const AY = 5;
const SIGMA = 6;
const EPSILON = 7;
const MASS = 8;

// Number of properties per atom
const numProps = 9;
const particles = 200;

const atoms = new Float64Array(particles * numProps);
// const atoms : number[] = [];

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
        const vx = Math.random() - 0.5;
        const vy = Math.random() - 0.5;
        const ax = 0;
        const ay = 0;
        const atom = createAtom({x, y, vx, vy, ax, ay, sigma, epsilon, mass });

        for (let k = 0; k < numProps; k++) {
            atoms[i * numProps + k] = atom[k];
        }
    }
    
}

function getForcePotential2(epsilon: number, sigma: number, r: number) {
    return -24 * epsilon * (2 * Math.pow(sigma / r, 12) - Math.pow(sigma / r, 6)) / r;
}

function calculateLJBetweenAtoms(i : number, j : number) {
    // Calculate the Lennard-Jones force between two atoms
    const x1 = atoms[i + X];
    const y1 = atoms[i + Y];
    const x2 = atoms[j + X];
    const y2 = atoms[j + Y];

    const sigma = atoms[i + SIGMA];
    const epsilon = atoms[i + EPSILON];

    const dx = x2 - x1;
    const dy = y2 - y1;
    
    const rSquared = dx * dx + dy * dy;
    const r = Math.sqrt(rSquared);

    if (r === 0) {
        return [0, 0];
    }

    // Calculate force magnitude
    const forceMagnitude = getForcePotential2(epsilon, sigma, r);

    // Calculate force components
    const forceX = forceMagnitude * dx / r;
    const forceY = forceMagnitude * dy / r;

    return [forceX, forceY];
}

function updateVerlet(dt : number) {
    for (let i = 0; i < atoms.length; i += numProps) {
        // Update the positions of all atoms based on the velocity and acceleration
        const x = atoms[i + X];
        const y = atoms[i + Y];
        const vx = atoms[i + VX];
        const vy = atoms[i + VY];
        const ax = atoms[i + AX];
        const ay = atoms[i + AY];
        atoms[i + X] = x + vx * dt + ax * dt * dt * 0.5;
        atoms[i + Y] = y + vy * dt + ay * dt * dt * 0.5;

        // Update the acceleration of all atoms
        let new_ax = 0;
        let new_ay = 0;
        for (let j = 0; j < atoms.length; j += numProps) {
            if (i === j) continue;

            const [forceX, forceY] = calculateLJBetweenAtoms(i, j);
            new_ax += forceX;
            new_ay += forceY;
        }

        // Calculate the new velocity
        // Vec3d new_vel = vel + (acc+new_acc)*(dt*0.5);
        const old_vx = atoms[i + VX];
        const old_vy = atoms[i + VY];
        const new_vx = old_vx + (ax + new_ax) * dt * 0.5;
        const new_vy = old_vy + (ay + new_ay) * dt * 0.5;
        atoms[i + VX] = new_vx;
        atoms[i + VY] = new_vy;

        // Update the acceleration
        atoms[i + AX] = new_ax;
        atoms[i + AY] = new_ay;
    }
}

// Boltzmann's constant (in appropriate units)
const kB = 1.380649e-23;

function calculateTemperature() : number {
    let totalKineticEnergy = 0;
    for (let i = 0; i < atoms.length; i += numProps) {
        const mass = atoms[i + MASS];
        const vx = atoms[i + VX];
        const vy = atoms[i + VY];
        const speedSquared = vx * vx + vy * vy;

        totalKineticEnergy += 0.5 * mass * speedSquared;
    }

    // The total number of degrees of freedom is 2 times the number of particles
    const degreesOfFreedom = 2 * (atoms.length / numProps);

    // Compute temperature using the equipartition theorem
    const temperature = (2 * totalKineticEnergy) / (degreesOfFreedom * kB);

    return temperature;
}

let zoom = 1;
let temperature = 0;
let elapsedTime = 0;

function draw(ctx : CanvasRenderingContext2D, width: number, height: number) {
    // Draw all atoms
    for (let i = 0; i < atoms.length; i += numProps) {
        const x = atoms[i + X];
        const y = atoms[i + Y];
        const sigma = atoms[i + SIGMA];
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        const xZoomedInCenter = x / zoom;
        const yZoomedInCenter = y / zoom;
        ctx.arc(xZoomedInCenter , yZoomedInCenter, sigma / zoom / 2, 0, 2 * Math.PI);
        ctx.fill();

        // Type the temperature to the lower left corner
        // Thin out the text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(`Temperature: ${temperature}`, 10, height - 10);
        // Elapsed time
        ctx.fillText(`Elapsed time: ${elapsedTime}`, 10, height - 30);
    }
}

const stepsPerFrame = 5;
const speed = 0.01;
const framesPerTemperatureUpdate = 10;
let frameCounter = 0;

const dt = 1 / stepsPerFrame * speed;

function run(ctx : CanvasRenderingContext2D, width: number, height: number) {
    for (let i = 0; i < 1 * stepsPerFrame; i++) {
        updateVerlet(dt);
        elapsedTime += dt;
    }

    if (frameCounter % framesPerTemperatureUpdate === 0) {
        temperature = calculateTemperature();
    }

    // clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    draw(ctx, width, height);

    frameCounter++;

    requestAnimationFrame(() => run(ctx, width, height));
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
    run(ctx, width, height);
}

main();