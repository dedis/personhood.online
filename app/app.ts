/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import {gData} from "~/lib/Data";
import {Defaults} from "~/lib/Defaults";
import {Log} from "~/lib/Log";

application.on("orientationChanged", (evt) => {
    Log.print("Orientation-change:", evt);
});

application.run({moduleName: "app-root"});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
