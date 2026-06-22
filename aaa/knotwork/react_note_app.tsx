import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, Plus, Menu, Settings, Users, Pin, Share2, Trash2, Edit3, Sun, Moon, Bell, User, Phone, Hash, Calendar, Clock, ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';

// Supabase Client Simulation (replace with actual Supabase integration)
class SupabaseClient {
  constructor() {
    this.currentUser = null;
    this.listeners = new Map();
  }

  // Auth methods
  async signInWithOTP(phone) {
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOTP(phone, otp) {
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp === '123456') {
      this.currentUser = { id: '1', phone, created_at: new Date().toISOString() };
      return { success: true, user: this.currentUser };
    }
    throw new Error('Invalid OTP');
  }

  async signOut() {
    this.currentUser = null;
    return { success: true };
  }

  // Database methods
  async from(table) {
    return new DatabaseQuery(table, this);
  }

  // Realtime simulation
  subscribe(channel, callback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    this.listeners.get(channel).push(callback);
    
    return {
      unsubscribe: () => {
        const callbacks = this.listeners.get(channel) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
      }
    };
  }

  broadcast(channel, event, data) {
    const callbacks = this.listeners.get(channel) || [];
    callbacks.forEach(callback => callback(event, data));
  }
}

class DatabaseQuery {
  constructor(table, client) {
    this.table = table;
    this.client = client;
    this.filters = [];
  }

  select(columns = '*') {
    this.columns = columns;
    return this;
  }

  eq(column, value) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  like(column, pattern) {
    this.filters.push({ column, operator: 'like', value: pattern });
    return this;
  }

  order(column, ascending = true) {
    this.orderBy = { column, ascending };
    return this;
  }

  async execute() {
    // Simulate database operations with localStorage
    const key = `supabase_${this.table}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    
    let filtered = data.filter(item => {
      return this.filters.every(filter => {
        const value = item[filter.column];
        switch (filter.operator) {
          case 'eq':
            return value === filter.value;
          case 'like':
            return value && value.toLowerCase().includes(filter.value.toLowerCase());
          default:
            return true;
        }
      });
    });

    if (this.orderBy) {
      filtered.sort((a, b) => {
        const aVal = a[this.orderBy.column];
        const bVal = b[this.orderBy.column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return this.orderBy.ascending ? comparison : -comparison;
      });
    }

    return { data: filtered };
  }

  async insert(values) {
    const key = `supabase_${this.table}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const newItem = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...values
    };
    data.push(newItem);
    localStorage.setItem(key, JSON.stringify(data));
    
    // Broadcast realtime update
    this.client.broadcast(`${this.table}_changes`, 'INSERT', newItem);
    
    return { data: [newItem] };
  }

  async update(values) {
    const key = `supabase_${this.table}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    
    const updated = data.map(item => {
      const matches = this.filters.every(filter => {
        const value = item[filter.column];
        return filter.operator === 'eq' ? value === filter.value : true;
      });
      
      if (matches) {
        const updatedItem = {
          ...item,
          ...values,
          updated_at: new Date().toISOString()
        };
        // Broadcast realtime update
        this.client.broadcast(`${this.table}_changes`, 'UPDATE', updatedItem);
        return updatedItem;
      }
      return item;
    });
    
    localStorage.setItem(key, JSON.stringify(updated));
    return { data: updated };
  }

  async delete() {
    const key = `supabase_${this.table}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    
    const remaining = data.filter(item => {
      const matches = this.filters.every(filter => {
        const value = item[filter.column];
        return filter.operator === 'eq' ? value === filter.value : true;
      });
      
      if (matches) {
        // Broadcast realtime update
        this.client.broadcast(`${this.table}_changes`, 'DELETE', item);
        return false;
      }
      return true;
    });
    
    localStorage.setItem(key, JSON.stringify(remaining));
    return { data: remaining };
  }
}

// Initialize Supabase client
const supabase = new SupabaseClient();

// Context for theme
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// Context for auth
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Auth Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      setUser(supabase.currentUser);
      setLoading(false);
    };
    checkSession();
  }, []);

  const signInWithOTP = async (phone) => {
    return await supabase.signInWithOTP(phone);
  };

  const verifyOTP = async (phone, otp) => {
    const result = await supabase.verifyOTP(phone, otp);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const signOut = async () => {
    await supabase.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithOTP, verifyOTP, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Theme Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'system';
  });

  const [isDark, setIsDark] = useState(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      
      const handleChange = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Login Component
function Login() {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithOTP, verifyOTP } = useAuth();
  const { isDark } = useTheme();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithOTP(phone);
      if (result.success) {
        setStep('otp');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await verifyOTP(phone, otp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 transition-all duration-300`}>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${isDark ? 'bg-blue-600' : 'bg-blue-500'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <Edit3 className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to NotesApp
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            {step === 'phone' ? 'Enter your phone number to continue' : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  <span>Send OTP</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-xl tracking-wider`}
                maxLength="6"
              />
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>
                Use 123456 as OTP for demo
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setStep('phone')}
                className={`w-full ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} font-medium py-2 transition-colors duration-200`}
              >
                ← Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Notes List Component
function NotesList({ notes, searchQuery, onNoteSelect, onTogglePin, onDeleteNote }) {
  const { isDark } = useTheme();
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const pinnedNotes = filteredNotes.filter(note => note.is_pinned);
  const regularNotes = filteredNotes.filter(note => !note.is_pinned);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const NoteCard = ({ note }) => (
    <div
      className={`${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-200'} group`}
      onClick={() => onNoteSelect(note)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} line-clamp-1 flex-1 mr-2`}>
          {note.title}
        </h3>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id, !note.is_pinned);
            }}
            className={`p-1.5 rounded-lg transition-colors duration-200 ${note.is_pinned ? 'text-yellow-500 bg-yellow-50' : isDark ? 'text-gray-400 hover:text-yellow-500 hover:bg-gray-700' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
          >
            <Pin className="w-4 h-4" fill={note.is_pinned ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNote(note.id);
            }}
            className={`p-1.5 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>
        {note.content}
      </p>
      
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-md text-xs font-medium ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs">
        <div className={`flex items-center space-x-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(note.updated_at || note.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(note.updated_at || note.created_at)}</span>
          </div>
        </div>
        
        {note.is_shared && (
          <div className="flex items-center space-x-1 text-green-500">
            <Share2 className="w-3 h-3" />
            <span>Shared</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {pinnedNotes.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
            <Pin className="w-5 h-5 text-yellow-500" fill="currentColor" />
            <span>Pinned Notes</span>
          </h2>
          <div className="grid gap-3">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
      
      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              All Notes
            </h2>
          )}
          <div className="grid gap-3">
            {regularNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
      
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Edit3 className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first note to get started'}
          </p>
        </div>
      )}
    </div>
  );
}

// Note Editor Component
function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [category, setCategory] = useState(note?.category || '');
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const { isDark } = useTheme();

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    
    setSaving(true);
    try {
      await onSave({
        ...note,
        title: title || 'Untitled',
        content,
        tags,
        category
      });
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={saving || (!title.trim() && !content.trim())}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className={`flex-1 p-4 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className={`w-full text-2xl font-bold bg-transparent border-none outline-none ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
        />

        {/* Category */}
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
          className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
        />

        {/* Tags */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
              >
                <Hash className="w-3 h-3" />
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className={`ml-1 hover:bg-blue-800 rounded-full p-0.5 transition-colors duration-200 ${isDark ? 'hover:bg-blue-800' : 'hover:bg-blue-200'}`}
                >
                  <span className="text-xs">×</span>
                </button>
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add a tag..."
              className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className={`w-full h-96 p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
        />
      </div>
    </div>
  );
}

// Groups Component
function Groups() {
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { data } = await supabase.from('groups').select('*').order('updated_at', false).execute();
      setGroups(data || []);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      set