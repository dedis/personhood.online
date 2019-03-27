// import WebSocket from "isomorphic-ws";
import Logger from "../log";
import {NativescriptWebSocketAdapter} from "~/lib/network/nativescript-ws";

/**
 * An adapter to use any kind of websocket and interface it with
 * a browser compatible type of websocket
 */
export abstract class WebSocketAdapter {
    readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    /**
     * Event triggered after the websocket successfully opened
     * @param callback Function called after the event
     */
    abstract onOpen(callback: () => void): void;

    /**
     * Event triggered after a message is received
     * @param callback Function called with the message as a data buffer
     */
    abstract onMessage(callback: (data: Buffer) => void): void;

    /**
     * Event triggered after the websocket has closed
     * @param callback Function called after the closure
     */
    abstract onClose(callback: (code: number, reason: string) => void): void;

    /**
     * Event triggered when an error occured
     * @param callback Function called with the error
     */
    abstract onError(callback: (err: Error) => void): void;

    /**
     * Send a buffer over the websocket connection
     * @param bytes The data to send
     */
    abstract send(bytes: Buffer): void;

    /**
     * Close the websocket connection
     * @param code The code to use when closing
     */
    abstract close(code: number, reason?: string): void;
}

/**
 * This adapter basically binds the browser websocket interface. Note that
 * the websocket will try to open right after instantiation.
 */
export class BrowserWebSocketAdapter extends NativescriptWebSocketAdapter {
    constructor(path: string) {
        super(path);
    }
}
