function getForcePotential(p0, p1, radius) {
    // Could be cached
    const { epsilon, sigma } = getEpsilonSigma(p0, p1);

    return 4 * epsilon * (
        Math.pow(sigma / radius, 12) - Math.pow(sigma / radius, 6)
    );
}

function getDistance(a, b) {
    return Math.sqrt(
        Math.pow(a.pos.x - b.pos.x, 2) + 
        Math.pow(a.pos.y - b.pos.y, 2)
    );
}

function getEpsilonSigma(a, b) {
    let epsilon = a.epsilon;
    let sigma = a.sigma;

    // Combination rule
    // if (a.name !== b.name) {
    //     epsilon = (a.epsilon + b.epsilon) / 2;
    //     sigma = Math.sqrt(a.sigma * b.sigma);
    // }

    return { epsilon, sigma }
}

function calculateUpdates(particles, allParticles, dt) {
    const updates = [];

    // Calculate the step velocities for each particle
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
    
        let vx = p.pos.x - p.oldPos.x;
        let vy = p.pos.y - p.oldPos.y;
    
        let vljx = 0;
        let vljy = 0;
        
        for (let j = 0; j < allParticles.length; j++) {
            const p1 = allParticles[j];
            
            if (p.id === p1.id) {
                continue;
            }
    
            const distance = getDistance(p, p1);
            const potential = getForcePotential(p, p1, distance) * dt;
            
            vljx += potential * (p.pos.x - p1.pos.x);
            vljy += potential * (p.pos.y - p1.pos.y);
        }
    
        updates[i] = {
            x: vx + vljx,
            y: vy + vljy
        }
    }

    return updates;
}

onmessage = function (event) {
    const particles = event.data.chunk;
    const allParticles = event.data.allParticles;
    const chunkIndex = event.data.chunkIndex;
    const dt = event.data.dt;

    const updates = calculateUpdates(particles, allParticles, dt);

    postMessage({
        updates: updates,
        chunkIndex: chunkIndex,
    });
}

