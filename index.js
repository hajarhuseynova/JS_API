const tbody = document.querySelector("tbody");
const companyName = document.getElementById("companyName");
const contactName = document.getElementById("contactName");
const contactTitle = document.getElementById("contactTitle");
const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");
const companyAlert = document.getElementById("companyAlert");
const contactNameAlert = document.getElementById("contactNameAlert");
const contactTitleAlert = document.getElementById("contactTitleAlert");
let selectedElementId = -1;

function keyups() {
  let regex = /[a-zA-Z0-9]/g;
  companyName.addEventListener("keyup", () => {
    companyAlert.style.opacity = "1";
    if (regex.test(companyName.value)) {
      companyAlert.style.opacity = "0";
    }
  });
  contactName.addEventListener("keyup", () => {
    contactNameAlert.style.opacity = "1";
    if (regex.test(contactName.value)) {
      contactNameAlert.style.opacity = "0";
    }
  });
  contactTitle.addEventListener("keyup", () => {
    contactTitleAlert.style.opacity = "1";
    if (regex.test(contactTitle.value)) {
      contactTitleAlert.style.opacity = "0";
    }
  });
}
keyups();
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
    //delete
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
    //update
    const updateButton = document.createElement("button");
    updateButton.className = "updateButton";
    updateButton.textContent = "update";
    //listener
    updateButton.addEventListener("click", () => {
      contactNameAlert.style.opacity = "0";
      companyAlert.style.opacity = "0";
      contactTitleAlert.style.opacity = "0";
      saveButton.disabled = true;
      saveButton.style.backgroundColor = "#ddb892";
      companyName.value = element.companyName;
      contactName.value = element.contactName;
      contactTitle.value = element.contactTitle;
      selectedElementId = element.id;
    });
    td.append(deleteButton, updateButton);
    tr.append(td);
    tbody.appendChild(tr);
  });
}
getData();

function addData(companyName_, contactName_, contactTitle_) {
  fetch("https://northwind.vercel.app/api/suppliers/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyName: companyName_,
      contactName: contactName_,
      contactTitle: contactTitle_,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      resetInput();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.id}</td>
        <td>${data.companyName}</td>
        <td>${data.contactName}</td>
        <td>${data.contactTitle}</td>
    `;
      const td = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "delete";
      deleteButton.addEventListener("click", () => {
        fetch(`https://northwind.vercel.app/api/suppliers/${data.id}`, {
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
      updateButton.addEventListener("click", () => {
        companyName.value = data.companyName;
        contactName.value = data.contactName;
        contactTitle.value = data.contactTitle;
        selectedElementId = data.id;
        editButton.addEventListener("click", () => {
          saveButton.disabled = false;
          saveButton.style.backgroundColor = "#7f5539";
          console.log(1);
          editSupplier(
            data.id,
            companyName.value,
            contactName.value,
            contactTitle.value
          );
          resetInput();
        });
      });
      tr.append(td);
      td.append(deleteButton, updateButton);
      tbody.append(tr);
    });
}

async function editSupplier(id, companyName_, contactName_, contactTitle_) {
  console.log(2);
  const response = await fetch(
    `https://northwind.vercel.app/api/suppliers/${id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: companyName_,
        contactName: contactName_,
        contactTitle: contactTitle_,
      }),
    }
  );
}

editButton.addEventListener("click", () => {
  saveButton.disabled = false;
  saveButton.style.backgroundColor = "#7f5539";
  fetch(`https://northwind.vercel.app/api/suppliers/${selectedElementId}`);
  editSupplier(
    selectedElementId,
    companyName.value,
    contactName.value,
    contactTitle.value
  );
  selectedElementId = -1;
  resetInput();
  getData();
});

saveButton.addEventListener("click", () => {
  if (
    companyName.value == "" ||
    contactName.value == "" ||
    contactTitle.value == ""
  ) {
    alert("Please,fill the all gap.");
    return;
  } else {
    fetch("https://northwind.vercel.app/api/suppliers/");
    addData(companyName.value, contactName.value, contactTitle.value);
    resetInput();
    companyAlert.style.opacity = "1";
    contactNameAlert.style.opacity = "1";
    contactTitleAlert.style.opacity = "1";
  }
});

function resetInput() {
  companyName.value = "";
  contactName.value = "";
  contactTitle.value = "";
}
