export default class Keyboard {
    private mainElm: HTMLElement;
    private pull: Array<{ key: string; cast: number }> = [];
    private time = 500;

    constructor(mainElm: HTMLElement) {
        this.mainElm = mainElm;
    }

    public press(event: { key: string; cast: number }) {
        this.pull.push(event);

        setTimeout(() => {
            this.update();

            setTimeout(() => {
                this.time -= event.cast;
            }, event.cast);
        }, this.time);

        this.time += event.cast;
    }

    private update() {
        const event = this.pull.shift();
        if (!event || !event.key || event.key === "") return;

        this.eventEmmit(event.key);
    }

    private eventEmmit(key: string) {
        this.mainElm!.dispatchEvent(
            new KeyboardEvent("keydown", this.defineKey(key))
        );
        this.mainElm!.dispatchEvent(
            new KeyboardEvent("keyup", this.defineKey(key))
        );
    }

    private defineKey(key: string) {
        if (key.length === 1) return { key };

        const data = {
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
        };

        const isAlt = key.indexOf("Alt+") !== -1;
        if (isAlt) key.replace("Alt+", "") && (data.altKey = true);

        const isCtrl = key.indexOf("Ctrl+") !== -1;
        if (isCtrl) key.replace("Ctrl+", "") && (data.ctrlKey = true);

        const isShift = key.indexOf("Shift+") !== -1;
        if (isShift) key.replace("Shift+", "") && (data.shiftKey = true);

        return { key, ...data };
    }
}
