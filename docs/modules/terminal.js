import fs, { getAutocompleteSuggestion } from '/modules/executables/fs.js';
import email from '/modules/executables/email.js';
import { $cwd, $input, $inputAllowed, $currentMachine } from '/modules/state.js';
import { effect } from '/modules/signals.js';

const outputEl = document.getElementById('output');
const promptEl = document.getElementById('prompt');
const terminalEl = document.getElementById('terminal');
const cmdEl = document.getElementById('cmd');
const pathEl = document.getElementById('path');

const cliHistory = [];
let historyIndex = 0;

const print = (text) => {
    if (typeof text !== 'string') {
        try {
            text = JSON.stringify(text);
        } catch (e) {
            text = String(text);
        }
    }

    text = text.split('\n').map(line => line.slice(0, 80)).join('\n');
    outputEl.textContent += text + '\n';
    outputEl.scrollTop = outputEl.scrollHeight;
};

const clear = () => outputEl.textContent = '';

const exec = async (command) => {
    const args = command.trim().split(' ');
    const name = args[0];
    const params = args.slice(1).filter(p => p !== '');

    if (commands[name]) {
        const style = cmdEl.style.display;
        cmdEl.style.display = 'none';
        await commands[name].exec({ print, clear, params });
        cmdEl.style.display = style;
    } else {
        print(`Command not found: ${name}`);
        print(`Type 'help' to list all available commands`)
    }
};

const commands = {
    help: {
        description: 'List all available commands',
        exec: ({ print }) => {
            Object.keys(commands).forEach((command) => {
                const description = commands[command].description;
                print(`${command} - ${description}`);
            });
        },
    },
    clear: {
        description: 'Clear the terminal screen',
        exec: clear,
    },
    history: {
        description: 'List all commands executed in this session',
        exec: ({ print }) => {
            cliHistory.forEach((command) => {
                print(command);
            });
        },
    },
    ...fs,
    ...email,
};

terminalEl.addEventListener('keydown', async (e) => {
    if (!$inputAllowed.value) {
        return;
    }

    const inputValue = $input.value;

    if (e.keyCode === 13) {
        // Enter
        if (inputValue.trim() === '') {
            return;
        }

        $inputAllowed.value = false;
        print(`${pathEl.textContent} ${inputValue}`);
        cliHistory.push(inputValue);
        await exec(inputValue);
        $input.value = '';
        $inputAllowed.value = true;
    } else if (e.keyCode === 8) {
        // Backspace
        $input.value = inputValue.slice(0, -1);
    } else if (e.key.length === 1) {
        // A letter
        $input.value += e.key;
    } else if (e.keyCode === 32) {
        // Space
        $input.value += ' ';
    } else if (e.keyCode === 38) {
        // Up arrow
        historyIndex = Math.min(cliHistory.length, historyIndex + 1);
        $input.value = cliHistory[cliHistory.length - historyIndex] || '';
    } else if (e.keyCode === 40) {
        // Down arrow
        historyIndex = Math.max(0, historyIndex - 1);
        $input.value = cliHistory[cliHistory.length - historyIndex] || '';
    } else if (e.keyCode === 9) {
        const inputPart = inputValue.split(' ').pop();
        // Tab
        e.preventDefault();
        const suggestion = getAutocompleteSuggestion(inputPart);
        if (suggestion) {
            $input.value += suggestion;
        }
    }
});

// Change $path
effect(() => {
    pathEl.textContent = `amiran@${$currentMachine.value}:${$cwd.value} $`;
})

// Update input
effect(() => {
    promptEl.textContent = $input.value;
});