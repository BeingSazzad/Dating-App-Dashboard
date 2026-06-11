function getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

export { getFromLocalStorage };