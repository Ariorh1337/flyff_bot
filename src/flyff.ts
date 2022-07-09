import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import * as html from "./ui/html";
import Keyboard from "./utils/keyboard";

const canvas = <HTMLElement>html.get(`canvas`);

class App {
    private canvas = canvas;
    private keyboard = new Keyboard(canvas);
    private timer_counter = 0;
    private timer_key_counter = new Map();
    private key_counter = 0;
    private isFocused = false;

    constructor() {
        const container = html.toElement(html.container)!;
        document.body.appendChild(container);

        const button = <HTMLInputElement>html.get(`#cheats_add_timeline`);
        button.addEventListener("pointerdown", this.createTimer.bind(this));

        const button2 = <HTMLInputElement>html.get(`#cheats_add_key`);
        button2.addEventListener("pointerdown", this.createKey.bind(this));

        container.addEventListener("pointerdown", () => {
            this.isFocused = true;
        });
        canvas.addEventListener("pointerdown", () => {
            if (!this.isFocused) return;

            this.isFocused = false;
            canvas.focus();
        });
    }

    createTimer() {
        const timer_counter_save = this.timer_counter++;

        const cheats_container = <HTMLElement>html.get(`#cheats_collapse`);
        const timer = html.toElement(html.collapseTimeline(timer_counter_save));
        cheats_container?.appendChild(timer);

        const button = <HTMLInputElement>(
            html.get(`#timeline_${timer_counter_save}_add`)
        );
        button.addEventListener(
            "pointerdown",
            this.createTimerKey.bind(this, timer_counter_save)
        );

        this.createTimerKey(timer_counter_save);

        let interval = <NodeJS.Timer | number>-1;
        const block = <HTMLInputElement>(
            html.get(`#timeline_${timer_counter_save}_on`)
        );
        block?.addEventListener("change", (event: Event) => {
            this.onCheckboxChange(event);

            const target = event.target as HTMLInputElement;
            const enabled = target.checked;
            if (!enabled) {
                clearInterval(interval);
                return (interval = -1);
            }

            const id = timer_counter_save;
            const duration = html.getInput(`timeline_${id}_time`)!.value;

            const keys_blocks = <HTMLInputElement[]>(
                html.getAll(`#input_timeline_${id}_timer`)
            );
            const keys = [...keys_blocks].map((block) => {
                const key = (<HTMLInputElement>(
                    block.querySelector(`input[name="key"]`)!
                )).value;
                const cast = (<HTMLInputElement>(
                    block.querySelector(`input[name="cast"]`)!
                )).value;

                return { cast, key };
            });

            interval = setInterval(() => {
                keys.forEach((data) => {
                    this.keyboard.press({ cast: +data.cast, key: data.key });
                });
            }, Number(duration));
        });
    }

    createTimerKey(timer_counter_save: number) {
        const key_counter_save =
            this.timer_key_counter.get(timer_counter_save) || 0;
        this.timer_key_counter.set(timer_counter_save, key_counter_save + 1);

        const cheats_container = <HTMLElement>(
            html.get(`#timeline_${timer_counter_save}_collapse`)
        );

        const timer = html.toElement(
            html.input_timeline_group(
                `timeline_${timer_counter_save}_timer`,
                `timeline_${timer_counter_save}_timer_${key_counter_save}`
            )
        );

        cheats_container?.appendChild(timer);

        const button = <HTMLInputElement>(
            html.get(
                `#input_timeline_${timer_counter_save}_timer_${key_counter_save}_remove`
            )
        );
        button.addEventListener("pointerdown", function (event: Event) {
            const target = event.target as HTMLInputElement;
            const block = target.getAttribute("data-block-id");
            (<HTMLElement>html.get(`#${block}`)).remove();
        });
    }

    createKey() {
        const key_counter_save = this.key_counter++;
        const cheats_container = <HTMLElement>html.get(`#cheats_collapse`);
        const timer = html.toElement(html.input_key_group(key_counter_save))!;
        cheats_container?.appendChild(timer);

        let interval = <NodeJS.Timer | number>-1;
        const block = <HTMLInputElement>(
            html.get(`#input_${key_counter_save}_on`)
        );
        block?.addEventListener("change", (event: Event) => {
            this.onCheckboxChange(event);

            const target = event.target as HTMLInputElement;
            const enabled = target.checked;
            if (!enabled) {
                clearInterval(interval);
                return (interval = -1);
            }

            const id = key_counter_save;
            const duration = html.getInput(`input_${id}_time`)!.value;
            const cast = html.getInput(`input_${id}_cast`)!.value;
            const key = html.getInput(`input_${id}_key`)!.value;

            interval = setInterval(() => {
                this.keyboard.press({ cast: +cast, key });
            }, Number(duration));
        });
    }

    onCheckboxChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const block = target.getAttribute("data-block-id");
        const enabled = target.checked;

        const block_element = document.getElementById(block!);
        [
            ...block_element?.querySelectorAll(`input:not([type="checkbox"])`)!,
        ].forEach((input) => {
            (<HTMLInputElement>input).disabled = enabled;
        });
        [...block_element?.querySelectorAll(`button:not(.cant_lock)`)!].forEach(
            (input) => {
                (<HTMLButtonElement>input).disabled = enabled;
            }
        );
    }
}

new App();
