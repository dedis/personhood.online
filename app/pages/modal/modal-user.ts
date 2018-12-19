import {fromObject} from "tns-core-modules/data/observable";
import {Page} from "tns-core-modules/ui/page";
import {User} from "~/lib/User";

let closeCallback: Function;

export function onShownModally(args) {
    const user = <User>args.context;
    closeCallback = args.closeCallback;
    const page: Page = <Page>args.object;
    page.bindingContext = fromObject({
        qrcode: user.qrcodeIdentity(),
        alias: user.alias
    });
}

export async function goBack() {
    closeCallback();
}