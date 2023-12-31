// src/sideprojects/molecular-dynamics/molecular-dynamics.ts
var createAtom = function(p) {
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
};
var init = function(width, height) {
  const dist = 3.74;
  const x0 = width / 2;
  const y0 = height / 2;
  const sigma = 3.4;
  const epsilon = 1;
  const mass = 1;
  const columns = Math.ceil(Math.sqrt(particles));
  for (let i = 0;i < particles; i++) {
    const x = x0 + dist * (i % columns);
    const y = y0 + dist * Math.floor(i / columns);
    const vx = Math.random() - 0.5;
    const vy = Math.random() - 0.5;
    const ax = 0;
    const ay = 0;
    const atom = createAtom({ x, y, vx, vy, ax, ay, sigma, epsilon, mass });
    for (let k = 0;k < numProps; k++) {
      atoms[i * numProps + k] = atom[k];
    }
  }
};
var getForcePotential2 = function(epsilon, sigma, r) {
  return -24 * epsilon * (2 * Math.pow(sigma / r, 12) - Math.pow(sigma / r, 6)) / r;
};
var calculateLJBetweenAtoms = function(i, j) {
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
var updateVerlet = function(dt) {
  for (let i = 0;i < atoms.length; i += numProps) {
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
      const [forceX, forceY] = calculateLJBetweenAtoms(i, j);
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
var calculateTemperature = function() {
  let totalKineticEnergy = 0;
  for (let i = 0;i < atoms.length; i += numProps) {
    const mass = atoms[i + MASS];
    const vx = atoms[i + VX];
    const vy = atoms[i + VY];
    const speedSquared = vx * vx + vy * vy;
    totalKineticEnergy += 0.5 * mass * speedSquared;
  }
  const degreesOfFreedom = 2 * (atoms.length / numProps);
  const temperature = 2 * totalKineticEnergy / (degreesOfFreedom * kB);
  return temperature;
};
var draw = function(ctx, width, height) {
  for (let i = 0;i < atoms.length; i += numProps) {
    const x = atoms[i + X];
    const y = atoms[i + Y];
    const sigma = atoms[i + SIGMA];
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    const xZoomedInCenter = x / zoom;
    const yZoomedInCenter = y / zoom;
    ctx.arc(xZoomedInCenter, yZoomedInCenter, sigma / zoom / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Temperature: ${temperature}`, 10, height - 10);
    ctx.fillText(`Elapsed time: ${elapsedTime}`, 10, height - 30);
  }
};
var run = function(ctx, width, height) {
  for (let i = 0;i < 1 * stepsPerFrame; i++) {
    updateVerlet(dt);
    elapsedTime += dt;
  }
  if (frameCounter % framesPerTemperatureUpdate === 0) {
    temperature = calculateTemperature();
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  draw(ctx, width, height);
  frameCounter++;
  requestAnimationFrame(() => run(ctx, width, height));
};
var main = function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }
  init(width, height);
  run(ctx, width, height);
};
var X = 0;
var Y = 1;
var VX = 2;
var VY = 3;
var AX = 4;
var AY = 5;
var SIGMA = 6;
var EPSILON = 7;
var MASS = 8;
var numProps = 9;
var particles = 200;
var atoms = new Float64Array(particles * numProps);
var kB = 0.00000000000000000000001380649;
var zoom = 1;
var temperature = 0;
var elapsedTime = 0;
var stepsPerFrame = 5;
var speed = 0.01;
var framesPerTemperatureUpdate = 10;
var frameCounter = 0;
var dt = 1 / stepsPerFrame * speed;
main();
