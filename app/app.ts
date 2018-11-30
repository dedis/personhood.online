/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import {Data, gData} from "~/lib/Data";
import Log from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";


gData.load().then(() => {
    Log.print("Data loaded");
    if (Defaults.Alias) {
        gData.alias = Defaults.Alias;
    }
    application.run({moduleName: "app-root"});
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
