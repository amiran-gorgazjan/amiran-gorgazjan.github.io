import {
    WIDTH, HEIGHT, MOUNTAIN, TRANSPARENT, CAVE, START,
    END, PLAYER, APPLE, MONSTER, GOLD, FOG, SHOP
} from '/modules/games/koobas/enums.js';
import { getValueAt, setValueAt, mergeLayers } from '/modules/games/koobas/layers.js';

export const graphics = {
    [TRANSPARENT]: { glyph: ' ', color: 'transparent' },
    [CAVE]: { glyph: '░', color: '#333' },
    [MOUNTAIN]: { glyph: '█', color: '#ccc' },
    [START]: { glyph: '↓', color: '#777' },
    [END]: { glyph: '↑', color: '#ff0' },
    [PLAYER]: { glyph: '☺', color: '#ff0' },
    [APPLE]: { glyph: 'ტ', color: '#f00' },
    [MONSTER]: { glyph: 'Ψ', color: '#f00' },
    [GOLD]: { glyph: '$', color: '#ff0' },
    [FOG]: { glyph: ' ', color: '#222' },
    [SHOP]: { glyph: 'S', color: '#0ff' },

    '▫': { glyph: '█', color: '#ccc' },
    '╔': { glyph: '╔', color: '#ccc' },
    '╗': { glyph: '╗', color: '#ccc' },
    '╚': { glyph: '╚', color: '#ccc' },
    '╝': { glyph: '╝', color: '#ccc' },
    '╦': { glyph: '╦', color: '#ccc' },
    '╩': { glyph: '╩', color: '#ccc' },
    '╠': { glyph: '╠', color: '#ccc' },
    '╣': { glyph: '╣', color: '#ccc' },
    '╬': { glyph: '╬', color: '#ccc' },
    '═': { glyph: '═', color: '#ccc' },
    '║': { glyph: '║', color: '#ccc' },
    '╨': { glyph: '╨', color: '#ccc' },
    '╥': { glyph: '╥', color: '#ccc' },
    '╞': { glyph: '╞', color: '#ccc' },
    '╡': { glyph: '╡', color: '#ccc' },
}

export function illuminate(fogLayer, caveLayer, position, visibility = 5) {
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

export function renderLayersAsLines(layers = []) {
    const merged = mergeLayers(layers)

    let lines = []

    for (let y = 0; y < HEIGHT; y++) {
        let line = ''

        let previousColor = null

        for (let x = 0; x < WIDTH; x++) {
            const value = getValueAt(merged, x, y)
            let graphic;

            if (typeof value === 'object' && value !== null) {
                graphic = value
            } else {
                graphic = graphics[value]
            }

            if (!graphic) {
                throw new Error(`Unknown graphic: ${value}`)
            }

            if (graphic.color !== previousColor) {
                if (previousColor !== null) {
                    line += '</span>'
                }

                line += `<span style="color: ${graphic.color}">`
            }

            previousColor = graphic.color
            line += graphic.glyph
        }

        if (previousColor !== null) {
            line += '</span>'
        }

        lines.push(line)
    }

    return lines
}

