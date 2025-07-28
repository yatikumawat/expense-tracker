import { saveExpensesToStorage, loadExpensesFromStorage } from './storage.js';

let expenses = [];


export function loadExpenses() {
    const stored = loadExpensesFromStorage();
    expenses = Array.isArray(stored) ? stored : [];
}

function saveExpenses() {
    saveExpensesToStorage(expenses);
}


function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}


export function getAllExpenses() {
    return [...expenses];
}

export function addExpense({ amount, category, description, date }) {
    expenses.push({
        id: generateId(),
        amount: Number(amount),
        category,
        description,
        date
    });
    saveExpenses();
}

export function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveExpenses();
}

export function editExpense(id, updates) {
    const idx = expenses.findIndex(e => e.id === id);
    if (idx === -1) return;
    expenses[idx] = { ...expenses[idx], ...updates, amount: Number(updates.amount ?? expenses[idx].amount) };
    saveExpenses();
}
