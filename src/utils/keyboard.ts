type KeyboardEvent = {
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    key: string;
};

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
        const event = this.defineKey(key);

        this.downExtra(event);
        this.mainElm!.dispatchEvent(new KeyboardEvent("keydown", event));
        this.mainElm!.dispatchEvent(new KeyboardEvent("keyup", event));
        this.upExtra(event);
    }

    private defineKey(key: string): KeyboardEvent {
        if (key.length === 1) return { key };

        const data = {
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
        };

        const isAlt = key.indexOf("Alt+") !== -1;
        if (isAlt) (key = key.replace("Alt+", "")) && (data.altKey = true);

        const isCtrl = key.indexOf("Ctrl+") !== -1;
        if (isCtrl) (key = key.replace("Ctrl+", "")) && (data.ctrlKey = true);

        const isShift = key.indexOf("Shift+") !== -1;
        if (isShift)
            (key = key.replace("Shift+", "")) && (data.shiftKey = true);

        return { key, ...data };
    }

    private downExtra(event: KeyboardEvent) {
        if (event.shiftKey) {
            this.mainElm!.dispatchEvent(
                new KeyboardEvent(
                    "keydown",
                    Object.assign({}, event, { key: "Shift" })
                )
            );
        }
        if (event.ctrlKey) {
            this.mainElm!.dispatchEvent(
                new KeyboardEvent(
                    "keydown",
                    Object.assign({}, event, { key: "Control" })
                )
            );
        }
        if (event.altKey) {
            this.mainElm!.dispatchEvent(
                new KeyboardEvent(
                    "keydown",
                    Object.assign({}, event, { key: "Alt" })
                )
            );
        }
    }

    private upExtra(event: KeyboardEvent) {
        if (event.shiftKey) {
            this.mainElm!.dispatchEvent(
                new KeyboardEvent(
                    "keyup",
                    Object.assign({}, event, { key: "Shift" })
                )
            );
        }
        if (event.ctrlKey) {
            this.mainElm!.dispatchEvent(
                new KeyboardEvent(
                    "keyup",
                    Object.assign({}, event, { key: "Control" })
                )
            );
        }
        if (event.altKey) {
            this.mainElm!.dispatchEvent(
                new KeyboardEvent(
                    "keyup",
                    Object.assign({}, event, { key: "Alt" })
                )
            );
        }
    }
}
