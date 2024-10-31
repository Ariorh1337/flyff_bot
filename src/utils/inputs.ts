import { timer } from "./timer";

type KeyboardEvent = {
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    key: string;
};

export default class Input {
    public cursorMutation = new Function();

    private mainElm: HTMLElement;
    private pull: Array<
        { key: string; cast: number } | { x: number; y: number }
    > = [];
    private time = 500;
    private emitMouseUp!: Function;
    private emitMouseDown!: Function;
    private emitMouseMove!: Function;

    constructor(mainElm: HTMLElement) {
        this.mainElm = mainElm;

        this.initMouse();
        this.initCursorObserver();
    }

    public async send(
        event:
            | { key: string; cast: number }
            | { x: number; y: number; cast: number }
    ) {
        this.pull.push(event);

        const time = this.time;
        this.time += event.cast;

        await timer(time);
        this.update();
        await timer(event.cast);

        this.time -= event.cast;
    }

    public async mouseMoveEmmit(x: number, y: number) {
        const event_obj = this.moveTemplate(x, y);
        this.emitMouseMove(new MouseEvent("mousemove", event_obj));
        await timer(1);
    }

    public async mouseClickEmmit(x: number, y: number) {
        const event_obj = this.clickTemplate(x, y);

        this.emitMouseDown(new MouseEvent("mousedown", event_obj));
        await timer();
        this.emitMouseUp(new MouseEvent("mouseup", event_obj));
    }

    private initMouse() {
        window.addEventListener("load", async () => {
            do {
                await timer(100);
            } while (!(<any>window).JSEvents);

            const mouseup = (<any>window).JSEvents.eventHandlers.filter(
                (elm: any) => elm.eventTypeString === "mouseup"
            )[0];
            const mousedown = (<any>window).JSEvents.eventHandlers.filter(
                (elm: any) => elm.eventTypeString === "mousedown"
            )[0];
            const mousemove = (<any>window).JSEvents.eventHandlers.filter(
                (elm: any) => elm.eventTypeString === "mousemove"
            )[0];

            this.emitMouseUp = mouseup.eventListenerFunc;
            this.emitMouseDown = mousedown.eventListenerFunc;
            this.emitMouseMove = mousemove.eventListenerFunc;
        });
    }

    private initCursorObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutationRecord) => {
                if (
                    document.body.style
                        .getPropertyValue("cursor")
                        .indexOf("curattack") !== -1
                ) {
                    this.cursorMutation();
                }
            });
        });
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["style"],
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
            this.mouseClickEmmit((<any>event).x, (<any>event).y);
        }
    }

    private async keyEmmit(key: string) {
        const event = this.defineKey(key);

        this.downExtra(event);
        await timer();
        this.mainElm!.dispatchEvent(new KeyboardEvent("keydown", event));
        await timer();
        this.mainElm!.dispatchEvent(new KeyboardEvent("keyup", event));
        await timer();
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

    private moveTemplate(x: number, y: number) {
        return {
            altKey: false,
            bubbles: true,
            button: 0,
            buttons: 0,
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
            which: 0,
            x,
            y,
        };
    }
}
