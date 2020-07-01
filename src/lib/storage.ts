export abstract class UserEvmInfo {
    static storageKey: string;

    static deserialize(_: any): UserEvmInfo {
        throw new Error("Needs to be overridden");
    }

    static load(storageKey: string = this.storageKey): UserEvmInfo {
        const jsonData = localStorage.getItem(storageKey);
        if (jsonData === null) {
            return null;
        }

        const obj = JSON.parse(jsonData);

        return this.deserialize(obj);
    }

    abstract serialize(): object;

    save() {
        const obj = this.serialize();

        localStorage.setItem(this.getStorageKey(), JSON.stringify(obj));
    }

    protected getStorageKey(): string {
        return "***-undefined-key-***";
    }
}

export class SelectableColl<T> extends UserEvmInfo {
    static deserializeColl<T>(obj: any, cl: any): SelectableColl<T> {
        const coll = obj.map((elem: any) => cl.deserialize(elem) as T);

        return new SelectableColl<T>(coll);
    }

    private _selectedIndex: number = undefined;

    get selectedIndex() {
        return this._selectedIndex;
    }

    get selected(): T {
        if (this.selectedIndex === undefined) {
            return undefined;
        }
        if (this._selectedIndex < 0) {
            throw new Error(`Invalid this._selectedIndex: ${this._selectedIndex} < 0`);
        }
        if (this._selectedIndex >= this.elements.length) {
            throw new Error(`Invalid this._selectedIndex: ${this._selectedIndex} > ${this.elements.length}`);
        }

        return this.elements[this._selectedIndex];
    }

    constructor(readonly elements: T[] = []) {
        super();

        this._selectedIndex = (this.length > 0 ? 0 : undefined);
    }

    select(index: number) {
        if (index < 0) {
            throw new Error(`Invalid index: ${index} < 0`);
        }
        if (index >= this.elements.length) {
            throw new Error(`Invalid index: ${index} > ${this.elements.length}`);
        }

        this._selectedIndex = index;
    }

    add(element: T) {
        this.elements.push(element);
    }

    update(index: number, element: T) {
        if (index < 0) {
            throw new Error(`Invalid index: ${index} < 0`);
        }
        if (index >= this.elements.length) {
            throw new Error(`Invalid index: ${index} > ${this.elements.length}`);
        }

        this.elements[index] = element;
    }

    get length(): number {
        return this.elements.length;
    }

    serialize(): object {
        return this.elements.map((elem) => {
            if (elem instanceof UserEvmInfo) {
                return (elem as UserEvmInfo).serialize();
            } else {
                return elem;
            }
        });
    }
}
