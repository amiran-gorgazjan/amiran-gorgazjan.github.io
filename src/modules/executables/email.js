// polaroid photo of tidy clean well kept empty tech office basement, lights off, flash photography, july 2008, only source of light is the camera flash, kodak, amateur photography, fisheye, yellow walls, kodak --chaos 100 

function trim(str) {
    return str.trim().split('\n').map(line => line.trim()).join('\n')
}

function padLinesLeft(str, pad) {
    return str.split('\n').map(line => pad + line).join('\n')
}

const emails = [
    {
        id: 1,
        from: 'InfoSec <infosec@talesprout.com>',
        time: '2020-01-01 12:14:23',
        subject: 'Password Reset',
        body: `
            Hey Amiran!

            This is Maria from InfoSec. We've recently noticed some suspicious
            activity on your account. We've reset your password to prevent any
            unauthorized access.
            
            The new password is: ayylmao123
            Please change it as soon as possible.

            Thanks,
            Maria (InfoSec @ Talesprout.com)
        `,
        response: `
            Hey Maria!

            Thanks for the heads up. I'll change my password right away.

            Amiran (CEO, Talesprout.com)
        `
    },
    {
        id: 2,
        from: 'Jane Doe',
        time: '2020-01-02 13:34:12',
        subject: 'Hi',
        body: 'Hi World'
    }
]

function leftPad(str, len) {
    return str + ' '.repeat(Math.max(len - str.length, 0))
}

const email = {
    description: 'Check your email',
    commands: {
        list: {
            description: 'List emails',
            exec: ({ print }) => {
                // Find max length of id, from and subject fields
                const fieldMaxLengths = emails.reduce((acc, email) => {
                    const { id, from, subject } = email
                    return {
                        id: Math.max(acc.id, id.toString().length),
                        from: Math.max(acc.from, from.length),
                        subject: Math.max(acc.subject, subject.length)
                    }
                }, { id: 0, from: 0, subject: 0 })

                const maxLengths = {
                    id: Math.max(fieldMaxLengths.id, 'ID'.length),
                    from: Math.max(fieldMaxLengths.from, 'FROM'.length),
                    subject: Math.max(fieldMaxLengths.subject, 'SUBJECT'.length)
                }

                print(`${leftPad('ID', maxLengths.id)}  ${leftPad('FROM', maxLengths.from)}  SUBJECT`)
                print(`${leftPad('-'.repeat(maxLengths.id), maxLengths.id)}  ${leftPad('-'.repeat(maxLengths.from), maxLengths.from)}  ${'-'.repeat(maxLengths.subject)}`)

                emails.forEach(email => {
                    const { id, from, subject } = email
                    print(`${leftPad(id, maxLengths.id)}   ${leftPad(from, maxLengths.from)}  ${subject}`)
                })
            }
        },
        read: {
            description: 'Read an email',
            exec: ({ print, params }) => {
                const id = params[0]
                const email = emails.find(email => email.id === Number(id))

                if (!email) {
                    print(`Email with ID ${id} not found`)
                    return
                }

                print(`From: ${email.from}`)
                print(`Date: ${email.time}`)
                print(`Subject: ${email.subject}`)
                print(`\n${padLinesLeft(trim(email.body), '')}`)

                if (email.response) {
                    print('')
                    print(`${padLinesLeft(trim(email.response), '> ')}`)
                }
            }
        },
    },
    exec: ({ print, params }) => {
        const subcommand = params[0]

        if (!subcommand) {
            print('Welcome to the inbox!')
            print('Available commands:\n')
            Object.entries(email.commands).forEach(([command, { description }]) => {
                print(`    ${command} - ${description}`)
            })

            return
        }

        const command = email.commands[subcommand]

        if (!command) {
            print(`Command "${subcommand}" not found`)
            return
        }

        command.exec({ print, params: params.slice(1) })
    }
}

export default { email }