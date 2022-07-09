interface Array<T> {
    sort(): T[]
}

interface ErrorConstructor {
    new(message?: string): Error
}

declare let Error: ErrorConstructor;
