import Note from "../models/NoteModel.js";

async function getNotes(req, res) {
    try {
        const result = await Note.findAll();
        
        const formattedResult = result.map((note) => ({
            id: note.id,
            judul: note.judul,
            deskripsi: note.deskripsi,
            createdAt: new Date(note.createdAt).toISOString(), // Format ISO
            updatedAt: new Date(note.updatedAt).toISOString(), // Format ISO
        }));

        res.status(200).json(formattedResult);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil catatan" });
    }
}



// POST (Menambahkan catatan baru)
async function createNote(req, res) {
    try {
        const inputResult = {
            judul: req.body.judul,
            deskripsi: req.body.deskripsi,
        };
        const newNote = await Note.create(inputResult);
        res.status(201).json(newNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan catatan" });
    }
}
// PUT (Memperbarui catatan)
async function updateNote(req, res) {
    try {
        const { id } = req.params;
        const { judul, deskripsi, tanggal } = req.body; // Pastikan tanggal diterima
        const updateInput = { judul, deskripsi, tanggal };

        const note = await Note.findOne({ where: { id } });

        if (!note) {
            return res.status(404).json({ message: "Catatan tidak ditemukan" });
        }

        // Update catatan dan simpan tanggal baru
        await Note.update(updateInput, { where: { id } });

        res.status(200).json({ message: "Catatan berhasil diperbarui" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui catatan" });
    }
}

// DELETE (Menghapus catatan)
async function deleteNote(req, res) {
    try {
        const { id } = req.params;
        const note = await Note.findOne({ where: { id } });

        if (!note) {
            return res.status(404).json({ message: "Catatan tidak ditemukan" });
        }

        await Note.destroy({ where: { id } });
        res.status(200).json({ message: "Catatan berhasil dihapus" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus catatan" });
    }
}

export { getNotes, createNote, updateNote, deleteNote };
