import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  activeCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onAddCategory: () => void;
  onRenameCategory: (category: Category, newName: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  counts: Record<string, number>;
  className?: string; // For responsive visibility
  user?: { name: string; avatar: string };
}

export default function Sidebar({
  categories,
  activeCategory,
  onSelectCategory,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  counts,
  className = "",
  user = { name: "Isabella Ray", avatar: "https://ui-avatars.com/api/?name=Isabella+Ray&background=random" }
}: SidebarProps) {
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [tempCategoryName, setTempCategoryName] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    if (!categories) return null; // Guard against undefined categories
  return (
    <div className={`w-64 bg-sidebar flex-shrink-0 border-r border-sidebar h-full flex flex-col ${className}`}>
      <div className="p-6 flex items-center gap-3 mb-8 relative">
        <div className="w-10 h-10 rounded-full bg-sidebar-active flex-shrink-0 overflow-hidden border-2 border-accent">
          <img src={user.avatar} alt="User" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-white">{user.name}</h3>
        </div>
        <button 
            className="ml-auto text-sidebar-text hover:text-white"
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
        >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>

        {showLogoutMenu && (
            <div className="absolute top-16 right-6 bg-white shadow-lg rounded-lg border border-gray-100 py-2 w-32 z-10">
                <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                </button>
            </div>
        )}
      </div>

      <div className="px-6 mb-4 flex justify-between items-center text-xs font-bold text-sidebar-text uppercase tracking-wider">
        <span>Categories</span>
        <button onClick={onAddCategory} className="hover:text-accent transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {categories.map((cat) => (
          <div key={cat._id} className="relative group">
            {editingCategoryId === cat._id ? (
                <div className="px-6 py-3 flex items-center gap-2">
                    <input 
                        type="text" 
                        value={tempCategoryName} 
                        onChange={(e) => setTempCategoryName(e.target.value)}
                        className="w-full text-sm bg-sidebar-active text-white border border-accent rounded px-2 py-1 outline-none"
                        autoFocus
                        onBlur={() => {
                            if (tempCategoryName.trim() !== cat.categoryName) {
                                onRenameCategory(cat, tempCategoryName);
                            }
                            setEditingCategoryId(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (tempCategoryName.trim() !== cat.categoryName) {
                                    onRenameCategory(cat, tempCategoryName);
                                }
                                setEditingCategoryId(null);
                            } else if (e.key === 'Escape') {
                                setEditingCategoryId(null);
                            }
                        }}
                    />
                </div>
            ) : (
                <>
                <button
                    onClick={() => onSelectCategory(cat)}
                    className={`w-full text-left px-6 py-3 text-sm flex justify-between items-center transition-all duration-300 ${
                    activeCategory && activeCategory._id === cat._id
                        ? 'bg-sidebar-active text-accent font-medium border-r-4 border-accent'
                        : 'text-sidebar-text hover:bg-sidebar-active hover:text-white'
                    }`}
                >
                    <span className="truncate pr-8">{cat.categoryName}</span>
                     <span className={`text-xs ${activeCategory && activeCategory._id === cat._id ? 'text-accent' : 'opacity-50'}`}>{counts[cat._id] || 0}</span> 
                </button>
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex bg-sidebar-active rounded backdrop-blur-sm">
                    <button 
                        className="p-1.5 text-sidebar-text hover:text-accent rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategoryId(cat._id);
                            setTempCategoryName(cat.categoryName);
                        }}
                        title="Rename"
                    >
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button 
                        className="p-1.5 text-sidebar-text hover:text-red-500 rounded"
                        onClick={(e) => {
                           e.stopPropagation();
                           onDeleteCategory(cat._id);
                        }}
                        title="Delete"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
                </>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
