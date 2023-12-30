const settings = {
    simSpeed: {
        label: 'Simulation speed (fps)',
        type: 'range',
        min: 0, step: 1, max: 60, value: 60,
    },

    clickCreature: 'Rabbit',

    showRabbits: {
        label: 'Render rabbits',
        type: 'boolean',
        value: true,
    },
    showWolves: {
        label: 'Render foxes',
        type: 'boolean',
        value: true,
    },

    grassGrowthRate: {
        label: 'Vegetation growth rate',
        type: 'range',
        min: 0.1, step: 0.1, max: 2, value: 0.5,
    },
    maxVegetationEnergy: {
        label: 'Max vegetation energy',
        type: 'range',
        min: 0.1, step: 0.1, max: 5, value: 5,
    },

    graphScale: {
        x: 2,
        y: 0.1,
    },

    genetics: {
        Rabbit: {
            energyGiven: {
                label: 'Energy given to offspring',
                type: 'range',
                min: 0.1, step: 0.1, max: 5, value: 1,
            },
            birthingEnergy: {
                label: 'Energy needed to give birth',
                type: 'range',
                min: 0.1, step: 0.1, max: 5, value: 2,
            },
            minEatEnergy: {
                label: 'Minimum energy for vegetation to be to move towards it',
                path: 'genetics.Rabbit.minEatEnergy',
                type: 'range',
                min: 0.1, step: 0.1, max: 2, value: 0.1,
            },
            moveProbability: {
                label: 'Probability of moving',
                type: 'range',
                min: 0.01, step: 0.01, max: 1, value: 1,
            },
        },
        Wolf: {
            energyGiven: { 
                label: 'Energy given to offspring',
                type: 'range',
                min: 0.1, step: 0.1, max: 5, value: 0.5
            },
            birthingEnergy: {
                label: 'Energy needed to give birth',
                type: 'range',
                min: 0.1, step: 0.1, max: 5, value: 1
            },
            moveProbability: {
                label: 'Probability of moving',
                type: 'range',
                min: 0.01, step: 0.01, max: 1, value: 1
            },
        },
    },

    biology: {
        Rabbit: {
            maxAge: {
                label: 'Maximum age',
                type: 'range',
                min: 1, step: 1, max: 1000, value: 1000,
            },
        },
        Wolf: {
            maxAge: {
                label: 'Maximum age',
                type: 'range',
                min: 1, step: 1, max: 1000, value: 1000,
            },
        },
    },

    evolve: {
        label: 'Allow evolution',
        type: 'boolean',
        value: true,
    },

    mutationRate: 0.2,

    mutateToPredator: {
        label: 'Allow mutation to predator',
        type: 'boolean',
        value: true,
    },

    mutateToPredatorProbability: 0.00001,
};