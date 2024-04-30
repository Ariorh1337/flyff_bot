import { data } from "./mem-config";
import { timer } from "./timer";

export default class Memory {
    public readonly memory: any;
    public buffer!: ArrayBuffer;
    public uint8!: Uint8Array;
    public data = data;

    constructor(memory: any) {
        this.memory = memory;
        this.update();
    }

    public update() {
        this.buffer = this.memory.buffer;
        this.uint8 = new Uint8Array(this.buffer);
    }

    public read(
        adress: number,
        offset: number
    ): { hex: string[]; int: number[] } {
        const result = {
            hex: [] as string[],
            int: [] as number[],
        };

        for (let i = 0; i < offset; i++) {
            const int = this.uint8[adress + i];
            const hex = int.toString(16).split("");

            if (hex.length < 2) hex.unshift(`${0}`);

            result.hex.push(hex.join(""));
            result.int.push(int);
        }

        result.hex.reverse();

        return result;
    }

    public read4byte(adress: number): {
        hex: string;
        int: number;
        float: number;
    } {
        const data = this.read(adress, 4);
        const hex = data.hex.join("");
        const int = parseInt(hex, 16);
        const float = this.parseFloat(hex);

        return { hex, int, float };
    }

    public async search4byte(
        value: number,
        from = 0,
        to = this.uint8.length
    ): Promise<number[]> {
        const result = [];
        let now = new Date().getTime();

        for (let i = from; i < to; i++) {
            if (i % 4) continue;

            const time = new Date().getTime();
            if (time - now > 100) {
                now = time;
                await timer(5);
            }

            try {
                const data = this.read4byte(i);

                if (data.int === value) {
                    result.push(i);
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        return result;
    }

    public async prepareOffsets() {
        const offset_adress = await this.search4byte(
            this.data.offset.value,
            0x00010000,
            0x01000000
        );

        if (!offset_adress.length) return;

        this.data.offset.offset = this.data.offset.address - offset_adress[0];
    }

    private parseFloat(str: string): number {
        let float = 0;
        let sign;
        let mantissa;
        let exp;
        let int = 0;

        if (!/^0x/.exec(str)) {
            str = `0x${str}`;
        }

        int = parseInt(str, 16);
        sign = int >>> 31 ? -1 : 1;
        exp = ((int >>> 23) & 0xff) - 127;
        mantissa = ((int & 0x7fffff) + 0x800000).toString(2);

        for (let i = 0; i < mantissa.length; i += 1) {
            float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
            exp--;
        }

        return float * sign;
    }
}
