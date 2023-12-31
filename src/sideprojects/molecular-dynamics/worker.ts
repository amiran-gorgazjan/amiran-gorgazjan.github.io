import { X, Y, VX, VY, AX, AY, SIGMA, EPSILON, numProps } from "./constants";

function getForcePotential2(epsilon: number, sigma: number, r: number) {
    return -24 * epsilon * (2 * Math.pow(sigma / r, 12) - Math.pow(sigma / r, 6)) / r;
}

function calculateLJBetweenAtoms(atoms: Float64Array, i : number, j : number) {
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

function updateVerlet(atoms: Float64Array, range: [number, number], dt: number) {
    const startIdx = range[0] * numProps;
    const endIdx = range[1] * numProps;

    for (let i = startIdx; i < endIdx; i += numProps) {
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

            const [forceX, forceY] = calculateLJBetweenAtoms(atoms, i, j);
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

onmessage = function (event) {
    const atoms = event.data.atoms;
    const range = event.data.range;
    const dt = event.data.dt;

    updateVerlet(atoms, range, dt);

    postMessage({
        atoms: atoms,
    })
}