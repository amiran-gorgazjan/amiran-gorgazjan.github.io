const koobas = {
    description: 'A dungeon crawler game',
    exec: async (...args) => {
        const koobas = await import('../games/koobas/koobas.js')
        return await koobas.main(...args)
    }
}

export default { koobas }