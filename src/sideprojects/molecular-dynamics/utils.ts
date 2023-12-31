import { numProps, MASS, VX, VY } from "./constants";

// Boltzmann's constant (in appropriate units)
const kB = 1.380649e-23;

export function calculateTemperature(atoms: Float64Array) : number {
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