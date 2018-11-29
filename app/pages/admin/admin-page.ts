/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {Frame, getFrameById, Page, topmost} from "tns-core-modules/ui/frame";
import {Data} from "~/lib/Data";
import {AdminViewModel} from "./admin-view";
import Log from "~/lib/Log"
import * as dialogs from "tns-core-modules/ui/dialogs";

let d = new Data();

// Event handler for Page "navigatingTo" event attached in identity.xml
export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new AdminViewModel(d);
}

export function tapClear(args: EventData){
    const page = <Page>args.object;
    return dialogs.confirm("Do you really want to delete everything? There is no way back!")
        .then((res) =>{
            if (res){
                return dialogs.confirm("You will lose all your data! No way back!")
                    .then((res)=>{
                        if (res){
                            return dialogs.alert("ALL YOUR DATA HAS BEEN DELETED!")
                                .then(()=>{
                                    return getFrameById("app-root").navigate({
                                        moduleName: "main-page",
                                        // Page navigation, without saving navigation history.
                                        backstackVisible: false
                                    });
                                })
                        }
                    })
            }
        })
}

export function tapCreateParty(args: EventData){
    return dialogs.alert("You need at least 1e7 coins to do that.")
}

export function tapSave(args: EventData){
    Log.print("saving");
}
