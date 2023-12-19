// The terminal max width is 80 characters
// we subtract 2 to account for the border
const WIDTH = 80 - 2
const HEIGHT = 20 - 2

const TRANSPARENT = -1
const CAVE = 0
const MOUNTAIN = 1
const START = 2
const END = 3
const PLAYER = 4
const APPLE = 5
const MONSTER = 6
const GOLD = 7
const FOG = 8
const SHOP = 9

const graphics = {
    [TRANSPARENT]: ' ',
    [CAVE]: '░',
    [MOUNTAIN]: '█',
    [START]: '↓',
    [END]: '↑',
    [PLAYER]: '⍢',
    [APPLE]: '○',
    [MONSTER]: 'Ψ',
    [GOLD]: '$',
    [FOG]: ' ',
    [SHOP]: 'S',
}

// 1 = filled (mountain)
// 0 = empty
function createLayer(fillValue = TRANSPARENT) {
    return Array.from({ length: HEIGHT * WIDTH }, () => fillValue)
}

function getValueAt(level, x, y) {
    return level[y * WIDTH + x]
}

function setValueAt(level, x, y, value) {
    level[y * WIDTH + x] = value
}

const directions = [
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 },  // Right
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 }   // Down
]

function getRandomDirection(prevDirection, straightness = 0.5) {
    if (prevDirection && Math.random() > straightness) {
        return prevDirection
    }

    let availableDirections = directions.filter(direction => {
        if (!prevDirection) return true

        return direction.x !== -prevDirection.x && direction.y !== -prevDirection.y
    })

    return availableDirections[Math.floor(Math.random() * availableDirections.length)]
}

function createCaveLayer() {
    const layer = createLayer(MOUNTAIN)
    let startX = Math.floor(Math.random() * WIDTH)
    let startY = Math.floor(Math.random() * HEIGHT)
    let x = startX
    let y = startY

    setValueAt(layer, x, y, CAVE)

    let steps = 0
    let maxSteps = 1000
    let prevDirection = null
    const straightness = Math.random()

    while (true) {
        const direction = getRandomDirection(prevDirection, straightness)
        const newX = x + direction.x
        const newY = y + direction.y

        if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
            x = newX
            y = newY
            setValueAt(layer, x, y, CAVE)

            if (++steps >= maxSteps) {
                break
            }

            if (Math.abs(x - startX) >= WIDTH * 0.5) {
                break
            }
        }
        
        prevDirection = direction
    }

    return { layer, start: { x: startX, y: startY }, end: { x, y } }
}

function mergeLayers(layers = []) {
    if (layers.length === 0) {
        console.warn('No layers to merge')
        return []
    }

    const merged = createLayer()

    for (const layer of layers) {
        for (let i = 0; i < layer.length; i++) {
            if (layer[i] !== TRANSPARENT) {
                merged[i] = layer[i]
            }
        }
    }

    return merged
}

function renderLayers(layers = []) {
    const merged = mergeLayers(layers)

    let lines = []

    for (let y = 0; y < HEIGHT; y++) {
        let line = ''

        for (let x = 0; x < WIDTH; x++) {
            const value = getValueAt(merged, x, y)
            line += graphics[value]
        }

        lines.push(line)
    }

    return lines.join('\n')
}

const createPlayer = function() {
    return {
        position: { x: 0, y: 0 },
        health: 10,
        gold: 0,
        apples: 5,
    }
}

const setPosition = function(entity, position) {
    entity.position.x = position.x
    entity.position.y = position.y
}

const move = function(caveLayer, entity, direction) {
    const newX = entity.position.x + direction.x
    const newY = entity.position.y + direction.y

    if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
        const value = getValueAt(caveLayer.layer, newX, newY)

        if (value === CAVE) {
            setPosition(entity, { x: newX, y: newY })
        }
    }
}

function illuminate(fogLayer, caveLayer, position) {
    const maxDistance = 5; // Maximum distance to cast rays

    for (let angle = 0; angle < 360; angle += 2) {
        const rayDirX = Math.cos(angle * Math.PI / 180);
        const rayDirY = Math.sin(angle * Math.PI / 180);

        let rayX = position.x + 0.5; // Add 0.5 to avoid integer coordinates
        let rayY = position.y + 0.5; // Add 0.5 to avoid integer coordinates

        for (let distance = 0; distance < maxDistance; distance += 0.1) {
            rayX += rayDirX * 0.1;
            rayY += rayDirY * 0.1;

            const mapX = Math.floor(rayX);
            const mapY = Math.floor(rayY);

            if (
                mapX >= 0 && mapX < WIDTH &&
                mapY >= 0 && mapY < HEIGHT &&
                getValueAt(caveLayer, mapX, mapY) === MOUNTAIN
            ) {
                setValueAt(fogLayer, mapX, mapY, TRANSPARENT);
                break;
            }

            if (
                mapX >= 0 && mapX < WIDTH &&
                mapY >= 0 && mapY < HEIGHT
            ) {
                setValueAt(fogLayer, mapX, mapY, TRANSPARENT);
            }
        }
    }
}

export function main({ print, clear, dangerouslyPrintHTML, terminalEl }) {
    return new Promise((resolve, reject) => {
        print('Welcome to Koobas!')
        const caveLayer = createCaveLayer()
        const staticItemsLayer = createLayer()
        let fogLayer = createLayer(FOG)
        const player = createPlayer()

        setPosition(player, caveLayer.start)

        setValueAt(staticItemsLayer, caveLayer.start.x, caveLayer.start.y, START)
        setValueAt(staticItemsLayer, caveLayer.end.x, caveLayer.end.y, END)

        illuminate(fogLayer, caveLayer.layer, player.position)

        // Dynamic layers (player, monsters, items, etc.)
        const entityLayer = createLayer()
        setValueAt(entityLayer, player.position.x, player.position.y, PLAYER)

        clear()
        const rendered = renderLayers([caveLayer.layer, staticItemsLayer, entityLayer, fogLayer])
        dangerouslyPrintHTML(rendered)

        terminalEl.addEventListener('keydown', (e) => {
            if (e.key === 'c' && e.ctrlKey) {
                e.preventDefault()
                print('^C')
                resolve()
                return
            }

            console.log(e.key)

            // Arrow keys
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                move(caveLayer, player, { x: -1, y: 0 })
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                move(caveLayer, player, { x: 1, y: 0 })
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                move(caveLayer, player, { x: 0, y: -1 })
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                move(caveLayer, player, { x: 0, y: 1 })
            }

            clear()
            let fogLayer = createLayer(FOG)
            illuminate(fogLayer, caveLayer.layer, player.position)
            const entityLayer = createLayer()
            setValueAt(entityLayer, player.position.x, player.position.y, PLAYER)
            const rendered = renderLayers([caveLayer.layer, staticItemsLayer, entityLayer, fogLayer])
            dangerouslyPrintHTML(rendered)
        })
    })
}