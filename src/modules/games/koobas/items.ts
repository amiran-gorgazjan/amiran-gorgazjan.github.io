export type Attack = {
    hp: number,
    radius: number,
    sound: string | null,
}

export type Use = {
    hp: number,
    sound?: string,
}

const ATK = (damage = 1, radius = 1, props: Partial<Attack> = {}) => {
    const onAttack = {
        hp: damage,
        radius: radius,
        sound: null,
        ...props,
    }

    return { onAttack }
}

export type Item = {
    glyph: string,
    name: string,
    description: string,
    onAttack?: Attack,
    onUse?: Use,
}

const ITEM = (glyph: string, name: string, description: string, props: Partial<Item> = {}) : Item => ({
    ...props,
    glyph: glyph,
    name: name,
    description: description,
})

export const items = {
    'apple': ITEM('🍎', 'Apple', 'A delicious apple', {
        onUse: { hp: 1, sound: 'apple-bite-1' },
        ...ATK(1),
    }),
    'health-potion': ITEM('🧪', 'Health potion', 'A potion that heals you', {
        onUse: { hp: 5, sound: 'apple-bite-1' },
    }),
    'gold-coin': ITEM('💰', 'Gold coin', 'A shiny gold coin', { ...ATK(0.5) }),
    'wooden-sword': ITEM('🗡', 'Wooden sword', 'A dull wooden sword that does not look very dangerous', { ...ATK(3) }),
    'bomb': ITEM('💣', 'Bomb', 'A dangerous bomb', { ...ATK(10, 3) }),
}

export type ItemName = keyof typeof items
export function isItemName(name: string): name is ItemName {
    return name in items
}