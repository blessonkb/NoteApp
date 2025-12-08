
import type { Note } from '../types';

interface NoteEditorProps {
  note: Note | undefined;
  onUpdateTitle: (newTitle: string) => void;
  onUpdateContent: (newContent: string) => void;
  onDeleteNote: (id: string) => void;
  onBack?: () => void;
  className?: string;
}

export default function NoteEditor({
  note,
  onUpdateTitle,
  onUpdateContent,
  onDeleteNote,
  onBack,
  className = ""
}: NoteEditorProps) {
  if (!note) {
    return (
      <div className={`flex-1 flex items-center justify-center text-gray-300 h-full ${className}`}>
        {/* Helper for mobile if they are stuck here with no note, though logic should prevent this */}
        <div className="text-center">
            <p>Select a note to view</p>
            {onBack && (
                <button onClick={onBack} className="mt-4 md:hidden text-primary font-medium">
                    Back to List
                </button>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 bg-surface flex flex-col h-full ${className}`}>
      <div className="p-8 pb-4 flex justify-between items-center border-b border-transparent">
        {/* Back button for mobile */}
        {onBack && (
            <button onClick={onBack} className="md:hidden text-text-secondary hover:text-accent flex items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Back
            </button>
        )}
        
        <div className="ml-auto flex gap-4">
             <button onClick={() => onDeleteNote(note._id)} className="text-text-secondary hover:text-red-500 transition-colors" title="Delete Note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        </div>
      </div>
      <div className="px-12 flex-1 overflow-y-auto max-w-4xl mx-auto w-full">
        <input
          className="w-full text-4xl font-bold text-text mb-6 focus:outline-none bg-transparent placeholder-text-secondary/50 tracking-tight"
          value={note.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          placeholder="Note Title"
        />
        <textarea
          className="w-full h-[calc(100%-100px)] resize-none text-text leading-loose focus:outline-none bg-transparent text-lg placeholder-text-secondary/50 font-light"
          value={note.content}
          onChange={(e) => onUpdateContent(e.target.value)}
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}
