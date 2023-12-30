function mod(n, m) {
    return ((n % m) + m) % m;
}

function fast_mod(n, m) {
    if (n < 0) {
        return m + n;
    }

    if (n >= m) {
        return n - m;
    }

    return n;
}

function randomTerm(value) {
    return ;
}

function randomise(value, rate) {
    return value + (value * ((0.5 - Math.random()) * (rate || settings.mutationRate)));
}

function keep(value) {
    return {
        between(min, max) {
            return Math.max(Math.min(value, max), min);
        }
    };
}

class Creature {
    constructor(pos, { energyGiven, birthingEnergy, minEatEnergy, moveProbability }) {
        const species = this.constructor.name;

        // GENETICS
        // How much energy is given to an offspring
        this.energyGiven = settings.evolve.value ? randomise(energyGiven) : settings.genetics[species].energyGiven.value; 
        // How much energy should have a parent have to give birth
        this.birthingEnergy = settings.evolve.value ? randomise(birthingEnergy) : settings.genetics[species].birthingEnergy.value;
        // How likely the creature is going to move to a new position
        this.moveProbability = settings.evolve.value ? keep(randomise(moveProbability)).between(0, 1) : settings.genetics[species].moveProbability.value;

        if (this instanceof Rabbit) {
            // How much energy should a plant have to move towards it
            this.minEatEnergy = settings.evolve.value ? randomise(minEatEnergy) : settings.genetics[species].minEatEnergy.value;
        }

        // COLOR
        const colorMod = keep(255 * (this.energyGiven / 1.1)).between(0, 255);
        if (this instanceof Rabbit) {
            this.color = {
                r: colorMod,
                g: colorMod,
                b: 255,
            };
        } else {
            this.color = { r: 255, g: 105, b: 0 };
        }

        // PHYSICS (cannot be changed by evolution)
        this.x = pos.x;
        this.y = pos.y;

        this.energy = energyGiven;
        this.age = 0;
        this.maxAge = settings.biology[species].maxAge.value;
        this.baseMoveEnergy = 0.1;
        this.bmr = 0.015;
        this.minEnergy = 0.05;
        this.grassEatEfficiency = 0.6;
        this.canBirthPredator = false;

        // Cached randomness pointer
        this.pointer = ~~(Math.random() * config.random.length);
    }

    increasePointer() {
        this.pointer += 1;
        if (this.pointer >= config.random.length) {
            this.pointer = 0;
        }
    }

    superStep({ ownIndex, ownField, eatField, eatIndex, predatorField, predatorIndex, grassField }) {
        this.increasePointer();

        this.age += 1;
        this.energy -= this.energy * this.bmr;

        if (this.energy <= this.minEnergy || this.age > this.maxAge) {
            return this.kill(this, ownIndex, ownField);
        }

        if (this.tryGiveBirth(ownIndex, ownField, eatField, predatorField, predatorIndex)) {
            if (this.energy <= this.minEnergy) {
                return this.kill(this, ownIndex, ownField);
            }

            return;
        }

        if (this.tryEatGrassAtCurrentPosition(eatField)) {
            // this.poop(grassField);
            return;
        }

        if (this.tryEatCreatureAtCurrentPosition(eatField, eatIndex)) {
            // this.poop(grassField);
            return;
        }

        // this.poop(grassField);

        if (this.tryMove(ownField, eatField)) {
            return;
        }
    }

    tryGiveBirth(ownIndex, ownField, eatField, predatorField, predatorIndex) {
        if (this.energy >= this.birthingEnergy && this.energy - this.energyGiven >= 0) {
            const pos = this.getFreePosition(ownField, eatField);

            if (pos) {
                if (this.canBirthPredator && Math.random() > 0.999) {
                    const offspring = new Wolf(pos, {
                        energyGiven: this.energyGiven,
                        birthingEnergy: this.birthingEnergy,
                        moveProbability: this.moveProbability,
                    });

                    predatorIndex.push(offspring);
                    predatorField[pos.x][pos.y] = offspring;
                } else {
                    const offspring = new this.constructor(pos, {
                        energyGiven: this.energyGiven,
                        birthingEnergy: this.birthingEnergy,
                        moveProbability: this.moveProbability,
                        minEatEnergy: this.minEatEnergy,
                    });

                    ownIndex.push(offspring);
                    ownField[pos.x][pos.y] = offspring;
                }

                this.energy -= this.energyGiven;

                return true;
            }
        }

        return false;
    }

    tryEatGrassAtCurrentPosition(eatField) {
        const grassEnergy = eatField[this.x][this.y];

        if (
            // Is grass
            typeof grassEnergy === 'number' &&
            // Is big enough grass
            grassEnergy >= this.minEatEnergy
        ) {
            // You can only eat half your body size in one step
            let maxConsumableEnergy = this.energy * 0.5;

            if (grassEnergy >= maxConsumableEnergy) {
                this.energy += maxConsumableEnergy * this.grassEatEfficiency;
                eatField[this.x][this.y] -= maxConsumableEnergy;
            } else {
                this.energy += grassEnergy * this.grassEatEfficiency;
                eatField[this.x][this.y] = 0;
            }

            return true;
        }

        return false;
    }

    tryEatCreatureAtCurrentPosition(eatField, eatIndex) {
        const creature = eatField[this.x][this.y];

        if (creature !== null && typeof creature === 'object' && creature.energy < this.energy) {
            this.energy += creature.energy;
            this.kill(creature, eatIndex, eatField);

            return true;
        }

        return false;
    }

    tryMove(ownField, eatField) {
        const random = config.random[this.pointer];

        if (random > this.moveProbability) {
            return false;
        }

        // Dividing by energy === larger animals move more efficiently
        const moveEnergy = 1 / (this.energy * 1000);

        // Don't move if there's not enough energy to move
        if (this.energy <= moveEnergy) {
            return false;
        }

        const pos = this.getFreePosition(ownField, eatField);

        // Don't move if there's no available grid spot to move to
        if (!pos) {
            return false;
        }

        this.moveTo(pos, ownField);
        this.energy -= moveEnergy;

        return true;
    }

    getFreePosition(ownField, eatField) {
        const width = ownField.length;
        const height = ownField[0].length;

        const offsets = config.r1Offsets.length;
        const randomNum = config.random[this.pointer];
        const start = ~~(randomNum * offsets);
        let lastFreePosition = false;

        for (let i = 0; i < offsets; i += 1) {
            const index = fast_mod(start + i, offsets);
            const offset = config.r1Offsets[index];

            const x = fast_mod(this.x + offset[0], width);
            const y = fast_mod(this.y + offset[1], height);

            // Same type of creature is already on tile
            if (ownField[x][y] !== null) {
                continue;
            }

            lastFreePosition = {x, y};
            
            // Move towards grass
            if (
                // Is grass
                typeof eatField[x][y] === 'number' &&
                // Is big enough grass
                eatField[x][y] >= this.minEatEnergy
            ) {
                return {x, y};
            }

            // Move towards creature
            if (eatField[x][y] !== null && typeof eatField[x][y] === 'object') {
                return {x, y};
            }
        }

        return lastFreePosition;
    }

    poop(grassField) {
        const amount = this.energy * 0.01;

        if (this.energy - amount <= this.minEnergy) {
            return false;
        }

        grassField[this.x][this.y] += amount;

        if (grassField[this.x][this.y] > 1) {
            grassField[this.x][this.y] = 1;
        }

        this.energy -= amount;

        return true;
    }

    moveTo(pos, ownField) {
        ownField[this.x][this.y] = null;

        this.x = pos.x;
        this.y = pos.y;

        ownField[this.x][this.y] = this;
    }

    kill(creature, creatureIndex, creatureField) {
        const index = creatureIndex.indexOf(creature);
        creatureIndex[index] = null;
        creatureField[creature.x][creature.y] = null;
    }
}

class Rabbit extends Creature {
    constructor(pos, genetics) {
        super(pos, genetics);
        this.canBirthPredator = true;
    }

    step(world) {
        return this.superStep({
            ownIndex: world.rabbits,
            ownField: world.rabbitField,

            eatField: world.grass,

            predatorField: world.wolfField,
            predatorIndex: world.wolves,

            grassField: world.grass,
        });
    }
}

class Wolf extends Creature {
    constructor(pos, genetics) {
        delete genetics.minEatEnergy;
        super(pos, genetics);
    }

    step(world) {
        const args = {
            ownIndex: world.wolves,
            ownField: world.wolfField,

            eatIndex: world.rabbits,
            eatField: world.rabbitField,

            grassField: world.grass,
        };

        this.superStep(args);
    }
}
