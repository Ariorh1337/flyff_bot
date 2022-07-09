type MouseEvent = {
    x: number;
    y: number;
};

type KeyboardEvent = {
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    key: string;
};

export default class Input {
    private mainElm: HTMLElement;
    private pull: Array<
        { key: string; cast: number } | { x: number; y: number }
    > = [];
    private time = 500;
    private emitMouseUp!: Function;
    private emitMouseDown!: Function;

    constructor(mainElm: HTMLElement) {
        this.mainElm = mainElm;

        this.initMouse();
    }

    public send(
        event:
            | { key: string; cast: number }
            | { x: number; y: number; cast: number }
    ) {
        this.pull.push(event);

        setTimeout(() => {
            this.update();

            setTimeout(() => {
                this.time -= event.cast;
            }, event.cast);
        }, this.time);

        this.time += event.cast;
    }

    private initMouse() {
        window.addEventListener("load", async () => {
            await new Promise((r) => setTimeout(r, 2000));

            const mouseup = (<any>window).JSEvents.eventHandlers.filter(
                (elm: any) => elm.eventTypeString === "mouseup"
            )[0];
            const mousedown = (<any>window).JSEvents.eventHandlers.filter(
                (elm: any) => elm.eventTypeString === "mousedown"
            )[0];

            console.warn([mouseup, mousedown]);

            this.emitMouseUp = mouseup.eventListenerFunc;
            this.emitMouseDown = mousedown.eventListenerFunc;
        });
    }

    private update() {
        const event = this.pull.shift();
        if (!event) return;

        if (Object.hasOwnProperty.call(event, "key")) {
            if ((<any>event).key === "") return;

            this.keyEmmit((<any>event).key);
        }

        if (Object.hasOwnProperty.call(event, "x")) {
            this.clickEmmit((<any>event).x, (<any>event).y);
        }
    }

    private keyEmmit(key: string) {
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

    private clickEmmit(x: number, y: number) {
        const event_down = new MouseEvent(
            "mousedown",
            this.clickTemplate(x, y)
        );
        this.emitMouseDown(event_down);

        const event_up = new MouseEvent("mouseup", this.clickTemplate(x, y));
        this.emitMouseUp(event_up);
    }

    private clickTemplate(x: number, y: number) {
        return {
            altKey: false,
            bubbles: true,
            button: 0,
            buttons: 1,
            cancelBubble: false,
            cancelable: true,
            clientX: x,
            clientY: y,
            composed: true,
            ctrlKey: false,
            currentTarget: null,
            defaultPrevented: true,
            detail: 1,
            eventPhase: 0,
            fromElement: null,
            layerX: x,
            layerY: y,
            metaKey: false,
            movementX: 0,
            movementY: 0,
            offsetX: x,
            offsetY: y,
            pageX: x,
            pageY: y,
            relatedTarget: null,
            returnValue: false,
            screenX: x,
            screenY: y,
            shiftKey: false,
            which: 1,
            x,
            y,
        };
    }
}
