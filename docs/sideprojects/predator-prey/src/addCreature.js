const fieldsMap = {
    "Rabbit": {
        index: 'rabbits',
        field: 'rabbitField',
    },
    "Wolf": {
        index: 'wolves',
        field: 'wolfField',
    }
};

function addCreature(world, creature) {
    const name = creature.constructor.name;
    console.log(name);

    const field = world[fieldsMap[name].field];
    const index = world[fieldsMap[name].index];

    console.log('Adding creature', creature);
    field[creature.x][creature.y] = creature;
    index.push(creature);
}