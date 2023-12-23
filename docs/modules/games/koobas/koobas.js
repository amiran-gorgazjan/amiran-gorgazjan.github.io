import { illuminate, renderLayers, graphics } from '/modules/games/koobas/graphics.js'
import { attemptAttack, attemptMove, setPosition, createPlayer, canEntitySeeTarget, getAdjacentDirectionFromTowards } from '/modules/games/koobas/entities.js'
import { createLayer, setValueAt } from '/modules/games/koobas/layers.js'
import { createCaveLayer, createMonsters } from '/modules/games/koobas/procedural.js'
import { replaceDeepWallsWithPathTiles } from '/modules/games/koobas/procedural-cleanup.js'
import { END, START, PLAYER, APPLE, MONSTER, GOLD, SHOP, FOG, TRANSPARENT } from '/modules/games/koobas/enums.js'
import { caveToWalls } from '/modules/games/koobas/graphics-cave-to-walls.js'
import { loadAllSounds, playAudio } from './audio-player/audio-player.js'

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

function start({ print, dangerouslyPrintHTML, terminalEl, shake, resolve, reject }) {
    const player = createPlayer()
    const caveLayerResult = createCaveLayer()
    const staticItemsLayer = createLayer()
    let monsters = createMonsters(caveLayerResult)

    setPosition(player, caveLayerResult.start)

    setValueAt(staticItemsLayer, caveLayerResult.start.x, caveLayerResult.start.y, START)
    setValueAt(staticItemsLayer, caveLayerResult.end.x, caveLayerResult.end.y, END)

    const wallLayer = caveToWalls(
        replaceDeepWallsWithPathTiles(caveLayerResult.layer, caveLayerResult.start.x, caveLayerResult.start.y)
    )
    const fogLayer = createLayer(FOG)
    
    function render() {
        illuminate(fogLayer, caveLayerResult.layer, player.position, player.visibility)
        
        const entityLayer = createLayer()
        setValueAt(entityLayer, player.position.x, player.position.y, PLAYER)

        for (const monster of monsters) {
            setValueAt(entityLayer, monster.position.x, monster.position.y, monster.style ?? MONSTER)
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

    function handleKeyDownEvent(e) {
        if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault()
            print('^C')
            return exit()
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

        if (e.key === 'a') {
            // Eat apple
            if (player.inventory.apples > 0) {
                player.health = Math.min(player.health + 3, player.maxHealth)
                player.inventory.apples -= 1
                playAudio('apple-bite-1')
            }
        }

        if (direction) {
            e.preventDefault()
            const attackedMonster = attemptAttack(monsters, player, direction)

            if (!attackedMonster) {
                attemptMove(caveLayerResult, player, direction)
                playAudio('step')
            } else {
                playAudio('punch1')
                shake()
            }

            // Remove dead monsters
            monsters = monsters.filter(monster => monster.health > 0)

            // Monster actions
            for (const monster of monsters) {
                if (canEntitySeeTarget(monster, player, caveLayerResult.layer)) {
                    monster.style = { glyph: graphics[MONSTER].glyph, color: '#ff0000' }
                    const direction = getAdjacentDirectionFromTowards(monster, player)
                    const monsterAttackedPlayer = attemptAttack([player], monster, direction)

                    if (!monsterAttackedPlayer) {
                        attemptMove(caveLayerResult, monster, direction)
                    }
                } else {
                    monster.style = { glyph: graphics[MONSTER].glyph, color: '#aa0000' }
                }
            }

            // Player ded?
            if (player.health <= 0) {
                print('You died')
                playAudio('player-death')
                cleanup()
                start({ print, dangerouslyPrintHTML, terminalEl, shake, resolve, reject })
                return
            }
        }

        render()
    }

    function cleanup() {
        terminalEl.removeEventListener('keydown', handleKeyDownEvent)
    }

    function exit() {
        cleanup()
        resolve()
    }

    terminalEl.addEventListener('keydown', handleKeyDownEvent)

    // Initial render
    render()
}

export function main({ print, dangerouslyPrintHTML, terminalEl, shake }) {
    return new Promise(async (resolve, reject) => {
        await loadAllSounds()
        start({ print, dangerouslyPrintHTML, terminalEl, shake, resolve, reject })
    })
}