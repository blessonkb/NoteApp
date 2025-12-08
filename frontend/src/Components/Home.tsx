import { useState, useEffect } from 'react';
import type { Note, Category } from '../types';
import Sidebar from './Sidebar';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import Modal from './Modal';

type MobileView = 'sidebar' | 'list' | 'editor';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<MobileView>('list');

  // Modal States
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  const token = localStorage.getItem('token');

  // Fetch User Details
  useEffect(() => {
    const fetchUser = async () => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost:3000/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (err) {
            console.error("Failed to fetch user");
        }
    };
    fetchUser();
  }, [token]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0 && !activeCategory) {
              setActiveCategory(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    if (token) fetchCategories();
  }, [token]);

  // Fetch Notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/notes', {
           headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotes(data);
        }
      } catch (err) {
        console.error("Failed to fetch notes", err);
      }
    };
     if (token) fetchNotes();
  }, [token]);


  const activeNote = notes.find(n => n._id === activeNoteId);

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesCategory = activeCategory ? n.categoryId === activeCategory._id : false;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddCategory = () => {
      setNewCategoryName("");
      setIsAddCategoryModalOpen(true);
  };

  const submitAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
        const res = await fetch('http://localhost:3000/api/addCategory', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ categoryName: newCategoryName, description: 'User category' })
        });
        const data = await res.json();
        if (data.category) {
            setCategories([...categories, data.category]);
            setActiveCategory(data.category);
            setMobileView('list');
            setIsAddCategoryModalOpen(false);
        }
    } catch (err) {
        alert("Failed to create category");
    }
  };

  const handleAddNote = async () => {
    if (!activeCategory) return alert("Select a category first");

    try {
        const res = await fetch('http://localhost:3000/api/addNote', {
            method: 'POST',
             headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                title: "Untitled Note", 
                content: "Start typing...", 
                categoryId: activeCategory._id 
            })
        });
        const data = await res.json();
        
        if (data.note) {
            setNotes([data.note, ...notes]);
            setActiveNoteId(data.note._id);
            setMobileView('editor');
        }
    } catch (err) {
        alert("Failed to create note");
    }
  };

  const handleDeleteNote = async (id: string) => {
      try {
           await fetch(`http://localhost:3000/api/deleteNote/${id}`, {
             method: 'DELETE',
             headers: { Authorization: `Bearer ${token}` }
           });
           setNotes(notes.filter(n => n._id !== id));
           if (activeNoteId === id) {
               setActiveNoteId(null);
               setMobileView('list');
           }
      } catch (err) {
          alert("Failed to delete note");
      }
  }

  
  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
      
      setNotes(notes.map(n => n._id === id ? {...n, ...updates} : n));
      
      
      try {
           await fetch(`http://localhost:3000/api/updateNote/${id}`, {
               method: 'PUT',
               headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
               },
               body: JSON.stringify(updates)
           });
      } catch (err) {
          console.error("Failed to save note");
      }
  };

  const handleRenameCategory = async (category: Category, newName: string) => {
      if (category.categoryName === newName) return;

      try {
        const res = await fetch(`http://localhost:3000/api/updateCategory/${category._id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ categoryName: newName, description: category.description || 'User category' })
        });

        if (res.ok) {
            setCategories(categories.map(c => c._id === category._id ? { ...c, categoryName: newName } : c));
        }
      } catch (err) {
          alert("Failed to rename category");
      }
  };

  const handleDeleteCategory = (categoryId: string) => {
      setCategoryToDelete(categoryId);
  };

  const submitDeleteCategory = async () => {
      if (!categoryToDelete) return;
      try {
          const res = await fetch(`http://localhost:3000/api/deleteCategory/${categoryToDelete}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
          });

          if (res.ok) {
              setCategories(categories.filter(c => c._id !== categoryToDelete));
              if (activeCategory?._id === categoryToDelete) {
                  setActiveCategory(null);
                  setMobileView('list');
              }
              
              setNotes(notes.filter(n => n.categoryId !== categoryToDelete));
              setCategoryToDelete(null);
          }
      } catch (err) {
          alert("Failed to delete category");
      }
  };

  const userName = user?.name || localStorage.getItem('userName') || 'User';
  
  
  // Calculate note counts per category
  const noteCounts = notes.reduce((acc, note) => {
      acc[note.categoryId] = (acc[note.categoryId] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="flex h-screen bg-white font-sans text-text">
      <Sidebar 
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setMobileView('list');
        }}
        onAddCategory={handleAddCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        counts={noteCounts}
        className={`${mobileView === 'sidebar' ? 'flex w-full' : 'hidden'} md:flex md:w-64`}
        user={{
            name: userName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`
        }}
      />

      <NotesList 
        notes={filteredNotes}
        activeCategory={activeCategory ? activeCategory.categoryName : 'Select Category'}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectNote={(id) => {
            setActiveNoteId(id);
            setMobileView('editor');
        }}
        onAddNote={handleAddNote}
        onMenuClick={() => setMobileView('sidebar')}
        className={`${mobileView === 'list' ? 'flex w-full' : 'hidden'} md:flex md:w-80`}
      />

      <NoteEditor 
        note={activeNote}
        onUpdateTitle={(title) => activeNote && handleUpdateNote(activeNote._id, { title })}
        onUpdateContent={(content) => activeNote && handleUpdateNote(activeNote._id, { content })}
        onDeleteNote={handleDeleteNote}
        onBack={() => setMobileView('list')}
        className={`${mobileView === 'editor' ? 'flex w-full' : 'hidden'} md:flex md:flex-1`}
      />

      {/* Add Category Modal */}
      <Modal 
        isOpen={isAddCategoryModalOpen} 
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Create Category"
      >
        <div className="flex flex-col gap-4">
            <input 
                autoFocus
                type="text"
                placeholder="Category Name"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-accent text-text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitAddCategory()}
            />
            <div className="flex justify-end gap-2">
                <button 
                    onClick={() => setIsAddCategoryModalOpen(false)}
                    className="px-4 py-2 text-text-secondary hover:text-text text-sm font-medium"
                >
                    Cancel
                </button>
                <button 
                    onClick={submitAddCategory}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 text-sm font-bold shadow-md"
                    disabled={!newCategoryName.trim()}
                >
                    Create
                </button>
            </div>
        </div>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Delete Category"
      >
         <div className="flex flex-col gap-4">
            <p className="text-text-secondary">
                Are you sure you want to delete <span className="font-bold text-text">{categories.find(c => c._id === categoryToDelete)?.categoryName}</span>?
            </p>
            <div className="flex justify-end gap-2">
                <button 
                    onClick={() => setCategoryToDelete(null)}
                    className="px-4 py-2 text-text-secondary hover:text-text text-sm font-medium"
                >
                    Cancel
                </button>
                <button 
                    onClick={submitDeleteCategory}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-bold shadow-md"
                >
                    Delete Maybe?
                </button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
