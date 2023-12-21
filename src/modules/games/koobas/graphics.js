import {
    WIDTH, HEIGHT, MOUNTAIN, TRANSPARENT, CAVE, START,
    END, PLAYER, APPLE, MONSTER, GOLD, FOG, SHOP
} from '/modules/games/koobas/enums.js';
import { getValueAt, setValueAt, mergeLayers } from '/modules/games/koobas/layers.js';

export const graphics = {
    [TRANSPARENT]: ' ',
    [CAVE]: '<span style="color: #455A64">░</span>',
    [MOUNTAIN]: '█',
    [START]: '↓',
    [END]: '↑',
    [PLAYER]: '<span style="color: green;">☺</span>',
    [APPLE]: '○',
    [MONSTER]: '<span style="color: red;">Ψ</span>',
    [GOLD]: '$',
    [FOG]: ' ',
    [SHOP]: 'S',
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

export function renderLayers(layers = []) {
    const merged = mergeLayers(layers)

    let lines = []

    for (let y = 0; y < HEIGHT; y++) {
        let line = ''

        for (let x = 0; x < WIDTH; x++) {
            const value = getValueAt(merged, x, y)

            if (typeof value === 'string') {
                line += value
            } else {
                line += graphics[value]
            }
        }

        lines.push(line)
    }

    return lines.join('\n')
}

