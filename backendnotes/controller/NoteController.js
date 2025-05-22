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
    const { judul, deskripsi } = req.body; // Hanya judul & deskripsi

    const note = await Note.findOne({ where: { id } });

    if (!note) {
      return res.status(404).json({ message: "Catatan tidak ditemukan" });
    }

    // Update hanya judul & deskripsi, updatedAt otomatis diperbarui oleh Sequelize
    await Note.update({ judul, deskripsi }, { where: { id } });

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

// GET note by ID
async function getNoteById(req, res) {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ where: { id } });

    if (!note) {
      return res.status(404).json({ message: "Catatan tidak ditemukan" });
    }

    // Format tanggal supaya konsisten seperti getNotes
    const formattedNote = {
      id: note.id,
      judul: note.judul,
      deskripsi: note.deskripsi,
      createdAt: new Date(note.createdAt).toISOString(),
      updatedAt: new Date(note.updatedAt).toISOString(),
    };

    res.status(200).json(formattedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil catatan" });
  }
}


export { getNotes, createNote, updateNote, deleteNote,getNoteById };
