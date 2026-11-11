let transactions = JSON.parse(localStorage.getItem("money_manager_data")) || [];

const form = document.getElementById("transactionForm");
const rows = document.getElementById("transactionRows");
const filterType = document.getElementById("filterType");

function saveAndRender() {
  localStorage.setItem("money_manager_data", JSON.stringify(transactions));
  render();
}

function render() {
  let income = 0;
  let expense = 0;
  rows.innerHTML = "";

  const selectedFilter = filterType.value;

  transactions.forEach((item, index) => {
    if (item.type === "income") income += item.amount;
    if (item.type === "expense") expense += item.amount;

    if (selectedFilter !== "all" && item.type !== selectedFilter) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.description}</td>
      <td>${item.type === "income" ? "Pemasukan" : "Pengeluaran"}</td>
      <td class="${item.type === "income" ? "text-success" : "text-danger"}">
        Rp ${item.amount.toLocaleString("id-ID")}
      </td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${index})">Hapus</button>
      </td>
    `;
    rows.appendChild(tr);
  });

  document.getElementById("balanceValue").textContent = `Rp ${(income - expense).toLocaleString("id-ID")}`;
  document.getElementById("incomeValue").textContent = `Rp ${income.toLocaleString("id-ID")}`;
  document.getElementById("expenseValue").textContent = `Rp ${expense.toLocaleString("id-ID")}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTransaction = {
    type: document.getElementById("type").value,
    description: document.getElementById("description").value,
    amount: Number(document.getElementById("amount").value),
    date: document.getElementById("date").value,
  };

  transactions.push(newTransaction);
  saveAndRender();
  form.reset();
  document.getElementById("date").valueAsDate = new Date();
});

function deleteTransaction(index) {
  if (confirm("Hapus transaksi ini?")) {
    transactions.splice(index, 1);
    saveAndRender();
  }
}

filterType.addEventListener("change", render);

document.getElementById("date").valueAsDate = new Date();
render();