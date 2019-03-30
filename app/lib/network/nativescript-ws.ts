import Logger from "~/lib/cothority/log";
import {WebSocketAdapter} from "~/lib/cothority/network";
require("nativescript-websockets");

/**
 * This adapter basically binds the browser websocket interface. Note that
 * the websocket will try to open right after instantiation.
 */
export class NativescriptWebSocketAdapter extends WebSocketAdapter {
    private ws: any;

    constructor(path: string) {
        super(path);
        this.ws = new WebSocket(path);
        // to prevent the browser to use blob
        this.ws.binaryType = "arraybuffer";
    }

    /** @inheritdoc */
    onOpen(callback: () => void): void {
        this.ws.onopen = callback;
    }

    /** @inheritdoc */
    onMessage(callback: (data: any) => void): void {
        this.ws.onmessage = (evt: { data: Buffer }): any => {
            if (evt.data instanceof ArrayBuffer || evt.data instanceof Buffer) {
                callback(Buffer.from(evt.data));
            } else {
                // In theory, any type of data could be sent through but we only
                // allow protobuf encoded messages
                Logger.lvl2(`got an unknown websocket message type: ${typeof evt.data}`);
            }
        };
    }

    /** @inheritdoc */
    onClose(callback: (code: number, reason: string) => void): void {
        this.ws.onclose = (evt: { code: number, reason: string }) => {
            callback(evt.code, evt.reason);
        };
    }

    /** @inheritdoc */
    onError(callback: (err: Error) => void): void {
        this.ws.onerror = (evt: { err: Error }) => {
            callback(evt.err);
        };
    }

    /** @inheritdoc */
    send(bytes: Buffer): void {
        this.ws.send(bytes);
    }

    /** @inheritdoc */
    close(code: number, reason = ""): void {
        this.ws.close(code, reason);
    }
}