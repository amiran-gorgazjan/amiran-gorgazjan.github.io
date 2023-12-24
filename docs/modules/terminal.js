import fs, { getAutocompleteSuggestion } from '/modules/executables/fs.js';
import email from '/modules/executables/email.js';
import { $cwd, $input, $inputAllowed, $currentMachine } from '/modules/state.js';
import { effect } from '/modules/signals.js';
import koobas from '/modules/executables/koobas-cmd.js';

const outputEl = document.getElementById('output');
const promptEl = document.getElementById('prompt');
const terminalEl = document.getElementById('terminal');
const cmdEl = document.getElementById('cmd');
const pathEl = document.getElementById('path');

const cliHistory = [];
let historyIndex = 0;

const safeText = (text) => {
    if (typeof text !== 'string') {
        try {
            text = JSON.stringify(text);
        } catch (e) {
            text = String(text);
        }
    }

    // Replace < and > with &lt; and &gt;
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return text.split('\n').map(line => line.slice(0, 80)).join('\n');
}

const print = (text) => {
    outputEl.innerHTML += safeText(text) + '\n';
    outputEl.scrollTop = outputEl.scrollHeight;
};

const dangerouslyPrintHTML = (html, { replace = false } = {}) => {
    if (replace) {
        outputEl.innerHTML = html;
    } else {
        outputEl.innerHTML += html;
    }

    setTimeout(() => {
        outputEl.scrollTop = outputEl.scrollHeight;
    }, 100);
};

// replaces the innerHTML with the new lines
// each line has a DIV with an id of line-<index>
// if the line is exactly the same as the previous one, it won't be replaced
// Order must always be the same and all the lines must be present every render
const lastLines = [];
const optimisedDangerousLinePrint = (lines = []) => {
    lines.forEach((line, index) => {
        if (lastLines[index] === line) {
            return;
        }

        const maybeLineEl = outputEl.querySelector(`#line-${index}`);

        if (maybeLineEl) {
            maybeLineEl.innerHTML = line;
        } else {
            outputEl.innerHTML += `<div id="line-${index}">${line}</div>`;
        }

        lastLines[index] = line;
    });
}

// Shake the terminal for 100 ms
const shake = () => {
    terminalEl.classList.add('shake');
    setTimeout(() => {
        terminalEl.classList.remove('shake');
    }, 100);
};

const clear = () => outputEl.textContent = '';

const exec = async (command) => {
    const args = command.trim().split(' ');
    const name = args[0];
    const params = args.slice(1).filter(p => p !== '');

    if (commands[name]) {
        const style = cmdEl.style.display;
        cmdEl.style.display = 'none';
        $inputAllowed.value = false;

        try {
            await commands[name].exec({
                print, clear, dangerouslyPrintHTML, optimisedDangerousLinePrint,
                params, terminalEl, shake,
            });
        } catch (e) {
            console.error(e);
            print(`Process exited with error: ${e.message}`);
        }

        $inputAllowed.value = true;
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
    ...koobas,
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

        
        print(`${pathEl.textContent} ${inputValue}`);
        cliHistory.push(inputValue);
        await exec(inputValue);
        $input.value = '';
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