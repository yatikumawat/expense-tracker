import { getAllExpenses, addExpense, deleteExpense, editExpense } from './expense.js';


export function initUI() {
    if (!document.getElementById('add-expense')) return;
    renderExpenses();

    
    document.getElementById('add-expense').addEventListener('click', handleAddExpense);

   
    document.getElementById('expense-list').addEventListener('click', handleListClick);

    
    document.getElementById('search').addEventListener('input', debounce(handleSearch, 300));
}


function handleAddExpense() {
    const amount = document.getElementById('amount').value.trim();
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value.trim();

    if (!amount || !category || !description || !date || Number(amount) <= 0) {
        alert('Please fill all fields with valid values');
        return;
    }

    addExpense({
        amount: parseFloat(amount),
        category,
        description,
        date,
    });

    
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';

    
    renderExpenses();
}


function handleListClick(e) {
    const target = e.target;
    const id = target.closest('.expense-item')?.dataset.id;
    if (!id) return;

    if (target.classList.contains('delete-btn')) {
        if (confirm('Delete this expense?')) {
            deleteExpense(id);
            renderExpenses();
        }
    } else if (target.classList.contains('edit-btn')) {
        startEditExpense(id);
    }
}


export function renderExpenses(filtered=null) {
    const expenses = filtered || getAllExpenses();
    const listEl = document.getElementById('expense-list');
    listEl.innerHTML = '';

    if (expenses.length === 0) {
        listEl.innerHTML = '<p>No expenses found.</p>';
    } else {
        expenses.forEach(exp => {
            // Each expense row
            const div = document.createElement('div');
            div.className = 'expense-item';
            div.dataset.id = exp.id;

            div.innerHTML = `
                <span><strong>${exp.date}</strong></span>
                <span>${exp.category}</span>
                <span>₹${Number(exp.amount).toFixed(2)}</span>
                <span>${exp.description}</span>
                <button class="edit-btn" type="button">Edit</button>
                <button class="delete-btn" type="button">Delete</button>
            `;
            listEl.appendChild(div);
        });
    }

    updateTotal(expenses);
    updateCategorySummary(expenses);
}


function updateTotal(expenses) {
    const sum = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
    document.getElementById('total').textContent = sum.toFixed(2);
}


function updateCategorySummary(expenses) {
    const summaryEl = document.getElementById('category-summary');
    summaryEl.innerHTML = '';
    const summary = {};

    expenses.forEach(exp => {
        summary[exp.category] = (summary[exp.category] || 0) + Number(exp.amount);
    });

    for (const [cat, amt] of Object.entries(summary)) {
        const li = document.createElement('li');
        li.textContent = `${cat}: ₹${amt.toFixed(2)}`;
        summaryEl.appendChild(li);
    }
}


function startEditExpense(id) {
    const exp = getAllExpenses().find(e => e.id === id);
    if (!exp) return;
    const newAmount = prompt('Edit amount:', exp.amount);
    const newCategory = prompt('Edit category:', exp.category);
    const newDescription = prompt('Edit description:', exp.description);
    const newDate = prompt('Edit date (YYYY-MM-DD):', exp.date);

    if (
        newAmount &&
        newCategory &&
        newDescription &&
        newDate &&
        Number(newAmount) > 0
    ) {
        editExpense(id, {
            amount: Number(newAmount),
            category: newCategory.trim(),
            description: newDescription.trim(),
            date: newDate.trim(),
        });
        renderExpenses();
    }
}


function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}


function handleSearch(e) {
    const search = e.target.value.trim().toLowerCase();
    const filtered = getAllExpenses().filter(exp =>
        exp.category.toLowerCase().includes(search) ||
        exp.description.toLowerCase().includes(search) ||
        exp.date.toLowerCase().includes(search)
    );
    renderExpenses(filtered);
}
