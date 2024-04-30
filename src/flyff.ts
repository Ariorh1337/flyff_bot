import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import App from "./app";
import Swear from "./utils/swear";

const swear = new Swear();
swear.promise.then(() => {
    new App();
});

(() => {
    (<any>WebAssembly).origin_instantiate = WebAssembly.instantiate;
    WebAssembly.instantiate = function (...args) {
        const data = (<any>WebAssembly).origin_instantiate(...args);

        data.then((engine: any) => {
            (<any>window).engine = engine;
            swear.resolve();
        });

        return data;
    };
})();
