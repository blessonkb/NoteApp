const Note = require("../models/notes");
const Category = require("../models/category");

const getcategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await Category.find({ userId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedCategory = await Category.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId });

    if (!deletedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};



module.exports = { getcategories, getNotes, deleteCategory, deleteNote };
