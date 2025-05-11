// Mengambil elemen form
const formulir = document.querySelector("form");

formulir.addEventListener("submit", (e) => {
    e.preventDefault();

    // Mengambil elemen input
    const elemen_judul = document.querySelector("#judul");
    const elemen_deskripsi = document.querySelector("#deskripsi");

    // Mengambil value dari elemen input
    const judul = elemen_judul.value.trim();
    const deskripsi = elemen_deskripsi.value.trim();
    const id = elemen_judul.dataset.id; // <- Khusus edit

    if (!judul || !deskripsi) {
        alert("Harap isi semua kolom!");
        return;
    }

    // Mengambil waktu saat ini dalam format ISO
    const tanggalEdit = new Date().toISOString(); 

    // Mengecek apakah harus POST atau PUT
    if (!id || id === "") {
        // Tambah catatan baru dengan tanggal sekarang
        axios
            .post(`${BASE_URL}/notes`, { 
                judul, 
                deskripsi, 
                tanggal: tanggalEdit // Menyimpan waktu sekarang dengan format ISO
            })
            .then(() => {
                // Bersihkan form
                elemen_judul.value = "";
                elemen_deskripsi.value = "";
                elemen_judul.dataset.id = "";

                // Refresh data
                getNotes();
            })
            .catch((error) => console.log(error.message));
    } else {
        // Edit catatan (update tanggal juga)
        axios
            .put(`${BASE_URL}/notes/${id}`, { 
                judul, 
                deskripsi, 
                tanggal: tanggalEdit // Mengirimkan tanggal baru saat pengeditan
            })
            .then(() => {
                // Bersihkan form setelah update
                elemen_judul.dataset.id = "";
                elemen_judul.value = "";
                elemen_deskripsi.value = "";

                // Menampilkan pesan sukses
                alert("Catatan berhasil diperbarui!");

                // Refresh data dan memastikan pop-up juga menggunakan data terbaru
                getNotes();
            })
            .catch((error) => console.log(error));
    }
});

// Fungsi GET untuk mengambil data dan menampilkan tanggal yang benar
async function getNotes() {
    try {
        const { data } = await axios.get(`${BASE_URL}/notes`);

        const table = document.querySelector("#table-notes");
        let tampilan = "";
        let no = 1;

        for (const note of data) {
            tampilan += tampilkanNote(no, note);
            no++;
        }
        table.innerHTML = tampilan;
        hapusNote();
        editNote();
    } catch (error) {
        console.log(error.message);
    }
}

function tampilkanNote(no, note) {
    return `
        <tr onclick="openModal('${note.id}', '${note.judul}', '${note.deskripsi}')">
            <td>${no}</td>
            <td class="judul">${note.judul}</td>
            <td class="tanggal">${formatDate(note.createdAt)}</td>
            <td class="deskripsi" style="display: none;">${note.deskripsi}</td>
            <td>
                <button data-id=${note.id} class='btn-edit'>
                    <i class="fas fa-edit icon"></i> Edit
                </button>
                <button data-id=${note.id} class='btn-hapus'>
                    <i class="fas fa-trash icon"></i> Hapus
                </button>
            </td>
        </tr>
    `;
}

// Format tanggal menjadi DD/MM/YYYY HH:mm
function formatDate(timestamp) {
    if (!timestamp || isNaN(new Date(timestamp).getTime())) return "-"; // Jika null, tampilkan "-"
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

// Hapus catatan
function hapusNote() {
    const kumpulan_tombol_hapus = document.querySelectorAll(".btn-hapus");

    kumpulan_tombol_hapus.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;

            if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;

            axios
                .delete(`${BASE_URL}/notes/${id}`)
                .then(() => getNotes())
                .catch((error) => console.log(error));
        });
    });
}

// Edit catatan
function editNote() {
    const kumpulan_tombol_edit = document.querySelectorAll(".btn-edit");

    kumpulan_tombol_edit.forEach((tombol_edit) => {
        tombol_edit.addEventListener("click", (e) => {
            e.stopPropagation();

            // Mengambil nilai dari baris catatan yang dipilih
            const id = tombol_edit.dataset.id;
            const judul = tombol_edit.parentElement.parentElement.querySelector(".judul").innerText;
            const deskripsi = tombol_edit.parentElement.parentElement.querySelector(".deskripsi")?.innerText || ""; // pastikan elemen deskripsi ada

            // Mengambil elemen form
            const elemen_judul = document.querySelector("#judul");
            const elemen_deskripsi = document.querySelector("#deskripsi");

            // Menampilkan data yang ada pada form untuk diedit
            elemen_judul.dataset.id = id;
            elemen_judul.value = judul;
            elemen_deskripsi.value = deskripsi; // Menambahkan deskripsi ke input
        });
    });
}

// Modal untuk membaca catatan
function openModal(id, judul, deskripsi) {
    document.getElementById("modal-title").innerText = judul;
    document.getElementById("modal-description").innerText = deskripsi;
    document.getElementById("note-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("note-modal").style.display = "none";
}

// Ambil data pertama kali saat halaman dimuat
getNotes();
