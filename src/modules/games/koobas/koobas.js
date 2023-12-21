import { illuminate, renderLayers, graphics } from '/modules/games/koobas/graphics.js'
import { attemptAttack, attemptMove, setPosition, createPlayer } from '/modules/games/koobas/entities.js'
import { createLayer, setValueAt } from '/modules/games/koobas/layers.js'
import { createCaveLayer, createMonsters } from '/modules/games/koobas/procedural.js'
import { END, START, PLAYER, APPLE, MONSTER, GOLD, SHOP, FOG, TRANSPARENT } from '/modules/games/koobas/enums.js'
import { caveToWalls } from '/modules/games/koobas/graphics-cave-to-walls.js'

function getPlayerStats(player) {
    return [
        `Health ${player.health}`,
        `Apples ${player.inventory.apples}`,
        `Gold ${player.inventory.gold}`,
    ].join('  ')
}

const legend = Object.entries({
    [END]: 'Exit',
    [START]: 'Entrance',
    [PLAYER]: 'You',
    [APPLE]: 'Apple',
    [MONSTER]: 'Monster',
    [GOLD]: 'Gold',
    [SHOP]: 'Shop',
}).map(([value, label]) => `${graphics[value].glyph} ${label}`).join('  ')

export function main({ print, clear, dangerouslyPrintHTML, terminalEl }) {
    return new Promise((resolve, reject) => {
        const caveLayerResult = createCaveLayer()
        const staticItemsLayer = createLayer()
        const player = createPlayer()
        const monsters = createMonsters(caveLayerResult)

        setPosition(player, caveLayerResult.start)

        setValueAt(staticItemsLayer, caveLayerResult.start.x, caveLayerResult.start.y, START)
        setValueAt(staticItemsLayer, caveLayerResult.end.x, caveLayerResult.end.y, END)

        const wallLayer = caveToWalls(caveLayerResult.layer)
        const fogLayer = createLayer(FOG)
        
        function update() {
            illuminate(fogLayer, caveLayerResult.layer, player.position, player.visibility)
            
            const entityLayer = createLayer()
            setValueAt(entityLayer, player.position.x, player.position.y, PLAYER)

            for (const monster of monsters) {
                setValueAt(entityLayer, monster.position.x, monster.position.y, MONSTER)
            }

            const rendered = renderLayers([
                caveLayerResult.layer,
                wallLayer,
                staticItemsLayer,
                entityLayer,
                fogLayer
            ])

            dangerouslyPrintHTML(
                getPlayerStats(player) + '\n' + rendered + '\n' + legend,
                { replace: true, deferredScroll: true }
            )
        }

        update()

        function handleKeyDownEvent(e) {
            if (e.key === 'c' && e.ctrlKey) {
                e.preventDefault()
                print('^C')
                terminalEl.removeEventListener('keydown', handleKeyDownEvent)
                resolve()
                return
            }

            // Arrow keys
            let direction = null

            if (e.key === 'ArrowLeft') {
                direction = { x: -1, y: 0 }
            } else if (e.key === 'ArrowRight') {
                direction = { x: 1, y: 0 }
            } else if (e.key === 'ArrowUp') {
                direction = { x: 0, y: -1 }
            } else if (e.key === 'ArrowDown') {
                direction = { x: 0, y: 1 }
            }

            if (direction) {
                e.preventDefault()
                const attackedMonster = attemptAttack(monsters, player, direction)

                if (!attackedMonster) {
                    attemptMove(caveLayerResult, player, direction)
                }
            }

            update()
        }

        terminalEl.addEventListener('keydown', handleKeyDownEvent)
    })
}