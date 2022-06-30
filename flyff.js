
class LocalCheats {
    constructor() {
        this.visible = true;
        this.cheatLines = new Map();

        this.container = this.createContainer();
        this.cheatList = this.createCheatsList();
        this.createToggleButton();
    }

    addCheatLine( name, config ) {
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
            const display = this.visible ? "block" : "none";
            this.cheatList.style.setProperty("display", display);
        });
    }
}

function keyPress(key) {
    const canvas = document.querySelector("canvas");
    canvas.dispatchEvent(new KeyboardEvent('keydown',  { 'key':key }));
    canvas.dispatchEvent(new KeyboardEvent('keyup', { 'key':key }));
}

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
        if (isFollowEnabled) keyPress("z");
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
            ["width", "110px"],
            ["margin-bottom", "10px"],
            ["justify-content", "space-around"],
        ],
        innerHTML: `<input id="keydown_${index}_enabled" type="checkbox" style="width: 50px; text-align: center;">
                    <input id="keydown_${index}_time" type="number" placeholder="1000" style="width: 50px; text-align: center;">
                    <input id="keydown_${index}_key" type="string" placeholder="c" style="width: 16px; text-align: center;">`,
    });

    let timeout = -1;
    setInterval(() => {
        const time = Number(document.getElementById(`keydown_${index}_time`).value);
        const key = document.getElementById(`keydown_${index}_key`).value.trim();
        if (isNaN(time) || !isFinite(time)) return;
        if (key.length !== 1) return;

        const isEnabled = document.getElementById(`keydown_${index}_enabled`).checked;

        if (!isEnabled && timeout === -1) return clearTimeout(timeout);
        if (isEnabled && timeout === -1) {
            timeout = setTimeout(() => {
                keyPress(document.getElementById(`keydown_${index}_key`).value);
                timeout = -1;
            }, document.getElementById(`keydown_${index}_time`).value);
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
