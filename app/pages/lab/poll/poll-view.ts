import {fromObject, Observable} from "tns-core-modules/data/observable";
import {Log} from "~/lib/Log";
import {gData} from "~/lib/Data";
import {GestureEventData} from "tns-core-modules/ui/gestures";
import {fromFile, ImageSource} from "tns-core-modules/image-source";
import {sprintf} from "sprintf-js";
import {msgFailed, msgOK} from "~/lib/ui/messages";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {getFrameById, topmost} from "tns-core-modules/ui/frame";
import {elPoll, updatePoll} from "~/pages/lab/poll/poll-page";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {PersonhoodRPC, PollChoice, PollStruct} from "~/lib/PersonhoodRPC";

export class PollView extends Observable {
    polls = new ObservableArray();
    networkStatus: string;
    networkStatusShow: boolean = false;

    constructor() {
        super();
    }

    async updatePolls() {
        this.polls.splice(0);
        gData.polls.map(r => r).reverse().forEach(rps => {
            this.polls.push(new PollViewElement(rps));
        });
        this.set("polls", this.polls);
    }

    setProgress(text: string = "", width: number = 0) {
        if (width == 0) {
            elPoll.set("networkStatusShow", false);
        } else {
            elPoll.set("networkStatusShow", true);
            let color = "#308080;";
            if (width < 0) {
                color = "#a04040";
            }
            let pb = topmost().getViewById("progress_bar");
            if (pb) {
                pb.setInlineStyle("width:" + Math.abs(width) + "%; background-color: " + color);
            }
            elPoll.notifyPropertyChange("networkStatus", text);
        }
    }
}

export class PollViewElement extends Observable {
    public choices = new ObservableArray();

    constructor(public poll: PollStruct) {
        super();
        poll.choices.forEach((_, c) => {
            for (let i = 0; i < c; i++) {
                poll.chosen.push(new PollChoice(c, Buffer.alloc(0)));
            }
        });
        poll.choices.forEach((_, c) => {
            this.choices.push(new PollChoiceElement(poll, c));
        });
        this.set("height", 30 * poll.choices.length);
    }

    async onTap(arg: GestureEventData) {
        let del = "Delete";
        let cancel = "Cancel";
        let choices = this.poll.choices.map(c => "Send vote for " + c);
        choices.push(del);
        try {
            let action = await dialogs.action({
                message: "Chose action",
                cancelButtonText: cancel,
                actions: choices,
            });
            switch (action) {
                case del:
                    await gData.delPoll(this.poll);
                    break;
                case cancel:
                    break;
                default:
                    let index = choices.findIndex(c => c == action);
                    let phr = new PersonhoodRPC(gData.bc);
                    let badge = gData.badges.find(p => {
                        return p.party.partyInstance.iid.equals(this.poll.personhood)
                    });
                    if (badge == null){
                        await msgFailed("Invalid poll with invalid partyID");
                        return;
                    }
                    await phr.pollAnswer(gData.keyPersonhood._private, badge.party, this.poll.pollID, index);
            }
        } catch (e) {
            await msgFailed(e.toString(), "Error");
        }
        await updatePoll();
        elPoll.setProgress();
    }
}

export class PollChoiceElement extends Observable {
    constructor(poll: PollStruct, index: number) {
        super();
        let max = poll.choices.reduce((prev: number, _, curr: number) => {
            return Math.max(prev, poll.choiceCount(curr));
        }, 1);
        this.set('label', poll.choices[index]);
        let chosen = poll.chosen.filter(c => c.choice == index).length;
        this.set('counts', poll.choiceCount(index));
        this.set('bar', Math.round(chosen * 100. / max).toString() + "%");
    }

    onTap(arg: GestureEventData) {
    }
}