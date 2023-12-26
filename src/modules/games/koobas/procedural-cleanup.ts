import { CAVE, MOUNTAIN } from "/modules/games/koobas/enums"
import { isOutOfBounds, getValueAt, setValueAt, Layer } from "/modules/games/koobas/layers"

function visitAndMark(layer: Layer, x: number, y: number, { pathTile = CAVE, wallTile = MOUNTAIN } = {}) {
    if (isOutOfBounds(x, y)) {
        return
    }

    setValueAt(layer, x, y, 'VISITED')

    const top = getValueAt(layer, x, y - 1)
    const right = getValueAt(layer, x + 1, y)
    const bottom = getValueAt(layer, x, y + 1)
    const left = getValueAt(layer, x - 1, y)
    const topLeft = getValueAt(layer, x - 1, y - 1)
    const topRight = getValueAt(layer, x + 1, y - 1)
    const bottomRight = getValueAt(layer, x + 1, y + 1)
    const bottomLeft = getValueAt(layer, x - 1, y + 1)

    if (top === wallTile) {
        setValueAt(layer, x, y - 1, 'VISITED')
    }
    if (right === wallTile) {
        setValueAt(layer, x + 1, y, 'VISITED')
    }
    if (bottom === wallTile) {
        setValueAt(layer, x, y + 1, 'VISITED')
    }
    if (left === wallTile) {
        setValueAt(layer, x - 1, y, 'VISITED')
    }
    if (topLeft === wallTile) {
        setValueAt(layer, x - 1, y - 1, 'VISITED')
    }
    if (topRight === wallTile) {
        setValueAt(layer, x + 1, y - 1, 'VISITED')
    }
    if (bottomRight === wallTile) {
        setValueAt(layer, x + 1, y + 1, 'VISITED')
    }
    if (bottomLeft === wallTile) {
        setValueAt(layer, x - 1, y + 1, 'VISITED')
    }

    if (top === pathTile) {
        visitAndMark(layer, x, y - 1)
    }
    if (right === pathTile) {
        visitAndMark(layer, x + 1, y)
    }
    if (bottom === pathTile) {
        visitAndMark(layer, x, y + 1)
    }
    if (left === pathTile) {
        visitAndMark(layer, x - 1, y)
    }
}

export function replaceDeepWallsWithPathTiles(layer: Layer, x: number, y: number, { pathTile = CAVE, wallTile = MOUNTAIN } = {}) {
    const layerCopy = [...layer]; // Create a copy of the original array

    visitAndMark(layerCopy, x, y);

    // Replace disconnected 1s with 0s
    for (let i = 0; i < layerCopy.length; i++) {
        if (layerCopy[i] === wallTile) {
            layerCopy[i] = pathTile;
        }
    }

    // Replace 'VISITED's with the original array values
    for (let i = 0; i < layerCopy.length; i++) {
        if (layerCopy[i] === 'VISITED') {
            layerCopy[i] = layer[i];
        }
    }

    return layerCopy;
}