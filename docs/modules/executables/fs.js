import { cwd } from "/modules/state.js";

//Face unix file system structure with files and folders for a game
const rootFolder = {
    type: 'folder',
    files: {
        'home': {
            type: 'folder',
            files: {
                'user': {
                    type: 'folder',
                    files: {
                        'notes.txt': {
                            type: 'file',
                            content: 'Hello world'
                        }
                    }
                }
            }
        },
        'bin': {
            type: 'folder',
            files: {
                'ls': {
                    type: 'executable',
                    content: 'ls'
                }
            }
        },
        'etc': {
            type: 'folder',
            files: {},
        },
        'srv': {
            type: 'folder',
            files: {
                'public': {
                    type: 'folder',
                    files: {
                        'index.html': {
                            type: 'file',
                            content: '<h1>Hello world</h1>'
                        }
                    }
                }
            },
        }
    }
}

function normalizePath(path) {
    // Replace '~' with '/home/user'
    if (path.startsWith('~')) {
        path = '/home/user' + path.substring(1);
    }

    // Split the path into segments
    const segments = path.split('/');
    const stack = [];

    for (const segment of segments) {
        if (segment === '..') {
            // Pop the last segment if possible
            if (stack.length > 0) {
                stack.pop();
            }
        } else if (segment !== '.' && segment !== '') {
            // Push the segment if it's not '.' or empty
            stack.push(segment);
        }
    }

    // Special case for leading slash
    const leadingSlash = path.startsWith('/') ? '/' : '';
    return leadingSlash + stack.join('/');
}

function getByPath(inputPath) {
    const path = normalizePath(inputPath)
    console.log(path)
    const folders = path.split('/').slice(1)
    let current = rootFolder

    for (const folder of folders) {
        console.log(folder)
        if (!current.files[folder]) {
            return null
        }

        current = current.files[folder]
    }

    return current
}

function cd(inputPath) {
    const path = inputPath.startsWith('/') ? inputPath : cwd.value + '/' + inputPath
    const normalizedPath = normalizePath(path)
    const target = getByPath(normalizedPath)

    if (!target) {
        console.log('Path not found')
        return
    }

    if (target.type !== 'folder') {
        console.log('Path is not a folder')
        return
    }

    cwd.value = normalizedPath
}

export default {
    cwd: {
        description: 'Print the current working directory',
        exec: ({ print }) => {
            console.log(cwd.value)
            print(cwd.value)
        }
    },
    ls: {
        description: 'List files and directories',
        exec: ({ print }) => {
            const current = getByPath(cwd.value)

            if (!current) {
                print('Path not found')
                return
            }

            if (current.type !== 'folder') {
                print('Path is not a folder')
                return
            }

            print('.\n..')

            Object.keys(current.files).forEach(name => {
                if (current.files[name].type === 'folder') {
                    print(name + '/')
                } else {
                    print(name)
                }
            })
        }
    },
    cd: {
        description: 'Change directory',
        exec: ({ print, params }) => {
            const path = params[0]

            if (!path) {
                print('Path argument required')
                return
            }

            cd(path)
        }
    },
    cat: {
        description: 'Print file contents',
        exec: ({ print }) => {
            print('Hello from cat')
        }
    },
}