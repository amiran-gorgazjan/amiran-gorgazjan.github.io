function updateCreatures(world, creature) {
    const len = world[creature].length;

    for (let i = 0; i < len; i++) {
        world[creature][i].step(world);
    }

    removeCreatures(world, creature);
}

function removeCreature(creature) {
    return creature !== null;
}

function removeCreatures(world, creature) {
    world[creature] = world[creature].filter(removeCreature);
}