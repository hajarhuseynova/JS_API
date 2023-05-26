const tbody = document.querySelector("tbody");
const companyName = document.getElementById("companyName");
const contactName = document.getElementById("contactName");
const contactTitle = document.getElementById("contactTitle");
const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");

async function getData() {
  let response = await fetch("https://northwind.vercel.app/api/suppliers/");
  let data = await response.json();
  tbody.innerHTML = "";
  data.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${element.id ?? "-"}</td>
    <td>${element.companyName}</td>
    <td>${element.contactName}</td>
    <td>${element.contactTitle}</td>
    `;
    const td = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.addEventListener("click", () => {
      fetch(`https://northwind.vercel.app/api/suppliers/${element.id}`, {
        method: "DELETE",
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          tr.remove();
        }
      });
    });
    const updateButton = document.createElement("button");
    updateButton.textContent = "update";
    td.append(deleteButton, updateButton);
    tr.append(td);
    tbody.appendChild(tr);
  });
}
getData();

function addData(companyName, contactName, contactTitle) {
  fetch("https://northwind.vercel.app/api/suppliers/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyName: companyName,
      contactName: contactName,
      contactTitle: contactTitle,
    }),
  }).then((res) => {
    console.log(res);
  });
}

saveButton.addEventListener("click", () => {
  fetch("https://northwind.vercel.app/api/suppliers/");
  addData(companyName.value, contactName.value, contactTitle.value);
});
