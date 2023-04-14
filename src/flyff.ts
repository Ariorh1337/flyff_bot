import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import Draggabilly from "draggabilly";
import * as html from "./ui/html";
import Input from "./utils/inputs";
import { timer } from "./utils/timer";

const canvas = <HTMLElement>html.get(`canvas`);

class App {
    private canvas = canvas;
    private canvas2D!: HTMLCanvasElement;
    private ctx2D!: CanvasRenderingContext2D;

    private input = new Input(canvas);
    private timer_counter = 0;
    private timer_key_counter = new Map();
    private key_counter = 0;
    private isFocused = false;

    constructor() {
        const container = html.toElement(html.container)!;
        document.body.appendChild(container);
        new Draggabilly(<Element>container, {});

        const upgrade = <HTMLLinkElement>html.get(`#cheats_upgrade`);
        fetch(
            "https://api.github.com/repos/Ariorh1337/flyff_bot/releases/latest"
        )
            .then((r) => r.json())
            .then((data) => {
                upgrade.setAttribute("href", data.html_url);

                if (data.name === upgrade.getAttribute("name")) return;

                upgrade.innerHTML = `Update:<br>${upgrade.getAttribute(
                    "name"
                )}->${data.name}`;
            });

        let interval = <NodeJS.Timer | number>-1;
        const follow = <HTMLInputElement>html.get(`#input_follow`);
        follow.addEventListener("change", (event: Event) => {
            const target = event.target as HTMLInputElement;
            const enabled = target.checked;
            if (!enabled) {
                clearInterval(interval);
                return (interval = -1);
            }

            interval = setInterval(() => {
                this.input.send({ cast: 100, key: "z" });
            }, 5000);
        });

        const button = <HTMLInputElement>html.get(`#cheats_add_timeline`);
        button.addEventListener("pointerdown", this.createTimer.bind(this));

        const button2 = <HTMLInputElement>html.get(`#cheats_add_key`);
        button2.addEventListener("pointerdown", this.createKey.bind(this));

        container.addEventListener("pointerdown", () => {
            this.isFocused = true;
        });
        this.canvas.addEventListener("pointerdown", () => {
            if (!this.isFocused) return;

            this.isFocused = false;
            this.canvas.focus();
        });

        const target = <HTMLInputElement>html.get(`#cheats_target`);
        target.addEventListener("pointerdown", async () => {
            target.classList.remove("btn-primary");
            target.classList.add("btn-secondary");
            await this.searchTarget();
            target.classList.remove("btn-secondary");
            target.classList.add("btn-primary");
        });

        this.create2DCanvas();
    }

    private createTimer() {
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

        const button2 = <HTMLInputElement>(
            html.get(`#timeline_${timer_counter_save}_add_click`)
        );
        button2.addEventListener(
            "pointerdown",
            this.createClickKey.bind(this, timer_counter_save)
        );

        let interval = <NodeJS.Timer | number>-1;
        const block = <HTMLInputElement>(
            html.get(`#timeline_${timer_counter_save}_on`)
        );
        block?.addEventListener("change", (event: Event) => {
            const target = event.target as HTMLInputElement;

            const id = timer_counter_save;
            const duration = html.getInput(`timeline_${id}_time`)!.value;
            if (Number(duration) <= 0) return (target.checked = false);

            this.onCheckboxChange(event);

            const enabled = target.checked;
            if (!enabled) {
                clearInterval(interval);
                return (interval = -1);
            }

            const keys_blocks = <HTMLInputElement[]>(
                html.getAll(`div[name="input_timeline_${id}_timer"]`)
            );
            const keys = [...keys_blocks].map((block) => {
                const key = (<HTMLInputElement>(
                    block.querySelector(`input[name="key"]`)
                ))?.value;
                const cast = (<HTMLInputElement>(
                    block.querySelector(`input[name="cast"]`)
                ))?.value;

                const x = (<HTMLInputElement>(
                    block.querySelector(`input[name="x"]`)
                ))?.value;
                const y = (<HTMLInputElement>(
                    block.querySelector(`input[name="y"]`)
                ))?.value;

                if (key && cast && key !== "" && cast !== "") {
                    return { cast: +cast, key };
                }

                if (x && y && x !== "" && y !== "") {
                    return { x: +x, y: +y, cast: 100 };
                }
            });

            interval = setInterval(() => {
                keys.forEach((data) => {
                    this.input.send(<any>data);
                });
            }, Number(duration));
        });
    }

    private createTimerKey(timer_counter_save: number) {
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

    private createClickKey(timer_counter_save: number) {
        const key_counter_save =
            this.timer_key_counter.get(timer_counter_save) || 0;
        this.timer_key_counter.set(timer_counter_save, key_counter_save + 1);

        const cheats_container = <HTMLElement>(
            html.get(`#timeline_${timer_counter_save}_collapse`)
        );

        const timer = html.toElement(
            html.click_timeline_group(
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

        const button2 = <HTMLInputElement>(
            html.get(
                `#input_timeline_${timer_counter_save}_timer_${key_counter_save}_pos`
            )
        );

        let enabled = true;
        button2.addEventListener("pointerdown", (event: Event) => {
            if (!enabled) return;
            enabled = false;

            const canvas = this.canvas;

            const id = (e: string) =>
                `input_timeline_${timer_counter_save}_timer_${key_counter_save}_${e}`;
            const input_x = html.getInput(id("x"))!;
            const input_y = html.getInput(id("y"))!;

            const update_pos = (event: MouseEvent) => {
                const x = event.offsetX;
                const y = event.offsetY;

                input_x.value = x.toString();
                input_y.value = y.toString();
            };

            function remove() {
                canvas.removeEventListener("pointermove", update_pos);
                canvas.removeEventListener("pointerdown", remove);
                enabled = true;
            }

            canvas.addEventListener("pointermove", update_pos);
            canvas.addEventListener("pointerdown", remove);
        });
    }

    private createKey() {
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

            if (key.indexOf("TAB") !== -1) {
                let done = false;
                const target = <HTMLInputElement>html.get(`#cheats_target`);
                interval = setInterval(async () => {
                    if (done) return;
                    done = true;
                    await this.attackTarget(target, {
                        count: Number(duration),
                        key: key.replace("TAB+", ""),
                        cast: Number(cast),
                    });
                    done = false;
                }, 100);
            } else {
                interval = setInterval(() => {
                    this.input.send({ cast: +cast, key });
                }, Number(duration));
            }
        });
    }

    private onCheckboxChange(event: Event) {
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

    private searchTarget() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        let done = false;
        let [x, x2, y, y2] = [0, 0, 0, 0];

        const time = new Date().getTime();

        return new Promise((resolve) => {
            this.input.cursorMutation = () => {
                this.input.mouseClickEmmit(x, y);
                done = true;
                this.input.cursorMutation = new Function();

                (<any>window).timeout = new Date().getTime() - time;

                resolve(true);
            };

            (async () => {
                this.ctx2D.clearRect(0, 0, width, height);
                this.ctx2D.moveTo(centerX, centerY);
                this.ctx2D.beginPath();

                for (let angle = 0.01; angle < 72; angle += 0.01) {
                    x2 = centerX + (10 + 5 * angle) * Math.cos(angle);
                    y2 = centerY + (10 + 5 * angle) * Math.sin(angle);

                    if (x2 < 0 || y2 < 0) continue;
                    if (x2 > width || y2 > height) continue;
                    if (Math.hypot(x2 - x, y2 - y) < 7) continue;

                    [x, y] = [x2, y2];

                    this.ctx2D.arc(x, y, 3, 0, 2 * Math.PI);
                    this.ctx2D.strokeStyle = "#fff";
                    this.ctx2D.stroke();

                    await this.input.mouseMoveEmmit(x, y);

                    if (done) break;
                }

                this.ctx2D.closePath();

                this.input.cursorMutation = new Function();

                timer(1000).then(() =>
                    this.ctx2D.clearRect(0, 0, width, height)
                );

                (<any>window).timeout = new Date().getTime() - time;

                resolve(false);
            })();
        });
    }

    private async attackTarget(
        target: HTMLInputElement,
        data: {
            count: number;
            key: string;
            cast: number;
        }
    ) {
        target.classList.remove("btn-primary");
        target.classList.add("btn-secondary");

        if (await this.searchTarget()) {
            await timer(500);
            for (let i = 0; i < data.count; i++) {
                await this.input.send({ cast: data.cast, key: data.key });
            }
        }

        target.classList.remove("btn-secondary");
        target.classList.add("btn-primary");
    }

    private create2DCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const canvas = document.createElement("canvas");
        document.body.append(canvas);

        canvas.setAttribute("id", "canvas2D");
        canvas.setAttribute("width", String(width));
        canvas.setAttribute("height", String(height));

        canvas.style.setProperty("pointer-events", "none");
        canvas.style.setProperty("width", "100%");
        canvas.style.setProperty("height", "100%");
        canvas.style.setProperty("position", "absolute");
        canvas.style.setProperty("opacity", "0.2");

        window.addEventListener("resize", () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            canvas.setAttribute("width", String(width));
            canvas.setAttribute("height", String(height));
        });

        this.canvas2D = canvas;
        this.ctx2D = canvas.getContext("2d")!;
    }
}

new App();
