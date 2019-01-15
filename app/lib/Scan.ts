import {BarcodeScanner, ScanResult} from "nativescript-barcodescanner";
import {Log} from "~/lib/Log";

export async function scan(msg: string = "Please scan QRCode"): Promise<ScanResult> {
    return new Promise<ScanResult>(resolve => {
        let barcodescanner = new BarcodeScanner();
        barcodescanner.scan({
            message: "Scan the QR code.",
            showFlipCameraButton: true,
            showTorchButton: true,
            resultDisplayDuration: 1000,
            openSettingsIfPermissionWasPreviouslyDenied: true,
            formats: "QR_CODE, EAN_13",
            cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
            cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
            preferFrontCamera: false,     // default false
            beepOnScan: true,             // Play or Suppress beep on scan (default true)
            torchOn: false,               // launch with the flashlight on (default false)
            closeCallback: () => {
                console.log("Scanner closed")
            }, // invoked when the scanner was closed (success or abort)
            // orientation: orientation,     // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
            // openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
        }).then(result => {
            Log.lvl2("Got scan result", result);
            setTimeout(() => {
                resolve(result);
            }, 1);
            return result;
        });
    });
}

export function parseQRCode(str: string, maxArgs: number): any {
    let url = str.split("?", 2);
    if (url.length != 2) {
        return Promise.reject("wrong QRCode");
    }
    let parts = url[1].split("&", maxArgs);
    let ret = {url: url[0]};
    parts.forEach(p => {
        let r = p.split("=", 2);
        ret[r[0]] = r[1];
    });
    return ret;
}

