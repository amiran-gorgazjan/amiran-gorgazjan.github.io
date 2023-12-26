import {
    WIDTH, HEIGHT, MOUNTAIN, TRANSPARENT, CAVE, START,
    END, PLAYER, APPLE, MONSTER, GOLD, FOG, SHOP
} from '/modules/games/koobas/enums';
import { getValueAt, setValueAt, mergeLayers, Layer } from '/modules/games/koobas/layers';
import { Position } from '/modules/games/koobas/entities';

export type Style = {
    '@type': 'style',
    glyph: string,
    color: string,
    opacity?: number,
}

function isStyle(value: unknown): value is Style {
    return (
        typeof value === 'object' && value !== null &&
        '@type' in value && value['@type'] === 'style'
    )
}

export function STYLE(glyph: string, color: string, opacity = 1): Style {
    return { '@type': 'style', glyph, color, opacity }
}

export const graphics = {
    'UNKNOWN': STYLE('�', '#fff'),
    [TRANSPARENT]: STYLE(' ', 'transparent'),
    [CAVE]: STYLE('░', '#333'),
    [MOUNTAIN]: STYLE('█', '#ccc'),
    [START]: STYLE('↓', '#777'),
    [END]: STYLE('↑', '#ff0'),
    [PLAYER]: STYLE('☺', '#ff0'),
    [APPLE]: STYLE('ტ', '#f00'),
    [MONSTER]: STYLE('Ψ', '#f00'),
    [GOLD]: STYLE('$', '#ff0'),
    [FOG]: STYLE(' ', '#222'),
    [SHOP]: STYLE('S', '#0ff'),
    '▫': STYLE('█', '#ccc'),
    '╔': STYLE('╔', '#ccc'),
    '╗': STYLE('╗', '#ccc'),
    '╚': STYLE('╚', '#ccc'),
    '╝': STYLE('╝', '#ccc'),
    '╦': STYLE('╦', '#ccc'),
    '╩': STYLE('╩', '#ccc'),
    '╠': STYLE('╠', '#ccc'),
    '╣': STYLE('╣', '#ccc'),
    '╬': STYLE('╬', '#ccc'),
    '═': STYLE('═', '#ccc'),
    '║': STYLE('║', '#ccc'),
    '╨': STYLE('╨', '#ccc'),
    '╥': STYLE('╥', '#ccc'),
    '╞': STYLE('╞', '#ccc'),
    '╡': STYLE('╡', '#ccc'),
} satisfies Record<any, Style>

export type GraphicName = keyof typeof graphics

export function isGraphicName(name: unknown): name is GraphicName {
    if (typeof name !== 'string' && typeof name !== 'number') {
        return false
    }

    return name in graphics
}

export function getGraphic(value?: unknown): Style {
    if (isStyle(value)) {
        return value
    }

    if (!isGraphicName(value)) {
        return getGraphic('UNKNOWN')
    }

    return graphics[value]
}

export function illuminate(fogLayer: Layer, caveLayer: Layer, position: Position, visibility = 5) {
    for (let angle = 0; angle < 360; angle += 1) {
        const rayDirX = Math.cos(angle * Math.PI / 180);
        const rayDirY = Math.sin(angle * Math.PI / 180);

        let rayX = position.x + 0.5; // Add 0.5 to avoid integer coordinates
        let rayY = position.y + 0.5; // Add 0.5 to avoid integer coordinates

        for (let distance = 0; distance < visibility; distance += 0.1) {
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

export function renderLayersAsLines(layers: Layer[] = [], visibilityLayer: Layer | null = null) {
    const mergedLayers = mergeLayers(layers)

    let lines = []

    for (let y = 0; y < HEIGHT; y++) {
        let line = ''

        let previousColor = null
        let previousOpacity = null

        for (let x = 0; x < WIDTH; x++) {
            const value = getValueAt(mergedLayers, x, y)

            if (value === undefined) {
                throw new Error(`Value at ${x}, ${y} is undefined`)
            }

            let styleOnLayer : Style = getGraphic(value);

            const visibility = visibilityLayer ? getValueAt(visibilityLayer, x, y) : TRANSPARENT
            const style = {
                opacity: visibility === FOG ? 0.2 : 1,
                ...styleOnLayer,
            }

            if (!style) {
                throw new Error(`Unknown graphic: ${value}`)
            }

            if (style.color !== previousColor || style.opacity !== previousOpacity) {
                if (previousColor !== null) {
                    line += '</span>'
                }

                line += `<span style="color: ${style.color}; opacity: ${style.opacity}">`
            }

            previousColor = style.color
            previousOpacity = style.opacity
            line += style.glyph
        }

        if (previousColor !== null) {
            line += '</span>'
        }

        lines.push(line)
    }

    return lines
}

