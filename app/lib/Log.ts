const util = require("util");
const application = require("application");
import { Buffer } from "buffer/";

const defaultLvl = 2;

const lvlStr = ["E ", "W ", "I ", "!4", "!3", "!2", "!1", "P ", " 1", " 2", " 3", " 4"];

export class LogC {
    _lvl: number;

    constructor(lvl) {
        this._lvl = lvl === undefined ? defaultLvl : lvl;
    }

    joinArgs(args) {
        return args.map((a) => {
            if (typeof a === "string") {
                return a;
            }
            try {
                // return JSON.stringify(a, undefined, 4);
                let type: string = typeof a;
                if (a === Object(a)) {
                    if (a.constructor) {
                        type = a.constructor.name;
                    }
                } else if (type === "o") {
                    console.dir(a);
                }
                if (type === "Uint8Array") {
                    return "{" + type + "}: " + Buffer.from(a).toString("hex");
                }

                return "{" + type + "}: " + util.inspect(a);
            } catch (e) {
                console.log("error while inspecting:", e);

                return a;
            }
        }).join(" ");
    }

    printCaller(err, i) {
        try {
            const stack = err.stack.split("\n");
            let method = [];
            if (application.android) {
                method = stack[i].trim().replace(/^at */, "").split("(");
            } else {
                method = stack[i - 1].trim().split("@");
                if (method.length === 1) {
                    method.push(method[0]);
                    method[0] = "?";
                }
            }
            const file = method[1].replace(/^.*\/|\)$/g, "");

            // @ts-ignore
            return (method[0] + " - " + file).padEnd(40);
        } catch (e) {
            return this.printCaller(new Error("Couldn't get stack - " + err), i + 2);
        }
    }

    printLvl(l, args) {
        if (l <= this._lvl) {
            console.log(lvlStr[l + 7] + ": " + this.printCaller(new Error(), 3) +
                " -> " + this.joinArgs(args));
        }
    }

    print(...args) {
        this.printLvl(0, args);
    }

    lvl1(...args) {
        this.printLvl(1, args);
    }

    lvl2(...args) {
        this.printLvl(2, args);
    }

    lvl3(...args) {
        this.printLvl(3, args);
    }

    lvl4(...args) {
        this.printLvl(4, args);
    }

    llvl1(...args) {
        this.printLvl(-1, args);
    }

    llvl2(...args) {
        this.printLvl(-2, args);
    }

    llvl3(...args) {
        this.printLvl(-3, args);
    }

    llvl4(...args) {
        this.printLvl(-4, args);
    }

    info(...args) {
        this.printLvl(-5, args);
    }

    warn(...args) {
        this.printLvl(-6, args);
    }

    error(...args) {
        this.printLvl(-7, args);
    }

    catch(e, ...args) {
        let errMsg = e;
        if (e.message) {
            errMsg = e.message;
        }
        console.log("C : " + this.printCaller(e, 1) + " -> (" + errMsg + ") " +
            this.joinArgs(args));
    }

    rcatch(e, ...args) {
        let errMsg = e;
        if (e.message) {
            errMsg = e.message;
        }
        console.log("C : " + this.printCaller(e, 1) + " -> (" + errMsg + ") " +
            this.joinArgs(args));
        throw new Error(errMsg.replace(/Error: /, ""));
    }

    set lvl(l) {
        this._lvl = l;
    }

    get lvl() {
        return this._lvl;
    }
}

export let Log = new LogC(2);
export default Log;
