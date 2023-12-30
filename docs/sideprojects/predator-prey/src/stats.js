function each(object, fn) {
    for (let [key, value] of Object.entries(object)) {
        fn(key, value);
    }
}

const stats = {
    steps: 0,
    averages: {
        rabbits: {
            energy: [],
            energyGiven: [],
            birthingEnergy: [],
            moveProbability: [],
            minEatEnergy: [],
        },
        wolves: {
            energy: [],
            energyGiven: [],
            birthingEnergy: [],
            moveProbability: [],
            minEatEnergy: [],
        },
    },
    population: {
        rabbits: [],
        wolves: [],
    },
    performance: {},
    histograms: {
        rabbits: {
            energyGiven: [],
        },
        wolves: {
            energyGiven: [],
        },
    },

    createMeasuredFunction(func) {
        const name = func.name;
    
        if (!this.performance[name]) {
            this.performance[name] = { time: 0, count: 0 };
        }
    
        return (...args) => {
            const start = performance.now();
            func(...args);
            const time = performance.now() - start;
            this.performance[name].time += time;
            this.performance[name].count += 1;
        }
    },

    measureWorldState(world) {
        ['rabbits', 'wolves'].forEach(creatureIndex => {
            const len = world[creatureIndex].length;

            this.population[creatureIndex].push(len || 0);

            if (!len) {
                return;
            }


            let energy = 0;
            let energyGiven = 0;
            let birthingEnergy = 0;
            let minEatEnergy = 0;
            let moveProbability = 0;

            const energyGivenHist = {};

            world[creatureIndex].forEach(creature => {
                // Averages
                energy += creature.energy;
                energyGiven += creature.energyGiven;
                birthingEnergy += creature.birthingEnergy;
                moveProbability += creature.moveProbability;
                minEatEnergy += creature.minEatEnergy;

                // To histogram
                const energyGivenRounded = ~~(creature.energyGiven * 100) / 100;
                if (!energyGivenHist[energyGivenRounded]) {
                    energyGivenHist[energyGivenRounded] = {
                        value: energyGivenRounded,
                        count: 0
                    };
                }
                energyGivenHist[energyGivenRounded].count += 1;
            });

            this.averages[creatureIndex].energy.push(energy / len);
            this.averages[creatureIndex].energyGiven.push(energyGiven / len);
            this.averages[creatureIndex].birthingEnergy.push(birthingEnergy / len);
            this.averages[creatureIndex].moveProbability.push(moveProbability / len);
            this.averages[creatureIndex].minEatEnergy.push(minEatEnergy / len);

            this.histograms[creatureIndex].energyGiven = energyGivenHist;
        });
    },
}
