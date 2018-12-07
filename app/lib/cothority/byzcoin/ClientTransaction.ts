import {Signer} from "~/lib/cothority/darc/Signer";

export class ClientTransaction{
    instructions: Instruction[];

    constructor(inst: Instruction[]){
        this.instructions = inst;
    }

    signBy(s: Signer[], counter: number[]){}
}

export class Instruction{
    static createSpawn(): Instruction{
        return new Instruction();
    }
    static createInvoke(instID: Buffer, cmd: string, args: Argument[]): Instruction{
        return new Instruction();
    }
    static createDelete(): Instruction{
        return new Instruction();
    }
}

export class Argument{
    name: string;
    value: Buffer;

    constructor (n: string, v: Buffer){
        this.name = n;
        this.value = v;
    }
}

export class Spawn{}
export class Invoke{}
export class Delete{}
