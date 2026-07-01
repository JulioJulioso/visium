// ===============================
// DATOS
// ===============================

const patients = [

    {
        nombre: "María González",
        edad: 34,
        sexo: "Femenino",
        id: "P-1001",
        consulta: "20/06/2026",
        condicion: "Glaucoma Avanzado",
        color: "red",
        img: "https://i.pravatar.cc/150?img=1"
    },

    {
        nombre: "Carlos Soto",
        edad: 51,
        sexo: "Masculino",
        id: "P-1002",
        consulta: "19/06/2026",
        condicion: "Control Post-Op",
        color: "green",
        img: "https://i.pravatar.cc/150?img=2"
    },

    {
        nombre: "Andrea Pérez",
        edad: 18,
        sexo: "Femenino",
        id: "P-1003",
        consulta: "17/06/2026",
        condicion: "Miopía Progresiva",
        color: "blue",
        img: "https://i.pravatar.cc/150?img=3"
    },

    {
        nombre: "José Ramírez",
        edad: 67,
        sexo: "Masculino",
        id: "P-1004",
        consulta: "16/06/2026",
        condicion: "Cataratas (OD)",
        color: "orange",
        img: "https://i.pravatar.cc/150?img=4"
    }

];

function savePatients() {

    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );

}

function updateDashboard() {

    document.getElementById("totalPatients").textContent =
        patients.length;

}

function loadPatients() {

    const data = localStorage.getItem("patients");

    if (data) {

        patients.length = 0;

        patients.push(...JSON.parse(data));

    }

}

let currentPage = 1;

const rowsPerPage = 3;
loadPatients();
let filteredPatients = [...patients];
let editingIndex = -1;

const tbody = document.getElementById("patientsTable");

const search = document.getElementById("searchPatient");

const pageInfo = document.getElementById("pageInfo");

function renderTable() {

    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;

    const end = start + rowsPerPage;

    const pagePatients = filteredPatients.slice(start, end);

    pagePatients.forEach(p => {

        tbody.innerHTML += `

<tr class="fade">

<td class="patient">

<img src="${p.img}">

<div>

<strong>${p.nombre}</strong>

<small>${p.edad} años · ${p.sexo}</small>

</div>

</td>

<td>${p.id}</td>

<td>${p.consulta}</td>

<td>

<span class="badge ${p.color}">
${p.condicion}
</span>

</td>

<td>

<button
class="menu-btn action-btn"
data-index="${patients.indexOf(p)}">

<i class="fa-solid fa-ellipsis"></i>

</button>

</td>

</tr>

`;

    });


    const totalPages = Math.max(1, Math.ceil(filteredPatients.length / rowsPerPage));

    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    document.getElementById("patientCount").textContent =
        `${filteredPatients.length} registros`;

    const startRecord =
        filteredPatients.length === 0 ? 0 : start + 1;

    const endRecord =
        Math.min(end, filteredPatients.length);

    document.getElementById("paginationText").textContent =
        `Mostrando ${startRecord}-${endRecord} de ${filteredPatients.length} pacientes`;
    updateDashboard();

}

renderTable();

let selectedPatient = -1;

const contextMenu = document.getElementById("contextMenu");

document.addEventListener("click", (e) => {

    if (e.target.closest(".action-btn")) {

        const button = e.target.closest(".action-btn");

        selectedPatient = Number(button.dataset.index);

        contextMenu.style.left = e.pageX + "px";

        contextMenu.style.top = e.pageY + "px";

        contextMenu.classList.add("show");

        return;

    }

    contextMenu.classList.remove("show");

});

search.addEventListener("keyup", () => {

    const text = search.value.toLowerCase();

    filteredPatients = patients.filter(p => {

        return p.nombre.toLowerCase().includes(text)

            || p.id.toLowerCase().includes(text)

            || p.condicion.toLowerCase().includes(text);

    });

    currentPage = 1;

    renderTable();

});

document.getElementById("nextPage").onclick = () => {

    if (currentPage < Math.ceil(filteredPatients.length / rowsPerPage)) {

        currentPage++;

        renderTable();

    }

}

document.getElementById("prevPage").onclick = () => {

    if (currentPage > 1) {

        currentPage--;

        renderTable();

    }

}

// =====================
// MODAL
// =====================

const modal = document.getElementById("patientModal");

const addButton = document.querySelector(".add-patient");

addButton.onclick = () => {

    editingIndex = -1;

    document.getElementById("patientForm").reset();

    modal.classList.add("show");

};

const closeModal = document.getElementById("closeModal");

addButton.onclick = () => {

    modal.classList.add("show");

};

closeModal.onclick = () => {

    modal.classList.remove("show");

};

window.onclick = (e) => {

    if (e.target === modal) {

        modal.classList.remove("show");

    }

};

// =====================
// NUEVO PACIENTE
// =====================

document.getElementById("patientForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const patient = {

        nombre: document.getElementById("name").value,

        edad: document.getElementById("age").value,

        sexo: document.getElementById("gender").value,

        id: document.getElementById("patientId").value,

        consulta: document.getElementById("lastVisit").value,

        condicion: document.getElementById("condition").value,

        color: "blue",

        img: "https://i.pravatar.cc/150?u=" + Date.now()

    };

    if (editingIndex == -1) {

        patients.push(patient);

    } else {

        patients[editingIndex] = patient;

        editingIndex = -1;

    }

    filteredPatients = [...patients];

    currentPage = Math.ceil(filteredPatients.length / rowsPerPage);

    savePatients();

    renderTable();

    document.getElementById("patientForm").reset();

    modal.classList.remove("show");

});

function editPatient(index) {

    editingIndex = index;

    const p = patients[index];

    document.getElementById("name").value = p.nombre;
    document.getElementById("age").value = p.edad;
    document.getElementById("gender").value = p.sexo;
    document.getElementById("patientId").value = p.id;
    document.getElementById("lastVisit").value = p.consulta;
    document.getElementById("condition").value = p.condicion;

    modal.classList.add("show");

}

function deletePatient(index) {

    const ok = confirm(

        "¿Desea eliminar este paciente?"

    );

    if (!ok) return;

    patients.splice(index, 1);

    filteredPatients = [...patients];

    savePatients();

    renderTable();

}

document.getElementById("editPatient").onclick = () => {

    contextMenu.classList.remove("show");

    editPatient(selectedPatient);

};

document.getElementById("deletePatient").onclick = () => {

    contextMenu.classList.remove("show");

    deletePatient(selectedPatient);

};

document.getElementById("recipePatient").onclick = () => {

    contextMenu.classList.remove("show");

    alert("Aquí se abrirá el módulo de recetas.");

};

document.getElementById("viewPatient").onclick = () => {

    contextMenu.classList.remove("show");

    alert("Aquí se abrirá la ficha del paciente.");

};

document.querySelectorAll(".tab").forEach(tab => {

    tab.onclick = () => {

        document.querySelectorAll(".tab")
            .forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        if (tab.dataset.filter === "all") {

            filteredPatients = [...patients];

        } else {

            filteredPatients = patients.filter(p => {

                return p.condicion !== "Inactivo";

            });

        }

        currentPage = 1;

        renderTable();

    }

});