import { createMonster, setPosition, Position } from "/modules/games/koobas/entities"
import { createLayer, setValueAt, getValueAt, Layer } from "/modules/games/koobas/layers"
import { MOUNTAIN, WIDTH, HEIGHT, CAVE } from "/modules/games/koobas/enums"

export function createCaveLayer() {
    const layer = createLayer(MOUNTAIN)
    let startX = Math.floor(Math.random() * WIDTH)
    let startY = Math.floor(Math.random() * HEIGHT)
    let x = startX
    let y = startY

    setValueAt(layer, x, y, CAVE)

    let steps = 0
    let maxSteps = 1000
    let prevDirection: Position | null = null
    const straightness = Math.random()

    while (true) {
        const direction = getRandomDirection(prevDirection, straightness)
        const newX = x + direction.x
        const newY = y + direction.y

        if (newX >= 1 && newX < WIDTH - 1 && newY >= 1 && newY < HEIGHT - 1) {
            x = newX
            y = newY
            setValueAt(layer, x, y, CAVE)

            if (++steps >= maxSteps) {
                break
            }

            if (Math.abs(x - startX) >= WIDTH * 0.8) {
                break
            }
        }
        
        prevDirection = direction
    }

    while (removeSingleWalls(layer) > 0) {
        // Keep removing single walls until there are none left
        continue
    }

    return { layer, start: { x: startX, y: startY }, end: { x, y } }
}

export function removeSingleWalls(layer: Layer) {
    let numRemoved = 0

    for (let x = 1; x < WIDTH - 1; x++) {
        for (let y = 1; y < HEIGHT - 1; y++) {
            const value = getValueAt(layer, x, y)

            if (value === MOUNTAIN) {
                const neighbors = [
                    getValueAt(layer, x, y - 1), // Up
                    getValueAt(layer, x, y + 1), // Down
                    getValueAt(layer, x - 1, y), // Left
                    getValueAt(layer, x + 1, y), // Right
                ]

                if (neighbors.filter(neighbor => neighbor === MOUNTAIN).length <= 1) {
                    setValueAt(layer, x, y, CAVE)
                    numRemoved++
                }
            }
        }
    }

    return numRemoved
}

export const directions = [
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 },  // Right
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 }   // Down
]

export function getRandomDirection(prevDirection: Position | null, straightness = 0.5) {
    if (prevDirection && Math.random() > straightness) {
        return prevDirection
    }

    let availableDirections = directions.filter(direction => {
        if (!prevDirection) return true

        return direction.x !== -prevDirection.x && direction.y !== -prevDirection.y
    })

    return availableDirections[Math.floor(Math.random() * availableDirections.length)]
}

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

export const createMonsters = function (caveLayerResult: ReturnType<typeof createCaveLayer>, currentLevel = 1) {
    const MIN_DISTANCE = 5;
    const MIN_DISTANCE_TO_START = 10;
    const MAX_MONSTERS = 50;
    const monsters = [];

    // Randomly select positions for N monsters
    for (let i = 0; i < MAX_MONSTERS; i++) {
        const x = Math.floor(Math.random() * WIDTH);
        const y = Math.floor(Math.random() * HEIGHT);

        if (getValueAt(caveLayerResult.layer, x, y) === CAVE) {
            const distToStart = calculateDistance(x, y, caveLayerResult.start.x, caveLayerResult.start.y);

            let valid = true;

            for (const monster of monsters) {
                const distToMonster = calculateDistance(x, y, monster.position.x, monster.position.y);

                if (
                    distToMonster < MIN_DISTANCE ||
                    distToStart < MIN_DISTANCE_TO_START
                ) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                const monster = createMonster();
                setPosition(monster, { x, y });
                monsters.push(monster);
            }
        }
    }

    return monsters;
};
