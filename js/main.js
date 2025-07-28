
document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            var searchValue = searchInput.value.toLowerCase();
            var expenses = JSON.parse(localStorage.getItem('expense_tracker_data') || '[]');
            var filtered = expenses.filter(function(exp) {
                return exp.category.toLowerCase().includes(searchValue) ||
                       exp.description.toLowerCase().includes(searchValue) ||
                       exp.date.toLowerCase().includes(searchValue);
            });
            renderSimpleExpenses(filtered);
        });
    }
});


function renderSimpleExpenses(expenses) {
    var listEl = document.getElementById('expense-list');
    listEl.innerHTML = '';
    if (expenses.length === 0) {
        listEl.innerHTML = '<p>No expenses found.</p>';
    } else {
        expenses.forEach(function(exp) {
            var div = document.createElement('div');
            div.className = 'expense-item';
            div.innerHTML = '<span><strong>' + exp.date + '</strong></span> '
                + '<span>' + exp.category + '</span> '
                + '<span>₹' + Number(exp.amount).toFixed(2) + '</span> '
                + '<span>' + exp.description + '</span>';
            listEl.appendChild(div);
        });
    }
}

import { initUI } from './ui.js';
import { loadExpenses } from './expense.js';


window.addEventListener('DOMContentLoaded', () => {
    
    loadExpenses();
    
    initUI();
});
