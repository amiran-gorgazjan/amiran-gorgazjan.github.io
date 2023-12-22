import { WIDTH, HEIGHT, TRANSPARENT } from '/modules/games/koobas/enums.js'

export function createLayer(fillValue = TRANSPARENT) {
    return Array.from({ length: HEIGHT * WIDTH }, () => fillValue)
}

export function isOutOfBounds(x, y) {
    return x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT
}

export function getValueAt(level, x, y) {
    if (isOutOfBounds(x, y)) {
        return undefined
    }

    return level[y * WIDTH + x]
}

export function setValueAt(level, x, y, value) {
    if (isOutOfBounds(x, y)) {
        return
    }

    level[y * WIDTH + x] = value
}

export function mergeLayers(layers = []) {
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
