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
    deleteButton.className = "deleteButton";
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
    updateButton.className = "updateButton";
    updateButton.textContent = "update";
    updateButton.addEventListener("click", () => {
      saveButton.disabled = true;
      saveButton.style.backgroundColor = "#ddb892";
      companyName.value = element.companyName;
      contactName.value = element.contactName;
      contactTitle.value = element.contactTitle;
      editButton.addEventListener("click", () => {
        saveButton.disabled = false;
        saveButton.style.backgroundColor = "#7f5539";
        fetch(`https://northwind.vercel.app/api/suppliers/${element.id}`);
        editSupplier(
          element.id,
          companyName.value,
          contactName.value,
          contactTitle.value
        );
      });
    });
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
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      resetInput();
      console.log(data);
      tbody.innerHTML += `
      <tr>
        <td>${data.id}</td>
        <td>${data.companyName}</td>
        <td>${data.contactName}</td>
        <td>${data.contactTitle}</td>
      </tr>
    `;
    });
}
async function editSupplier(id, companyName, contactName, contactTitle) {
  const response = await fetch(
    `https://northwind.vercel.app/api/suppliers/${id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: companyName,
        contactName: contactName,
        contactTitle: contactTitle,
      }),
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      resetInput();
      console.log(data);
      tbody.innerHTML += `
      <tr>
        <td>${data.id}</td>
        <td>${companyName.value}</td>
        <td>${contactName.value}</td>
        <td>${contactTitle.value}</td>
      </tr>
    `;
    });
}

saveButton.addEventListener("click", () => {
  fetch("https://northwind.vercel.app/api/suppliers/");
  addData(companyName.value, contactName.value, contactTitle.value);
});

function resetInput() {
  companyName.value = "";
  contactName.value = "";
  contactTitle.value = "";
}
