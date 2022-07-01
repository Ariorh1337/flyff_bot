
class LocalCheats {
    constructor() {
        this.visible = true;
        this.cheatLines = new Map();

        this.container = this.createContainer();
        this.cheatList = this.createCheatsList();
        this.createToggleButton();
    }

    addCheatLine(name, config) {
        if (this.cheatLines.has(name)) {
            console.error(`Cheat line ${name} already exists`);
            return;
        }

        const element = document.createElement(config.tag);

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

    createContainer() {
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

    createCheatsList() {
        const panel = document.createElement("div");
        panel.style.setProperty("display", "none");
        panel.style.setProperty("flex-direction", "column");
        panel.style.setProperty("align-items", "center");

        this.container.appendChild(panel);

        return panel;
    }

    createToggleButton() {
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

class Keyboard {
    #pull = [];
    #time = 500;

    constructor() {}

    /**
     * @param {Object} event 
     * @param {string} event.key
     * @param {number} event.cast
     */
    press(event) {
        this.#pull.push(event);

        setTimeout(() => {
            this.#update();

            setTimeout(() => { 
                this.#time -= event.cast; 
            }, event.cast);
        }, this.#time);

        this.#time += event.cast;
    }

    #update() {
        const event = this.#pull.shift();
        if (!event || !event.key || event.key === "") return;

        this.#eventEmmit(event.key);
    }

    #eventEmmit(key) {
        const canvas = document.querySelector("canvas");
        canvas.dispatchEvent(new KeyboardEvent('keydown', { key }));
        canvas.dispatchEvent(new KeyboardEvent('keyup', { key }));
    }
}

const keyboard = new Keyboard();

function createFollow(cheats) {
    cheats.addCheatLine("follow", {
        tag: "div",
        attributes: [["id", "follow"]],
        styles: [
            ["display", "flex"],
            ["width", "110px"],
            ["margin-bottom", "10px"],
            ["justify-content", "space-around"],
        ],
        innerHTML: `<input id="follow-input" type="checkbox" style="width: 50px; text-align: center;"><p>follow</p>`,
    });

    setInterval(() => {
        const isFollowEnabled = document.getElementById("follow-input").checked;
        if (isFollowEnabled) keyboard.press({ key: "z", cast: 100 });
        if (localStorage.getItem("follow-input") != isFollowEnabled) {
            localStorage.setItem("follow-input", isFollowEnabled);
        }
    }, 5000);
}

function createKeyDown(cheats, index) {
    cheats.addCheatLine(`keydown_${index}`, {
        tag: "div",
        attributes: [["id", `keydown_${index}`]],
        styles: [
            ["display", "flex"],
            ["width", "fit-content"],
            ["margin-bottom", "10px"],
            ["justify-content", "space-around"],
        ],
        innerHTML: `<input id="keydown_${index}_enabled" type="checkbox" style="width: 19px; text-align: center;">
                    <input id="keydown_${index}_time" type="number" placeholder="interval" style="width: 70px; text-align: center;">
                    <input id="keydown_${index}_cast" type="number" placeholder="casting" style="width: 60px; text-align: center;">
                    <input id="keydown_${index}_key" type="string" placeholder="key" style="width: 20px; text-align: center;">`,
    });

    let timeout = -1;
    setInterval(() => {
        const time = Number(document.getElementById(`keydown_${index}_time`).value);
        const cast = Number(document.getElementById(`keydown_${index}_cast`).value);
        const key = document.getElementById(`keydown_${index}_key`).value.trim();

        if (isNaN(time) || !isFinite(time)) return;
        if (key.length !== 1) return;

        const isEnabled = document.getElementById(`keydown_${index}_enabled`).checked;

        if (!isEnabled && timeout !== -1) {
            clearTimeout(timeout);
            timeout = -1;
            return;
        }
        if (isEnabled && timeout === -1) {
            const event = () => {
                keyboard.press({ key, cast });
                timeout = -1;
            };

            timeout = setTimeout(event, time);
        }
    }, 100);
}

(function init() {
    let index = 0;
    const cheats = new LocalCheats();

    createFollow(cheats);

    cheats.addCheatLine("keydown", {
        tag: "div",
        attributes: [["id", "keydown"]],
        styles: [
            ["display", "flex"],
            ["width", "fit-content"],
            ["height", "25px"],
            ["margin-bottom", "10px"],
            ["justify-content", "space-around"],
        ],
        innerHTML: `<button id="add_keydown" style="width: fit-content; text-align: center;">Add Keydown</button>`,
    })
        ?.querySelector("#add_keydown")
        ?.addEventListener("pointerdown", () => {
            createKeyDown(cheats, index++);
        });
})();
