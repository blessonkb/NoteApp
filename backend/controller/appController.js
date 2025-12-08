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
    const id = req.params.id; // Corrected
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
    const id = req.params.id; // Corrected
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

const addCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const userId = req.user.userId;

    const newCategory = new Category({ categoryName, description, userId });
    await newCategory.save();

    res.json({ message: "Category added successfully", category: newCategory }); // Return the new category
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const addNote = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const userId = req.user.userId;

    const newNote = new Note({ title, content, categoryId, userId });
    await newNote.save();

    res.json({ message: "Note added successfully", note: newNote }); // Return the new note
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id; // Corrected
    const { categoryName, description } = req.body;
    const userId = req.user.userId;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId },
      { categoryName, description },
      { new: true } // Return updated
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized" });
    }

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateNote = async (req, res) => {
  try {
    const id = req.params.id; // Corrected
    const { title, content } = req.body;
    const userId = req.user.userId;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content },
      { new: true } // Return updated
    );

    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  getcategories,
  getNotes,
  deleteCategory,
  deleteNote,
  addCategory,
  addNote,
  updateCategory,
  updateNote,
};
