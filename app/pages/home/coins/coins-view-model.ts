import {fromObjectRecursive, Observable} from "data/observable";
import {ObservableArray} from "tns-core-modules/data/observable-array";

export let CoinsViewModel: Observable = fromObjectRecursive({
        balance: 0,
        qrcode: undefined,
        networkStatus: undefined
    }
)