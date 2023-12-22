import { getValueAt } from "/modules/games/koobas/layers.js"
import { CAVE, MOUNTAIN } from "/modules/games/koobas/enums.js"

export const createPlayer = function() {
    return {
        position: { x: 0, y: 0 },
        health: 10,
        maxHealth: 10,
        damage: 1,
        luck: 0.20,
        visibility: 8,
        inventory: {
            gold: 0,
            apples: 0,
        },
    }
}

export const createMonster = function() {
    return {
        ...createPlayer(),
        health: 3,
        maxHealth: 3,
        damage: 1,
        visibility: 7,
        inventory: {
            gold: 1 + Math.floor(Math.random() * 4),
            apples: Math.floor(Math.random() * 3),
        },
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

export const attemptAttack = function(targets, attacker, direction) {
    const newX = attacker.position.x + direction.x
    const newY = attacker.position.y + direction.y

    for (const target of targets) {
        if (target.position.x === newX && target.position.y === newY) {
            target.health -= attacker.damage

            if (target.health <= 0) {
                target.health = 0

                // Transfer inventory
                Object.entries(target.inventory).forEach(([key, amount]) => {
                    if (attacker.inventory[key] === undefined) {
                        attacker.inventory[key] = 0
                    }

                    attacker.inventory[key] += amount
                })
            }

            return true
        }
    }

    return false
}

export const canEntitySeeTarget = function(entity, target, caveLayer) {
    const distance = Math.sqrt(
        Math.pow(target.position.x - entity.position.x, 2) +
        Math.pow(target.position.y - entity.position.y, 2)
    )

    // Check if the target is within the visibility radius, first
    if (distance > entity.visibility) {
        return false
    }

    // Check if there are any walls between the entity and the target
    const deltaX = target.position.x - entity.position.x
    const deltaY = target.position.y - entity.position.y
    const angle = Math.atan2(deltaY, deltaX)

    for (let i = 0; i < distance; i += 0.1) {
        const x = Math.floor(entity.position.x + Math.cos(angle) * i)
        const y = Math.floor(entity.position.y + Math.sin(angle) * i)

        const value = getValueAt(caveLayer, x, y)

        if (value !== CAVE) {
            return false
        }
    }

    return true
}

export const getDirectionFromTowards = function(anyEntity, target) {
    const deltaX = target.position.x - anyEntity.position.x
    const deltaY = target.position.y - anyEntity.position.y
    const angle = Math.atan2(deltaY, deltaX)

    return {
        x: Math.round(Math.cos(angle)),
        y: Math.round(Math.sin(angle)),
    }
}

// Same as above, but can only move Up, Down, Left, or Right
export const getAdjacentDirectionFromTowards = function(anyEntity, target) {
    const deltaX = target.position.x - anyEntity.position.x
    const deltaY = target.position.y - anyEntity.position.y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return {
            x: Math.sign(deltaX),
            y: 0,
        }
    } else {
        return {
            x: 0,
            y: Math.sign(deltaY),
        }
    }
}