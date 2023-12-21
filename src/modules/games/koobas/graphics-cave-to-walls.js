import { CAVE, MOUNTAIN, TRANSPARENT, WIDTH, HEIGHT } from "/modules/games/koobas/enums.js"
import { getValueAt, setValueAt, createLayer } from "/modules/games/koobas/layers.js"

const defaultWallSymbol = '▫'
const M = MOUNTAIN
const C = CAVE

// Only containts the ones that should overwrite the basic 1 and 0
// The center is always 1
const symbolToCave = {
    '╔': [  C,
          C,  M,
            M],
    '╗': [  C,
          M,  C,
            M],
    '╚': [  M,
          C,  M,
            C],
    '╝': [  M,
          M,  C,
            C],
    '╦': [  C,
          M,  M,
            M],
    '╩': [  M,
          M,  M,
            C],
    '╠': [  M,
          C,  M,
            M],
    '╣': [  M,
          M,  C,
            M],
    '╬': [  M,
          M,  M,
            M],
    '═': [  C,
          M,  M,
            C],
    '║': [  M,
          C,  C,
            M],
    '╨': [  M,
          C,  C,
            C],
    '╥': [  C,
          C,  C,
            M],
    '╞': [  C,
          C,  M,
            C],
    '╡': [  C,
          M,  C,
            C],
}

const caveToSymbol = Object.fromEntries(
    Object.entries(symbolToCave)
        .map(([symbol, pattern]) => [pattern.join(''), symbol])
)

export function caveToWalls(caveLayer) {
    const wallLayer = createLayer(TRANSPARENT)

    // Loop over the cave layer and check if the symbol should be replaced
    // If it should, replace it with the correct symbol
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const symbolMiddle = getValueAt(caveLayer, x, y)
            
            if (symbolMiddle !== MOUNTAIN) {
                continue
            }

            const top = getValueAt(caveLayer, x, y - 1)
            const bottom = getValueAt(caveLayer, x, y + 1)
            const left = getValueAt(caveLayer, x - 1, y)
            const right = getValueAt(caveLayer, x + 1, y)

            const key = [top, left, right, bottom].join('')

            const symbol = caveToSymbol[key]

            if (symbol) {
                setValueAt(wallLayer, x, y, `<span style="color: white">${symbol}</span>`)
            } else {
                setValueAt(wallLayer, x, y, `<span style="color: white">${defaultWallSymbol}</span>`)
            }
        }
    }

    return wallLayer
}