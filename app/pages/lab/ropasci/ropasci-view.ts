import {Observable} from "tns-core-modules/data/observable";
import {Log} from "~/lib/Log";
import {gData} from "~/lib/Data";
import {GestureEventData} from "tns-core-modules/ui/gestures";
import {fromFile, ImageSource} from "tns-core-modules/image-source";
import {sprintf} from "sprintf-js";
import {msgFailed, msgOK} from "~/lib/ui/messages";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {getFrameById, topmost} from "tns-core-modules/ui/frame";
import {RoPaSciInstance, RoPaSciStruct} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {elRoPaSci, updateRoPaSci} from "~/pages/lab/ropasci/ropasci-page";
import {ObservableArray} from "tns-core-modules/data/observable-array";

export class RopasciView extends Observable {
    ropascis = new ObservableArray();
    networkStatus: string;
    networkStatusShow: boolean = false;

    constructor() {
        super();
    }

    async updateRoPaScis() {
        this.ropascis.splice(0);
        gData.ropascis.map(r => r).reverse().forEach(rps => {
            this.ropascis.push(new RopasciViewElement(rps));
        });
    }

    setProgress(text: string = "", width: number = 0) {
        if (width == 0) {
            elRoPaSci.set("networkStatusShow", false);
        } else {
            elRoPaSci.set("networkStatusShow", true);
            let color = "#308080;";
            if (width < 0) {
                color = "#a04040";
            }
            let pb = topmost().getViewById("progress_bar");
            if (pb) {
                pb.setInlineStyle("width:" + Math.abs(width) + "%; background-color: " + color);
            }
            elRoPaSci.notifyPropertyChange("networkStatus", text);
        }
    }
}

export class RopasciViewElement extends Observable {
    public rps: RoPaSciStruct;

    constructor(public ropasci: RoPaSciInstance) {
        super();
        this.rps = ropasci.roPaSciStruct;
        this.set("description", this.rps.description);
    }

    get stake(): string {
        return this.rps.stake.value.toString();
    }

    get firstMove(): string {
        if (this.ourGame) {
            return "you: " + RopasciViewElement.moveToFAS(this.ropasci.firstMove);
        }
        if (this.rps.firstPlayer < 0) {
            return "other: ?";
        }
        return "other: " + RopasciViewElement.moveToFAS(this.rps.firstPlayer);
    }

    get secondMove(): string {
        if (this.step < 2) {
            if (this.ourGame) {
                return "wait";
            } else {
                return "join";
            }
        }
        return (this.ourGame ? "other: " : "you: ") + RopasciViewElement.moveToFAS(this.rps.secondPlayer);
    }

    get icon(): ImageSource {
        return null;
    }

    get bgcolor(): string {
        return 1 ? "party-participate" : "party-available";
    }

    get nextStep(): string {
        if (this.step == 2 &&
            this.result == 0) {
            return "Draw";
        }
        if (this.ourGame) {
            switch (this.step) {
                case 0:
                    return "Waiting for 2nd player";
                case 1:
                    return "Click to Finalize";
                case 2:
                    return this.result == 1 ? "You won" : "You lost";
            }
        } else {
            switch (this.step) {
                case 0:
                    return "Click to join game";
                case 1:
                    return "Waiting to Finalize";
                case 2:
                    return this.result == 2 ? "You won" : "You lost";
            }
        }
    }

    get stepWidth(): string {
        return sprintf("%d%%", ((this.step + 1) * 33 + 1));
    }

    get ourGame(): boolean {
        return !!this.ropasci.fillUp;
    }

    /**
     * Get the current step of the game:
     * - 0: waiting for second player
     * - 1: waiting for first player to confirm
     * - 2: game finished
     */
    get step(): number {
        if (this.rps.secondPlayer < 0) {
            return 0;
        }
        if (this.rps.firstPlayer < 0) {
            return 1;
        }
        return 2;
    }

    /**
     * Returns the result of the game:
     * - -1: game not finished yet
     * - 0: draw game
     * - 1: player 1 won
     * - 2: player 2 won
     */
    get result(): number {
        if (this.step != 2) {
            return -1;
        }
        return (this.rps.firstPlayer + 3 - this.rps.secondPlayer) % 3;
    }

    async onTap(arg: GestureEventData) {
        let del = "Delete";
        let confirm = "Confirm choice";
        let cancel = "Cancel";
        let playRock = "Play Rock";
        let playPaper = "Play Paper";
        let playScissors = "Play Scissors";
        let choices = [del];
        switch (this.step) {
            case 0:
                if (!this.ourGame) {
                    choices = choices.concat([playRock, playPaper, playScissors]);
                }
                break;
            case 1:
                if (this.ourGame) {
                    choices.unshift(confirm);
                }
                break;
        }
        try {
            switch (await dialogs.action({
                message: "Chose action",
                cancelButtonText: cancel,
                actions: choices,
            })) {
                case del:
                    await gData.delRoPaSci(this.ropasci);
                    break;
                case playRock:
                    elRoPaSci.setProgress("Sending move", 50);
                    await this.ropasci.second(gData.coinInstance, gData.keyIdentitySigner, 0);
                    break;
                case playPaper:
                    elRoPaSci.setProgress("Sending move", 50);
                    await this.ropasci.second(gData.coinInstance, gData.keyIdentitySigner, 1);
                    break;
                case playScissors:
                    elRoPaSci.setProgress("Sending move", 50);
                    await this.ropasci.second(gData.coinInstance, gData.keyIdentitySigner, 2);
                    break;
                case confirm:
                    elRoPaSci.setProgress("Confirming", 50);
                    await this.ropasci.confirm(gData.coinInstance);
                    break;
                case cancel:
                    break;
            }
        } catch (e){
            await msgFailed(e.toString(), "Error");
        }
        await updateRoPaSci();
        elRoPaSci.setProgress();
    }

    static moveToFAS(move: number): string {
        switch (move) {
            case 0:
                return "\uf255";
                break;
            case 1:
                return "\uf256";
                break;
            case 2:
                return "\uf257";
                break;
            default:
                return "invalid";
        }
    }
}
