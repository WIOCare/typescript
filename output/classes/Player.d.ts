import type { IsPlayer } from "../interfaces/IsPlayer.js";
export declare class Player implements IsPlayer {
    name: string;
    private age;
    readonly country: string;
    constructor(name: string, age: number, country: string);
    getAge(): number;
    play(): void;
}
//# sourceMappingURL=Player.d.ts.map