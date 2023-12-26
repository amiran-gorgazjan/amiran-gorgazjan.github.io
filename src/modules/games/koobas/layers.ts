import { WIDTH, HEIGHT, TRANSPARENT } from '/modules/games/koobas/enums'

export type LayerValue = string | number | { glyph: string, color: string }
export type Layer = LayerValue[]

export function createLayer(fillValue = TRANSPARENT) : Layer {
    return Array.from({ length: HEIGHT * WIDTH }, () => fillValue)
}

export function isOutOfBounds(x: number, y: number) {
    return x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT
}

export function getValueAt(layer: Layer, x: number, y: number): LayerValue | undefined {
    if (isOutOfBounds(x, y)) {
        return undefined
    }

    return layer[y * WIDTH + x]
}

export function setValueAt(layer: Layer, x: number, y: number, value: LayerValue) {
    if (isOutOfBounds(x, y)) {
        return
    }

    layer[y * WIDTH + x] = value
}

export function mergeLayers(layers: Layer[] = []) {
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
