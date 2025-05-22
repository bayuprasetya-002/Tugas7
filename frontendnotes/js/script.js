const BASE_URL = "http://localhost:5000";

let accessToken = null;

// DOM Elements
const authContainer = document.getElementById("auth-container");
const registerContainer = document.getElementById("register-container");
const notesContainer = document.getElementById("notes-container");

const loginUsernameEmail = document.getElementById("login-username-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const showRegisterBtn = document.getElementById("show-register-btn");

const registerUsername = document.getElementById("register-username");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerBtn = document.getElementById("register-btn");
const showLoginBtn = document.getElementById("show-login-btn");

const logoutBtn = document.getElementById("logout-btn");

const noteForm = document.getElementById("note-form");
const inputJudul = document.getElementById("judul");
const inputDeskripsi = document.getElementById("deskripsi");
const tableNotesBody = document.getElementById("table-notes");

// UI toggle functions
function showLoginUI() {
  authContainer.classList.remove("hidden");
  registerContainer.classList.add("hidden");
  notesContainer.classList.add("hidden");
}

function showRegisterUI() {
  authContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
  notesContainer.classList.add("hidden");
}

function showNotesUI() {
  authContainer.classList.add("hidden");
  registerContainer.classList.add("hidden");
  notesContainer.classList.remove("hidden");
  clearNoteForm();
}

// Event listeners for UI switch
showRegisterBtn.addEventListener("click", showRegisterUI);
showLoginBtn.addEventListener("click", showLoginUI);

// Register function
registerBtn.addEventListener("click", async () => {
  const username = registerUsername.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;

  if (!username || !email || !password) {
    alert("Semua kolom harus diisi!");
    return;
  }

  try {
    await axios.post(`${BASE_URL}/register`, { username, email, password });
    alert("Registrasi berhasil! Silakan login.");
    registerUsername.value = "";
    registerEmail.value = "";
    registerPassword.value = "";
    showLoginUI();
  } catch (error) {
    alert(error.response?.data?.message || "Registrasi gagal.");
  }
});

// Login function
loginBtn.addEventListener("click", async () => {
  const usernameOrEmail = loginUsernameEmail.value.trim();
  const password = loginPassword.value;

  if (!usernameOrEmail || !password) {
    alert("Semua kolom harus diisi!");
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/login`, { usernameOrEmail, password });
    accessToken = res.data.accessToken;
    alert("Login berhasil!");
    loginUsernameEmail.value = "";
    loginPassword.value = "";
    showNotesUI();
    await loadNotes();
  } catch (error) {
    alert(error.response?.data?.message || "Login gagal.");
  }
});

// Logout function
logoutBtn.addEventListener("click", () => {
  accessToken = null;
  showLoginUI();
  clearNoteForm();
  tableNotesBody.innerHTML = "";
});

// Load notes function
async function loadNotes() {
  if (!accessToken) {
    alert("Anda harus login terlebih dahulu!");
    showLoginUI();
    return;
  }
  try {
    const res = await axios.get(`${BASE_URL}/notes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    displayNotes(res.data);
  } catch (error) {
    alert("Gagal mengambil data catatan, silakan login ulang.");
    logoutBtn.click();
  }
}

// Display notes in table
function displayNotes(notes) {
  tableNotesBody.innerHTML = "";
  let no = 1;
  for (const note of notes) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${no}</td>
      <td class="judul">${note.judul}</td>
      <td class="deskripsi">${note.deskripsi}</td>  <!-- Kolom deskripsi ditambahkan -->
      <td>${formatDate(note.createdAt)}</td>
      <td>
        <button class="btn-edit" data-id="${note.id}">Edit</button>
        <button class="btn-delete" data-id="${note.id}">Hapus</button>
      </td>
    `;
    tableNotesBody.appendChild(tr);
    no++;
  }
  addEventListenersToButtons();
}

// Format date
function formatDate(timestamp) {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  return date.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

// Add event listeners to edit & delete buttons
function addEventListenersToButtons() {
  document.querySelectorAll(".btn-edit").forEach((btn) =>
    btn.addEventListener("click", () => editNote(btn.dataset.id))
  );
  document.querySelectorAll(".btn-delete").forEach((btn) =>
    btn.addEventListener("click", () => deleteNote(btn.dataset.id))
  );
}

// Edit note function
async function editNote(id) {
  try {
    const res = await axios.get(`${BASE_URL}/notes/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const note = res.data;
    inputJudul.dataset.id = note.id;
    inputJudul.value = note.judul;
    inputDeskripsi.value = note.deskripsi;
  } catch {
    alert("Gagal mengambil data catatan");
  }
}

// Delete note function
async function deleteNote(id) {
  if (!confirm("Yakin ingin menghapus catatan ini?")) return;
  try {
    await axios.delete(`${BASE_URL}/notes/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    alert("Catatan berhasil dihapus");
    loadNotes();
  } catch {
    alert("Gagal menghapus catatan");
  }
}

// Submit form (Add / Update note)
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const judul = inputJudul.value.trim();
  const deskripsi = inputDeskripsi.value.trim();
  const id = inputJudul.dataset.id;

  if (!judul || !deskripsi) {
    alert("Harap isi semua kolom!");
    return;
  }

  try {
    if (!id || id === "") {
      await axios.post(
        `${BASE_URL}/notes`,
        { judul, deskripsi },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Catatan berhasil ditambahkan");
    } else {
      await axios.put(
        `${BASE_URL}/notes/${id}`,
        { judul, deskripsi }, // Tidak kirim tanggal
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Catatan berhasil diperbarui");
    }
    clearNoteForm();
    loadNotes();
  } catch {
    alert("Gagal menyimpan catatan");
  }
});

// Display notes in table (pastikan pakai updatedAt)
function displayNotes(notes) {
  tableNotesBody.innerHTML = "";
  let no = 1;
  for (const note of notes) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${no}</td>
      <td class="judul">${note.judul}</td>
      <td class="deskripsi">${note.deskripsi}</td>
      <td>${formatDate(note.updatedAt)}</td>  <!-- gunakan updatedAt -->
      <td>
        <button class="btn-edit" data-id="${note.id}">Edit</button>
        <button class="btn-delete" data-id="${note.id}">Hapus</button>
      </td>
    `;
    tableNotesBody.appendChild(tr);
    no++;
  }
  addEventListenersToButtons();
}


// Clear note form
function clearNoteForm() {
  inputJudul.value = "";
  inputDeskripsi.value = "";
  inputJudul.dataset.id = "";
}

// Initialize app by showing login UI
showLoginUI();
