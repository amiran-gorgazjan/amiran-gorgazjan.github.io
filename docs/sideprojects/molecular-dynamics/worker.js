// src/sideprojects/molecular-dynamics/constants.ts
var X = 0;
var Y = 1;
var VX = 2;
var VY = 3;
var AX = 4;
var AY = 5;
var SIGMA = 6;
var EPSILON = 7;
var numProps = 9;

// src/sideprojects/molecular-dynamics/worker.ts
var getForcePotential2 = function(epsilon, sigma, r) {
  return -24 * epsilon * (2 * Math.pow(sigma / r, 12) - Math.pow(sigma / r, 6)) / r;
};
var calculateLJBetweenAtoms = function(atoms, i, j) {
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
  const forceMagnitude = getForcePotential2(epsilon, sigma, r);
  const forceX = forceMagnitude * dx / r;
  const forceY = forceMagnitude * dy / r;
  return [forceX, forceY];
};
var updateVerlet = function(atoms, range, dt) {
  const startIdx = range[0] * numProps;
  const endIdx = range[1] * numProps;
  for (let i = startIdx;i < endIdx; i += numProps) {
    const x = atoms[i + X];
    const y = atoms[i + Y];
    const vx = atoms[i + VX];
    const vy = atoms[i + VY];
    const ax = atoms[i + AX];
    const ay = atoms[i + AY];
    atoms[i + X] = x + vx * dt + ax * dt * dt * 0.5;
    atoms[i + Y] = y + vy * dt + ay * dt * dt * 0.5;
    let new_ax = 0;
    let new_ay = 0;
    for (let j = 0;j < atoms.length; j += numProps) {
      if (i === j)
        continue;
      const [forceX, forceY] = calculateLJBetweenAtoms(atoms, i, j);
      new_ax += forceX;
      new_ay += forceY;
    }
    const old_vx = atoms[i + VX];
    const old_vy = atoms[i + VY];
    const new_vx = old_vx + (ax + new_ax) * dt * 0.5;
    const new_vy = old_vy + (ay + new_ay) * dt * 0.5;
    atoms[i + VX] = new_vx;
    atoms[i + VY] = new_vy;
    atoms[i + AX] = new_ax;
    atoms[i + AY] = new_ay;
  }
};
onmessage = function(event) {
  const atoms = event.data.atoms;
  const range = event.data.range;
  const dt = event.data.dt;
  updateVerlet(atoms, range, dt);
  postMessage({
    atoms
  });
};
