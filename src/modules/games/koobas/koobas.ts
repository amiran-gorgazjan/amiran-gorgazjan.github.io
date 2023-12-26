import { illuminate, renderLayersAsLines, graphics, getGraphic, GraphicName, STYLE } from '/modules/games/koobas/graphics'
import { attemptAttack, attemptMove, setPosition, createPlayer, canEntitySeeTarget, getAdjacentDirectionFromTowards, Player, Entity } from '/modules/games/koobas/entities'
import { createLayer, setValueAt } from '/modules/games/koobas/layers'
import { createCaveLayer, createMonsters } from '/modules/games/koobas/procedural'
import { replaceDeepWallsWithPathTiles } from '/modules/games/koobas/procedural-cleanup'
import { END, START, PLAYER, APPLE, MONSTER, GOLD, SHOP, FOG } from '/modules/games/koobas/enums'
import { caveToWalls } from '/modules/games/koobas/graphics-cave-to-walls'
import { loadAllSounds, playAudio } from './audio-player/audio-player'
import { ExecParams } from '/modules/terminal'

function getPlayerStats(player: Player) {
    return [
        `Health ${player.health}`,
        `Apples ${player.inventory.apple}`,
        `Gold ${player.inventory['gold-coin']}`,
    ].join('  ')
}

const legendMap: Partial<Record<GraphicName, string>> = {
    [END]: 'Exit',
    [START]: 'Entrance',
    [PLAYER]: 'You',
    [APPLE]: 'Apple',
    [MONSTER]: 'Monster',
    [GOLD]: 'Gold',
    [SHOP]: 'Shop',
}

const legend = Object.entries(legendMap).map(([value, label]) => `${getGraphic(value).glyph} ${label}`).join('  ')

let player: Player = createPlayer()
let currentLevel = 0

type AsyncExecParams = ExecParams & {
    resolve: (value?: unknown) => void,
    reject: () => void,
}

function startNewLevel(asyncExecParams: AsyncExecParams) {
    const { print, optimisedDangerousLinePrint, terminalEl, shake, resolve, reject } = asyncExecParams

    const caveLayerResult = createCaveLayer()
    const staticItemsLayer = createLayer()
    let monsters = createMonsters(caveLayerResult, currentLevel)

    setPosition(player, caveLayerResult.start)

    setValueAt(staticItemsLayer, caveLayerResult.start.x, caveLayerResult.start.y, START)
    setValueAt(staticItemsLayer, caveLayerResult.end.x, caveLayerResult.end.y, END)

    const wallLayer = caveToWalls(
        replaceDeepWallsWithPathTiles(caveLayerResult.layer, caveLayerResult.start.x, caveLayerResult.start.y)
    )
    const fogLayer = createLayer(FOG)
    
    function render() {
        if (player === null) {
            throw new Error('Player is null')
        } 

        illuminate(fogLayer, caveLayerResult.layer, player.position, player.visibility)

        const visibilityLayer = createLayer(FOG)
        illuminate(visibilityLayer, caveLayerResult.layer, player.position, player.visibility)

        const entityLayer = createLayer()
        setValueAt(entityLayer, player.position.x, player.position.y, PLAYER)

        for (const monster of monsters) {
            setValueAt(entityLayer, monster.position.x, monster.position.y, monster.style ?? MONSTER)
        }

        const rendered = renderLayersAsLines([
            caveLayerResult.layer,
            wallLayer,
            staticItemsLayer,
            entityLayer,
            fogLayer
        ], visibilityLayer)

        optimisedDangerousLinePrint([
            getPlayerStats(player),
            ...rendered,
            legend,
        ])
    }

    function handlePlayerDeath() {
        player = createPlayer()
        currentLevel = 0
        playAudio('player-death')
        cleanup()
        startNewLevel(asyncExecParams)
    }

    function ascend() {
        currentLevel += 1
        playAudio('ascend')
        cleanup()
        startNewLevel(asyncExecParams)
    }

    function eatApple(entity: Entity) {
        entity.health = Math.min(entity.health + 3, entity.maxHealth)
        entity.inventory.apple -= 1
        playAudio('apple-bite-1')
    }

    function handleKeyDownEvent(e: KeyboardEvent) {
        if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault()
            print('^C')
            return exit()
        }

        // Arrow keys
        let actionTaken = false
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
            e.preventDefault()

            // Eat apple
            if (player.inventory.apple > 0) {
                actionTaken = true
                eatApple(player)
            }
        }

        if (direction) {
            e.preventDefault()
            actionTaken = true

            const attackedMonster = attemptAttack(monsters, player, direction)

            if (!attackedMonster) {
                attemptMove(caveLayerResult.layer, player, direction)
                playAudio('step')
            } else {
                playAudio('punch1')
                shake()
            }

            if (player.position.x === caveLayerResult.end.x && player.position.y === caveLayerResult.end.y) {
                ascend()
                return
            }

            // Remove dead monsters
            monsters = monsters.filter(monster => monster.health > 0)
        }

        // Monster actions
        if (actionTaken) {
            for (const monster of monsters) {
                if (canEntitySeeTarget(monster, player, caveLayerResult.layer)) {
                    monster.style = STYLE(graphics[MONSTER].glyph, '#ff0000')
                    const direction = getAdjacentDirectionFromTowards(monster, player)
                    const monsterAttackedPlayer = attemptAttack([player], monster, direction)

                    if (!monsterAttackedPlayer) {
                        attemptMove(caveLayerResult.layer, monster, direction)
                    }
                } else {
                    monster.style = STYLE(graphics[MONSTER].glyph, '#aa0000')
                }
            }

            // Player ded?
            if (player.health <= 0) {
                handlePlayerDeath()
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

export function main(execParams: ExecParams) {
    return new Promise(async (resolve, reject) => {
        const { print, clear } = execParams
        print('Loading...')
        clear()
        await loadAllSounds()

        player = createPlayer()
        currentLevel = 0

        startNewLevel({ ...execParams, resolve, reject })
    })
}