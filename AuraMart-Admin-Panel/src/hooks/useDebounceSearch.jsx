export default function useDebounceSearch(func, delay = 500) {
    let timeout;

    return (...args) => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            func(...args);
        }, delay);;
    }
}