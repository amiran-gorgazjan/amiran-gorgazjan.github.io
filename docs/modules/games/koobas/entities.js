import { getValueAt } from "/modules/games/koobas/layers.js"
import { CAVE } from "/modules/games/koobas/enums.js"

export const createPlayer = function() {
    return {
        position: { x: 0, y: 0 },
        health: 10,
        maxHealth: 10,
        damage: 3,
        luck: 0.20,
        visibility: 8,
        inventory: {
            gold: 0,
            apples: 5,
        },
    }
}

export const createMonster = function() {
    return {
        position: { x: 0, y: 0 },
        health: 10,
        damage: 1,
    }
}

export const setPosition = function(entity, position) {
    entity.position.x = position.x
    entity.position.y = position.y
}

export const attemptMove = function(caveLayer, anyEntity, direction) {
    const newX = anyEntity.position.x + direction.x
    const newY = anyEntity.position.y + direction.y

    const value = getValueAt(caveLayer.layer, newX, newY)

    if (value !== CAVE) {
        return false
    }

    setPosition(anyEntity, { x: newX, y: newY })

    return true
}

export const attemptAttack = function(monsters, player, direction) {
    const newX = player.position.x + direction.x
    const newY = player.position.y + direction.y

    const monster = monsters.find(monster => monster.position.x === newX && monster.position.y === newY)

    if (!monster) {
        return false
    }

    monster.health -= player.damage

    if (monster.health <= 0) {
        monsters.splice(monsters.indexOf(monster), 1)
        player.inventory.gold += Math.ceil(Math.random() * 20 * player.luck * monster.damage)
        player.inventory.apples += Math.random() < player.luck ? 1 : 0
    }

    return true
}