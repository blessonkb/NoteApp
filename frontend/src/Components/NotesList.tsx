
import type { Note } from '../types';

interface NotesListProps {
  notes: Note[];
  activeCategory: string; // We passed the name
  activeNoteId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  onMenuClick?: () => void;
  className?: string;
}

export default function NotesList({
  notes,
  activeCategory,
  activeNoteId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onAddNote,
  onMenuClick,
  className = ""
}: NotesListProps) {
  return (
    <div className={`w-80 bg-background flex-shrink-0 border-r border-border flex flex-col h-full ${className}`}>
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
                 {/* Mobile Menu Button */}
                <button onClick={onMenuClick} className="md:hidden text-text-secondary hover:text-accent">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <h2 className="text-2xl font-bold text-text tracking-tight">{activeCategory}</h2>
             </div>
             <div className="text-xs text-accent font-medium bg-accent-light px-2 py-1 rounded-full">
                  {notes.length} Notes
             </div>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm transition-all"
          />
          <span className="absolute right-3 top-3.5 text-text-secondary">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
        </div>

        <button
          onClick={onAddNote}
          className="w-full bg-accent text-white py-3 rounded-lg text-sm font-bold tracking-wide hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-md"
        >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             ADD NOTE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
            <div className="p-6 text-center text-text-secondary text-sm">No notes found</div>
        ) : (
            notes.map((note) => (
            <div
                key={note._id}
                onClick={() => onSelectNote(note._id)}
                className={`p-6 border-b border-border cursor-pointer transition-all duration-300 ${
                activeNoteId === note._id 
                    ? 'bg-white shadow-md border-l-4 border-l-accent -ml-px z-10' 
                    : 'hover:bg-white hover:shadow-sm'
                }`}
            >
                <div className="flex items-center gap-2 mb-1">
                <span className="ml-auto text-xs text-text-secondary">
                    {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'No Date'}
                </span>
                </div>
                <h4 className={`font-semibold mb-1 truncate transition-colors ${activeNoteId === note._id ? 'text-accent' : 'text-text'}`}>{note.title}</h4>
                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {note.content}
                </p>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
