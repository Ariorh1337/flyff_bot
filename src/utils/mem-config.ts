export const data = {
    offset: {
        value: 23326676,
        address: 0x2508097b5a0,
        offset: 0,
    },
    get: function (prop: string) {
        return (<any>this)[prop].address - this.offset.offset;
    },
    x: {
        address: 0x2508097a6c8,
    },
    y: {
        address: 0x2508097a6d0,
    },
    z: {
        address: 0x2508097a6cc,
    },
    money: {
        address: 0x2508097a928,
    },
    x_point: {
        address: 0x2508097abf4,
    },
    y_point: {
        address: 0x2508097abfc,
    },
    z_point: {
        address: 0x2508097abf8,
    },
    target_blue: {
        address: 0x2508097ac68,
    },
    target_red: {
        address: 0x2508097ac70,
    },
    target_follow: {
        address: 0x2508097ac78,
    },
    health: {
        address: 0x2508097b064,
    },
    mana: {
        address: 0x2508097b67c,
    },
};
