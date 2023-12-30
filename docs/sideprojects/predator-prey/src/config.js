// https://docs.google.com/spreadsheets/d/1YrGgHf8ZQs9YrbaqoglgHcozMTaKYJzf1FgElTgYqPQ/edit#gid=0

const config = {
    r1Offsets: [
        [1, -1], [0, -1], [-1, -1], [1, 0], [-1, 0], [1, 1], [0, 1], [-1, 1],
    ],

    // r1Offsets: [
    //     [0, -1], [1, 0], [-1, 0], [0, 1],
    // ],

    random: Array.from({ length: 10000 }, () => Math.random()),

    fillStyle: {
        histogram: {
            energyGiven: 'rgba(0, 100, 0, 0.5)',
            moveProbability: 'rgba(0, 0, 255, 0.5)',
        }
    }
};

config.r1Offsets.forEach(offset => offset.push(
    Math.sqrt((offset[0] * offset[0]) + (offset[1] * offset[1]))
));
