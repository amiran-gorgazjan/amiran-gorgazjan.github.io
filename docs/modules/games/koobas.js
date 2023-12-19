const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function main({ print }) {
    print('Welcome to Koobas!')
    print('Type "help" to list all available commands')
}