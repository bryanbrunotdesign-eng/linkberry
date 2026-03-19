import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Trash2, Save } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  body: string;
}

// Chalk stick SVG icon
function ChalkIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Chalk stick body - angled like writing */}
      <rect
        x="3"
        y="8"
        width="14"
        height="5"
        rx="1.2"
        transform="rotate(-25 10 10.5)"
        fill="currentColor"
      />
      {/* Chalk tip - flat writing edge */}
      <rect
        x="14.5"
        y="5.8"
        width="3"
        height="4.2"
        rx="0.6"
        transform="rotate(-25 16 7.9)"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Chalk dust dots */}
      <circle cx="5" cy="15" r="0.7" fill="currentColor" opacity="0.4" />
      <circle cx="7.5" cy="16" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="3.5" cy="16.5" r="0.6" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

// Edit chalk icon (smaller, for edit button)
function ChalkEditIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <rect
        x="2.5"
        y="6"
        width="11"
        height="4"
        rx="1"
        transform="rotate(-30 8 8)"
        fill="currentColor"
      />
      <rect
        x="11.5"
        y="4.2"
        width="2.5"
        height="3.5"
        rx="0.5"
        transform="rotate(-30 12.75 5.95)"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

const NOTES_STORAGE_KEY = 'linkberry_notes_v1';

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveNotesToStorage(notes: Note[]) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}

export function GoalCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [expandedNote, setExpandedNote] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Persist notes to localStorage whenever they change
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  // Auto-focus the title input when opening
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSaveNote = () => {
    if (newTitle.trim() || newBody.trim()) {
      const newNote: Note = {
        id: Date.now(),
        title: newTitle.trim() || 'Untitled',
        body: newBody.trim() || ''
      };
      setNotes([newNote, ...notes]);
      setNewTitle('');
      setNewBody('');
      // Don't close — keep panel open so user sees it saved
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    setExpandedNote(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditBody(note.body);
  };

  const handleSaveEdit = (id: number) => {
    if (editTitle.trim() || editBody.trim()) {
      setNotes(notes.map(note =>
        note.id === id ? { ...note, title: editTitle.trim() || 'Untitled', body: editBody.trim() } : note
      ));
      setEditingNote(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditBody('');
  };

  // Quick-open a specific note from the collapsed bar
  const handleQuickOpen = (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    setExpandedNote(noteId);
  };

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden border border-[#E2E8F0]" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      {/* Collapsed bar — black like a chalkboard ledge */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1E2A3A] px-4 py-3 flex flex-col gap-0 cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <ChalkIcon className="w-5 h-5 text-white" />
            <span className="font-['Rethink_Sans',sans-serif] font-bold text-sm text-white">
              Notes
            </span>
            {notes.length > 0 && (
              <span className="bg-white/20 text-white font-['Rethink_Sans',sans-serif] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notes.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Quick-access note pills on collapsed bar */}
        {!isOpen && notes.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide w-full" onClick={(e) => e.stopPropagation()}>
            {notes.slice(0, 4).map((note) => (
              <div
                key={note.id}
                onClick={(e) => handleQuickOpen(note.id, e)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 rounded-lg px-2.5 py-1.5 flex-shrink-0 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#F0C875] flex-shrink-0" />
                <span className="font-['Rethink_Sans',sans-serif] text-xs text-white/80 truncate max-w-[120px]">
                  {note.title}
                </span>
              </div>
            ))}
            {notes.length > 4 && (
              <span className="flex items-center text-xs text-white/40 font-['Rethink_Sans',sans-serif] flex-shrink-0 px-1">
                +{notes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded chalkboard body */}
      {isOpen && (
        <div
          className="relative"
          style={{
            background: 'linear-gradient(180deg, #1A2332 0%, #141C28 50%, #1A2332 100%)',
          }}
        >
          {/* Subtle chalk dust texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />

          {/* Chalk tray line at top */}
          <div className="h-px bg-white/10 mx-4" />

          {/* Saved notes list — shown first for quick access */}
          {notes.length > 0 && (
            <div className="px-4 pt-3 relative z-10">
              <div>
                <span className="font-['Rethink_Sans',sans-serif] font-semibold text-xs text-white/40 uppercase tracking-wider">
                  Saved Notes
                </span>
                <div className="mt-2 space-y-0">
                  {notes.map((note, index) => (
                    <div
                      key={note.id}
                      className={`border-b border-white/10 ${index === 0 ? 'border-t border-t-white/10' : ''}`}
                    >
                      <button
                        onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                        className="w-full text-left flex items-center justify-between gap-2 py-2.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                          <span className="font-['Rethink_Sans',sans-serif] font-medium text-sm text-white/90 truncate">
                            {note.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 flex-shrink-0 text-white transition-transform ${expandedNote === note.id ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedNote === note.id && (
                        <div className="pb-3">
                          {editingNote === note.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="Note title..."
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full bg-white/8 rounded-xl px-3 py-2 font-['Rethink_Sans',sans-serif] text-sm text-white placeholder:text-white/30 border border-white/10 outline-none focus:border-white/30 transition-colors"
                              />
                              <textarea
                                placeholder="Note details..."
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                rows={3}
                                className="w-full bg-white/8 rounded-xl px-3 py-2 font-['Open_Sans',sans-serif] italic text-sm text-white placeholder:text-white/30 placeholder:not-italic border border-white/10 outline-none resize-none focus:border-white/30 transition-colors"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(note.id)}
                                  className="flex-1 bg-white/15 text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2 rounded-xl border border-white/10"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="flex-1 bg-white/8 text-white/70 font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2 rounded-xl border border-white/10"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {note.body && (
                                <p className="font-['Open_Sans',sans-serif] italic font-light text-sm text-white/65 mb-3 leading-relaxed pl-3.5">
                                  {note.body}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditNote(note)}
                                  className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-white/90 font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2 rounded-xl border border-white/10"
                                >
                                  <ChalkEditIcon className="w-3.5 h-3.5" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF5C3A]/80 text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2 rounded-xl"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Erase
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Write area - new note entry below saved notes */}
          <div className="px-4 pt-4 pb-4 relative z-10">
            {notes.length > 0 && (
              <div className="border-t border-white/10 pt-3 mb-3">
                <span className="font-['Rethink_Sans',sans-serif] font-semibold text-xs text-white/40 uppercase tracking-wider">
                  New Note
                </span>
              </div>
            )}
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-transparent font-['Rethink_Sans',sans-serif] font-semibold text-sm text-white placeholder:text-white/30 border-none outline-none pb-2"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
            <textarea
              placeholder="Start writing..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={3}
              className="w-full bg-transparent font-['Open_Sans',sans-serif] italic text-sm text-white/90 placeholder:text-white/25 placeholder:not-italic border-none outline-none resize-none pt-2"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(255, 255, 255, 0.06) 27px, rgba(255, 255, 255, 0.06) 28px)',
                backgroundPositionY: '0px',
                lineHeight: '28px',
              }}
            />
            <button
              onClick={handleSaveNote}
              className="w-full bg-white/15 hover:bg-white/20 text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2.5 rounded-xl mt-2 flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Note
            </button>
          </div>

          {/* Chalk tray ledge at bottom */}
          <div className="h-[6px] bg-[#1E2A3A] relative">
            <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
          </div>
        </div>
      )}
    </div>
  );
}