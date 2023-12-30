class Observable {
    constructor() {
        this.listeners = {};
    }

    trigger(name, ...args) {
        const funcs = this.listeners[name];

        if (!funcs) {
            return;
        }

        for (const func of funcs) {
            func(...args);
        }
    }

    on(names, func) {
        names = names.split(' ');

        names.forEach((name) => {
            if (!this.listeners[name]) {
                this.listeners[name] = [];
            }
    
            this.listeners[name].push(func);
        });
    }
}