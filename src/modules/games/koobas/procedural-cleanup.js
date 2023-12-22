import { CAVE, MOUNTAIN } from "/modules/games/koobas/enums.js"
import { isOutOfBounds, getValueAt, setValueAt } from "/modules/games/koobas/layers.js"

function visitAndMark(matrix, x, y, { pathTile = CAVE, wallTile = MOUNTAIN } = {}) {
    if (isOutOfBounds(x, y)) {
        return
    }

    setValueAt(matrix, x, y, 'VISITED')

    const top = getValueAt(matrix, x, y - 1)
    const right = getValueAt(matrix, x + 1, y)
    const bottom = getValueAt(matrix, x, y + 1)
    const left = getValueAt(matrix, x - 1, y)
    const topLeft = getValueAt(matrix, x - 1, y - 1)
    const topRight = getValueAt(matrix, x + 1, y - 1)
    const bottomRight = getValueAt(matrix, x + 1, y + 1)
    const bottomLeft = getValueAt(matrix, x - 1, y + 1)

    if (top === wallTile) {
        setValueAt(matrix, x, y - 1, 'VISITED')
    }
    if (right === wallTile) {
        setValueAt(matrix, x + 1, y, 'VISITED')
    }
    if (bottom === wallTile) {
        setValueAt(matrix, x, y + 1, 'VISITED')
    }
    if (left === wallTile) {
        setValueAt(matrix, x - 1, y, 'VISITED')
    }
    if (topLeft === wallTile) {
        setValueAt(matrix, x - 1, y - 1, 'VISITED')
    }
    if (topRight === wallTile) {
        setValueAt(matrix, x + 1, y - 1, 'VISITED')
    }
    if (bottomRight === wallTile) {
        setValueAt(matrix, x + 1, y + 1, 'VISITED')
    }
    if (bottomLeft === wallTile) {
        setValueAt(matrix, x - 1, y + 1, 'VISITED')
    }

    if (top === pathTile) {
        visitAndMark(matrix, x, y - 1)
    }
    if (right === pathTile) {
        visitAndMark(matrix, x + 1, y)
    }
    if (bottom === pathTile) {
        visitAndMark(matrix, x, y + 1)
    }
    if (left === pathTile) {
        visitAndMark(matrix, x - 1, y)
    }
}

export function replaceDeepWallsWithPathTiles(arr, x, y, { pathTile = CAVE, wallTile = MOUNTAIN } = {}) {
    const copiedArr = [...arr]; // Create a copy of the original array

    visitAndMark(copiedArr, x, y);

    // Replace disconnected 1s with 0s
    for (let i = 0; i < copiedArr.length; i++) {
        if (copiedArr[i] === wallTile) {
            copiedArr[i] = pathTile;
        }
    }

    // Replace 'VISITED's with the original array values
    for (let i = 0; i < copiedArr.length; i++) {
        if (copiedArr[i] === 'VISITED') {
            copiedArr[i] = arr[i];
        }
    }

    return copiedArr;
}