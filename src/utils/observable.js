
export class ObservableEvent {

    constructor(value) {
        this.callbacks =[];
    }

    emit(values) {
        this.callbacks.forEach((callback) => {
            callback(values);
        });
    }

    onEmit(callback) {
        this.callbacks.push(callback);
    }
}

export class ObservableVar {

    constructor(value) {
        this.value = value;
        this.callbacks =[];
    }

    emit(extras) {
        this.callbacks.forEach((callback) => {
            callback(this.value, extras);
        });
    }

    onEmit(callback) {
        this.callbacks.push(callback);
    }

    set(value) {
        this.value = value;
        this.emit();
    }
}

export class ObservableBool extends ObservableVar {
    toggle() {
        this.value = !this.value;
        this.emit();
    }
    true() {
        this.value = true;
        this.emit();
    }
    false() {
        this.value = false;
        this.emit();
    }
}

export class ObservableArray extends ObservableVar {
    push(value) {
        this.value.push(value);
        this.emit();
    }
}

