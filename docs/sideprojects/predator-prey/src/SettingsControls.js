const valueSelectors = {
    'range': node => node.valueAsNumber,
    'select': node => node.value,
    'boolean': node => !!node.checked,
};

class SettingsControls extends Observable {
    constructor(settingsObject) {
        super();

        this.settings = settingsObject;

        this.on('change init', this.handler.bind(this));
        this.render();
    }

    render() {
        const rendering = document.querySelector('#rendering');
        const vegetation = document.querySelector('#vegetation');
        const darwinism = document.querySelector('#darwinism');
        const rabbits = document.querySelector('#rabbits');
        const foxes = document.querySelector('#foxes');

        rendering.appendChild(this.createTitle(`📷 Rendering`));
        rendering.appendChild(this.createSettingController('simSpeed'));
        rendering.appendChild(this.createSettingController('showRabbits'));
        rendering.appendChild(this.createSettingController('showWolves'));

        vegetation.appendChild(this.createTitle(`🌿 Vegetation`));
        vegetation.appendChild(this.createSettingController('grassGrowthRate'));
        vegetation.appendChild(this.createSettingController('maxVegetationEnergy'));

        darwinism.appendChild(this.createTitle(`🧬 Darwinism`));
        darwinism.appendChild(this.createSettingController('evolve'));
        darwinism.appendChild(this.createSettingController('mutateToPredator'));

        rabbits.appendChild(this.createTitle(`🐰 Rabbits`));
        rabbits.appendChild(this.createSettingController('genetics.Rabbit.energyGiven'));
        rabbits.appendChild(this.createSettingController('genetics.Rabbit.birthingEnergy'));
        rabbits.appendChild(this.createSettingController('genetics.Rabbit.moveProbability'));
        rabbits.appendChild(this.createSettingController('genetics.Rabbit.minEatEnergy'));
        rabbits.appendChild(this.createTitle(`Biology`, 'title="Biology settings are fixed and not changable by evolution."'));
        rabbits.appendChild(this.createSettingController('biology.Rabbit.maxAge'));

        foxes.appendChild(this.createTitle(`🦊 Foxes`));
        foxes.appendChild(this.createSettingController('genetics.Wolf.energyGiven'));
        foxes.appendChild(this.createSettingController('genetics.Wolf.birthingEnergy'));
        foxes.appendChild(this.createSettingController('genetics.Wolf.moveProbability'));
        foxes.appendChild(this.createTitle(`Biology`, 'title="Biology settings are fixed and not changable by evolution."'));
        foxes.appendChild(this.createSettingController('biology.Wolf.maxAge'));
    }

    createSettingController(path) {
        const setting = getPath(path, this.settings);
        const node = createNode(this.renderSetting(path, setting));
        this.connectInput(node.querySelector('input'), valueSelectors[setting.type]);

        return node;
    }

    connectInput(node, valueSelector) {
        node.addEventListener('input', event => {
            this.trigger(`change`, event.target.getAttribute('name'), valueSelector(event.target), );
        });

        this.trigger(`init`, node.getAttribute('name'), valueSelector(node));
    }

    createTitle(title, props = '') {
        return createNode(`<h3 class="settings__title" ${props}>${title}</h3>`);
    }

    renderSetting(path, setting) {
        if (setting.type === 'range') {
            return this.renderRange(path, setting);
        }

        if (setting.type === 'boolean') {
            return this.renderBoolean(path, setting);
        }

        console.warn(`Setting of type ${setting.type} does not exist`);

        return '';
    }

    handler(path, value) {
        console.log(path, value);
        const setting = getPath(path, this.settings);
        setting.value = value;

        console.log(setting);

        this.updateValues();
    }

    updateValues() {
        // ...
    }

    renderRange(path, range) {
        return `
            <div class="range">
                <div class="range__description">
                    ${range.label}
                </div>
                <div class="range__control">
                    <input
                        class="range__slider"
                        type="range"
                        name="${path}"
                        min="${range.min}"
                        max="${range.max}"
                        value="${range.value}"
                        step="${range.step}"
                    />
                    <span class="range__value" id="${path}--value"></span>
                </div>
            </div>
        `;
    }

    renderBoolean(path, checkbox) {
        return `
            <div class="boolean">
                <label>
                    <input
                        type="checkbox"
                        name="${path}"
                        ${checkbox.value ? 'checked' : ''}
                    />
                    ${checkbox.label}
                </label>
            </div>
        `;
    }
}