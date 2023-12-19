import { $cwd, $currentMachine } from "/modules/state.js";

function folder(files) {
    return {
        type: 'folder',
        files: files,
    }
}

function file(content) {
    return {
        type: 'file',
        content: content,
    }
}

function executable(fn) {
    return {
        type: 'executable',
        fn: fn,
    }
}

function executables(names) {
    const files = {}

    for (const name of names) {
        files[name] = executable(() => {
            return { error: 'Access denied' }
        })
    }

    return folder(files)
}

const templateFiles = {
    'bin': executables([
        'cat', 'chmod', 'cd', 'cp', 'date', 'echo', 'ftp',
        'grep', 'head', 'ls', 'lpr', 'more', 'mkdir', 'mv',
        'ncftp', 'print', 'pwd', 'rm', 'rmdir', 'rsh',
        'setenv', 'sort', 'tail', 'tar', 'telnet', 'wc',
    ].toSorted()),
    'etc': folder({
        'hosts': file(''),
    }),
    'tmp': folder({}),
    'var': folder({}),
    'usr': folder({
        'local': folder({
            'bin': executables([
                'git', 'node', 'npm', 'yarn',
                'email', 'calendar', 'calculator', 'clock',
                'weather', 'news', 'music', 'video', 'image',
            ].toSorted()),
        }),
        'bin': executables([
            'vim', 'nano', 'emacs', 'code', 'subl',
        ]),
    }),
}

const amiranMachine = folder({
    ...templateFiles,
    'home': folder({
        'amiran': folder({
            'notes.txt': file('Hello world'),
        }),
    }),
    'srv': folder({
        'public': folder({
            'index.html': file('<h1>Hello world</h1>'),
            'pages': folder({
                'projects.html': file('<h1>Projects</h1>'),
                'cv.html': file('<h1>CV</h1>'),
            }),
            'posts': folder({
                'uvicorn vs gunicorn.html': file('<h1>Hello world</h1>'),
                'signal based entity system.html': file('<h1>Hello world</h1>'),
                'the power of useSelector.html': file('<h1>Hello world</h1>'),
                'defeating procrastination - an essay.html': file('<h1>Hello world</h1>'),
            }),
        }),
    }),
})

const jamieMachine = folder({
    ...amiranMachine,
    'home': folder({
        'jamie': folder({
            'notes.txt': file('Hello world from Jamie!'),
        }),
    }),
})

const mariaMarchine = folder({
    ...amiranMachine,
    'home': folder({
        'jamie': folder({
            'notes.txt': file('Hello world from Jamie!'),
        }),
    }),
})

const network = {
    'amiran': { root: amiranMachine, password: null },
    'jamie': { root: jamieMachine, password: 'ayylmao' },
    'maria': { root: mariaMarchine, password: 'ayylmao' },
}

function normalizePath(path) {
    path = path.trim();

    // Replace '~' with '/home/user'
    if (path.startsWith('~')) {
        path = '/home/user' + path.substring(1);
    }

    // Remove trailing slash
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
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

function getAbsolutePath(inputPath) {
    const path = inputPath.startsWith('/') ? inputPath : $cwd.value + '/' + inputPath
    const normalizedPath = normalizePath(path)

    return normalizedPath
}

function getByPath(inputPath) {
    const path = getAbsolutePath(inputPath)

    let current = network[$currentMachine.value].root

    if (path === '/') {
        return current
    }

    const folders = path.split('/').slice(1)

    for (const folder of folders) {
        if (!current.files[folder]) {
            return null
        }

        current = current.files[folder]
    }

    return current
}

function cd(inputPath) {
    const target = getByPath(inputPath)

    if (!target) {
        return { error: 'no such file or directory: ' + inputPath }
    }

    if (target.type !== 'folder') {
        return { error: 'not a directory: ' + inputPath }
    }

    $cwd.value = normalizedPath

    return { success: true }
}

export function getAutocompleteSuggestion(input) {
    const currentFolder = getByPath($cwd.value)
    
    if (!currentFolder) {
        return null
    }

    const files = Object.keys(currentFolder.files).sort()
    const suggestion = files.find(name => name.startsWith(input))

    if (!suggestion) {
        return null
    }

    return suggestion.substring(input.length)
}

export default {
    cwd: {
        description: 'Print the current working directory',
        exec: ({ print }) => {
            print($cwd.value)
        }
    },
    ls: {
        description: 'List files and directories',
        exec: ({ print }) => {
            const current = getByPath($cwd.value)

            if (!current) {
                print('Current folder does not exist.')
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
                print('cd: path missing')
                return
            }

            const result = cd(path)

            if (result.error) {
                print('cd: ' + result.error)
            }
        }
    },
    cat: {
        description: 'Print file contents',
        exec: ({ print, params }) => {
            const path = params[0]

            if (!path) {
                print('cat: path missing')
                return
            }

            const target = getByPath(path)

            console.log('target', target)
            console.log('path', path)

            if (!target) {
                print('cat: ' + path + ': No such file or directory')
                return
            }

            if (target.type !== 'file') {
                print('cat: ' + path + ': Is a directory')
                return
            }

            print(target.content)
        }
    },
    telnet: {
        description: 'Connect to a remote machine',
        exec: ({ print, params }) => {
            const machine = params[0]

            if (!machine) {
                print('telnet: machine missing')
                return
            }

            if (!network[machine]) {
                print('telnet: machine not found')
                return
            }

            $currentMachine.value = machine
            print(`Connected to "${machine}". Type "quit" to disconnect.`)
            $cwd.value = '/'
        }
    },
    quit: {
        description: 'Disconnect from the current machine',
        exec: ({ print }) => {
            if ($currentMachine.value === 'amiran') {
                print('You cannot disconnect from the local machine')
                return
            }

            print(`Disconnected from remote host "${$currentMachine.value}"`)
            $currentMachine.value = 'amiran'
        }
    },
    nmap: {
        description: 'List all machines on the network',
        exec: ({ print }) => {
            print(Object.entries(network).map(([name, { password }]) => {
                return name + (password ? ' (password protected)' : '')
            }).join('\n'))
        }
    }
}