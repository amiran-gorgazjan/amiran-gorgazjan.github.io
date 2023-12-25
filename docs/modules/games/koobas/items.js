const ATK = (damage = 1, radius = 1, props) => ({
    onAttack: {
        ...props,
        hp: -damage,
        radius: radius,
    }
})

const ITEM = (glyph, name, description, props) => ({
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