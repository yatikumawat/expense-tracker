const STORAGE_KEY = 'expense_tracker_data';


export function saveExpensesToStorage(expenses) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (err) {
        console.error('Failed to save expenses:', err);
    }
}


export function loadExpensesFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('Failed to load expenses:', err);
        return [];
    }
}
