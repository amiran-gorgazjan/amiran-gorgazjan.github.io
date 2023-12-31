// src/sideprojects/molecular-dynamics/constants.ts
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

// src/sideprojects/molecular-dynamics/utils.ts
function calculateTemperature(atoms) {
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
}
var kB = 0.00000000000000000000001380649;

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
    const vx = (Math.random() - 0.5) * 5;
    const vy = (Math.random() - 0.5) * 5;
    const ax = 0;
    const ay = 0;
    const atom = createAtom({ x, y, vx, vy, ax, ay, sigma, epsilon, mass });
    for (let k = 0;k < numProps; k++) {
      atoms[i * numProps + k] = atom[k];
    }
  }
};
var draw = function(ctx, width, height) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  for (let i = 0;i < atoms.length; i += numProps) {
    const x = atoms[i + X];
    const y = atoms[i + Y];
    const sigma = atoms[i + SIGMA];
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    const xAdjusted = (x - offsetX) / zoom;
    const yAdjusted = (y - offsetY) / zoom;
    ctx.arc(xAdjusted, yAdjusted, sigma / zoom / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.font = "12px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(`Temperature: ${temperature}`, 10, height - 10);
  ctx.fillText(`Elapsed time: ${elapsedTime}`, 10, height - 30);
  const now = Date.now();
  const dt = now - lastTimestamp;
  lastTimestamp = now;
  ctx.fillText(`Frame time: ${dt} ms`, 10, height - 50);
  frameCounter++;
};
var postMessages = function() {
  workerConfigs.forEach((workerConfig) => {
    workerConfig.worker.postMessage({
      atoms,
      range: workerConfig.range,
      dt
    });
    workerConfig.busy = true;
  });
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
  postMessages();
  function update() {
    if (frameCounter % framesPerTemperatureUpdate === 0) {
      temperature = calculateTemperature(atoms);
    }
    elapsedTime += dt;
    draw(ctx, width, height);
    postMessages();
  }
  workerConfigs.forEach((workerConfig) => {
    workerConfig.worker.onmessage = (e) => {
      const { atoms: newAtoms } = e.data;
      const startIdx = workerConfig.range[0] * numProps;
      const endIdx = workerConfig.range[1] * numProps;
      for (let i = startIdx;i < endIdx; i++) {
        atoms[i] = newAtoms[i];
      }
      workerConfig.busy = false;
      if (workerConfigs.every((w) => !w.busy)) {
        update();
      }
    };
  });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const newZoom = zoom * Math.pow(1.1, -e.deltaY / 100);
    offsetX = (offsetX - e.offsetX) * (newZoom / zoom) + e.offsetX;
    offsetY = (offsetY - e.offsetY) * (newZoom / zoom) + e.offsetY;
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
};
var particles = 200;
var atoms = new Float64Array(particles * numProps);
var numWorkers = window.navigator.hardwareConcurrency;
var atomsPerWorker = Math.ceil(particles / numWorkers);
var workerConfigs = Array.from({ length: numWorkers }).map((_, i) => {
  const worker = new Worker("./worker.js");
  const start = i * atomsPerWorker;
  const end = Math.min((i + 1) * atomsPerWorker, particles);
  return {
    worker,
    range: [start, end],
    busy: false,
    updatedAtoms: null
  };
});
var zoom = 1;
var offsetX = 0;
var offsetY = 0;
var temperature = 0;
var elapsedTime = 0;
var lastTimestamp = Date.now();
var frameCounter = 0;
var dtPerFrame = 0.001;
var framesPerTemperatureUpdate = 10;
var dt = dtPerFrame;
main();
