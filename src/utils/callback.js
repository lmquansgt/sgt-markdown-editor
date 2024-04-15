export const callbackPerSeconds = (hook, seconds) => {
    return setTimeout(() => {
        hook();
    }, seconds * 1000);
};

export const getCallback = (callback, ...args) => {
    return () => callback(...args);
};
