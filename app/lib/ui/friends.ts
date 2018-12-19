import {scan} from "~/lib/Scan";
import {Log} from "~/lib/Log";
import {Data, gData} from "~/lib/Data";
import {User} from "~/lib/User";

export async function scanNewUser(d: Data): Promise<User> {
    let str = await scan("Scan Identity Code");
    Log.lvl2("Got string scanned:", str);
    let user = await User.fromQR(d.bc, str.text);
    await d.addUser(user);

    return user;
}
