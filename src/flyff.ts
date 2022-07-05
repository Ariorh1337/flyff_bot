import LocalCheats from "./ui/cheats";
import Keyboard from "./utils/keyboard";

const canvas = document.querySelector("canvas")!;

class App {
    private keyboard = new Keyboard(canvas);
    private ui = new LocalCheats(canvas);
    private keydown_counter = 0;

    constructor() {
        this.createFollow();
        this.createKeyDownButton();
    }

    private createFollow() {
        this.ui.addCheatLine("follow", {
            tag: "div",
            outerHTML: `
                <div id="follow" style="display: flex; width: 110px; margin-bottom: 10px; justify-content: space-around;"></div>
            `,
            innerHTML: `
                <input id="follow-input" type="checkbox" style="width: 50px; text-align: center;">
                <p>follow</p>
            `,
        });

        setInterval(() => {
            const input = this.ui.getInput("follow", "follow-input");
            if (input?.checked) {
                this.keyboard.press({ key: "z", cast: 100 });
            }
        }, 5000);
    }

    private createKeyDownButton() {
        this.ui
            .addCheatLine("keydown", {
                tag: "div",
                outerHTML: `
                    <div id="keydown" style="display: flex; width: fit-content; height: 25px; margin-bottom: 10px; justify-content: space-around;"></div>
                `,
                innerHTML: `<button id="add_keydown" style="width: fit-content; text-align: center;">Add Keydown</button>`,
            })
            ?.querySelector("#add_keydown")
            ?.addEventListener("pointerdown", this.onKeyDownButton.bind(this));
    }

    private onKeyDownButton() {
        const i = this.keydown_counter;
        const id = {
            line: `keydown_${i}`,
            time: `keydown_${i}_time`,
            cast: `keydown_${i}_cast`,
            key: `keydown_${i}_key`,
            on: `keydown_${i}_enabled`,
        };

        this.ui.addCheatLine(`keydown_${i}`, {
            tag: "div",
            outerHTML: `
                <div id="${id.line}" style="display: flex; width: fit-content; margin-bottom: 10px; justify-content: space-around;"></div>
            `,
            innerHTML: `
                <input id="${id.on}" type="checkbox" style="width: 19px; text-align: center;">
                <input id="${id.time}" type="number" placeholder="interval" style="width: 70px; text-align: center;">
                <input id="${id.cast}" type="number" placeholder="casting" style="width: 60px; text-align: center;">
                <input id="${id.key}" type="string" placeholder="key" style="width: 20px; text-align: center;">
            `,
        });

        let timeout = -1;
        setInterval(() => {
            const time = Number(this.ui.getInput(id.line, id.time)?.value);
            const cast = Number(this.ui.getInput(id.line, id.cast)?.value);
            const key = this.ui.getInput(id.line, id.key)?.value.trim() || "";
            const isEnabled = this.ui.getInput(id.line, id.on)?.checked;

            if (isNaN(time) || !isFinite(time)) return;

            if (!isEnabled && timeout !== -1) {
                clearTimeout(timeout);
                timeout = -1;
                return;
            }

            if (isEnabled && timeout === -1) {
                const event = () => {
                    this.keyboard.press({ key, cast });
                    timeout = -1;
                };

                timeout = <number>(<unknown>setTimeout(event, time));
            }
        }, 100);

        this.keydown_counter += 1;
    }
}

new App();
