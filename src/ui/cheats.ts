export default class LocalCheats {
    private visible = true;
    private isFocused = false;
    private cheatLines = new Map();

    private container: HTMLDivElement;
    private cheatList: HTMLDivElement;

    constructor(mainElm: HTMLElement) {
        this.container = this.createContainer();
        this.cheatList = this.createCheatsList();

        this.createToggleButton();

        this.container.addEventListener("pointerdown", () => {
            this.isFocused = true;
        });
        mainElm.addEventListener("pointerdown", () => {
            if (!this.isFocused) return;

            this.isFocused = false;
            mainElm.focus();
        });
    }

    public addCheatLine(
        name: string,
        config: {
            tag: string;
            attributes?: [string, string][];
            styles?: [string, string][];
            innerHTML?: string;
            outerHTML?: string;
        }
    ) {
        if (this.cheatLines.has(name)) {
            console.error(`Cheat line ${name} already exists`);
            return undefined;
        }

        let element = document.createElement(config.tag);

        if (config.outerHTML) {
            element.innerHTML = config.outerHTML ?? "";
            element = element.firstElementChild as HTMLElement;
        }

        config.attributes?.forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        config.styles?.forEach(([key, value]) => {
            element.style.setProperty(key, value);
        });
        element.innerHTML = config.innerHTML ?? "";

        this.cheatLines.set(name, element);
        this.cheatList.appendChild(element);

        return element;
    }

    public getInput(line: string, id: string): HTMLInputElement | undefined {
        const cheat = this.cheatLines.get(line);
        if (!cheat) {
            console.error(`Cheat line ${line} does not exist`);
            return;
        }

        const input = cheat.querySelector(`#${id}`);
        if (!input) {
            console.error(`Input ${id} does not exist`);
            return;
        }

        return input;
    }

    private createContainer() {
        const container = document.createElement("div");
        container.setAttribute("id", "cheats_container");
        container.style.setProperty("position", "absolute");
        container.style.setProperty("width", "fit-content");
        container.style.setProperty("top", "inherit");
        container.style.setProperty("right", "0");
        container.style.setProperty("background-color", "white");
        container.style.setProperty("padding", "10px");
        container.style.setProperty("display", "flex");
        container.style.setProperty("flex-direction", "column");
        container.style.setProperty("align-items", "center");

        document.body.appendChild(container);

        return container;
    }

    private createCheatsList() {
        const panel = document.createElement("div");
        panel.style.setProperty("display", "none");
        panel.style.setProperty("flex-direction", "column");
        panel.style.setProperty("align-items", "center");

        this.container.appendChild(panel);

        return panel;
    }

    private createToggleButton() {
        const button = document.createElement("button");
        button.insertAdjacentText("afterbegin", "Cheats");
        button.style.setProperty("cursor", "pointer");
        this.container.appendChild(button);

        button.addEventListener("click", () => {
            this.visible = !this.visible;
            const display = this.visible ? "flex" : "none";
            this.cheatList.style.setProperty("display", display);
        });
    }
}
