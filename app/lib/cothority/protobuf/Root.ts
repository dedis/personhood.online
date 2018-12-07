import {Log} from "~/lib/Log";

const jsonDescriptor = require("./models.json");
const protobufjs = require("protobufjs/light");
export const Root = protobufjs.Root.fromJSON(jsonDescriptor);

export function objToProto(obj: object, modelName: string): Buffer {
    const requestModel = Root.lookup(modelName);
    const errMsg = requestModel.verify(obj);
    if (errMsg) {
        Log.error("couldn't verify data:", errMsg);
        throw new Error(errMsg);
    }
    const message = requestModel.create(obj);
    const marshal = requestModel.encode(message).finish();
    return new Buffer(marshal.slice());
}
