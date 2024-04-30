export default class Swear {
    public state = "pending" as "pending" | "done" | "canceled" | "rejected";
    public promise: Promise<any>;

    private _cancel: boolean;
    private _resolve!: Function;
    private _reject!: Function;

    constructor() {
        this._cancel = false;

        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    cancel = () => {
        this._cancel = true;
        this.state = "canceled";
    };

    resolve = (data?: any) => {
        if (this._cancel) return;
        this.state = "done";
        this._resolve(data);
    };

    reject = (data?: any) => {
        if (this._cancel) return;
        this.state = "rejected";
        this._reject(data);
    };
}
