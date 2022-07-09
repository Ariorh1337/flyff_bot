export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function timer(time?: number) {
    return new Promise((resolve) => {
        if (!time) time = random(1, 50);

        setTimeout(resolve, time);
    });
}
