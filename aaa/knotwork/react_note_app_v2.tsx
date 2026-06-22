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

  const CreateGroupModal = ({ onClose, onCreateGroup }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!name.trim()) return;

      setCreating(true);
      try {
        await onCreateGroup({ name: name.trim(), description: description.trim() });
        onClose();
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Create New Group
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Group Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name..."
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter group description..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !name.trim()}
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const createGroup = async (groupData) => {
    try {
      const { data } = await supabase.from('groups').insert({
        ...groupData,
        created_by: supabase.currentUser?.id || '1'
      }).execute();
      
      if (data && data.length > 0) {
        setGroups(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Groups</h1>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </button>
      </div>

      {groups.length > 0 ? (
        <div className="grid gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-200'} group cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>
                      {group.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-xs">
                    <div className={`flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Users className="w-3 h-3" />
                      <span>{group.members?.length || 1} members</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(group.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className={`p-1.5 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}>
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`w-16 h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Users className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            No groups yet
          </p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Create a group to collaborate with others
          </p>
        </div>
      )}

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={createGroup}
        />
      )}
    </div>
  );
}

// Settings Component
function Settings() {
  const { theme, setTheme, isDark } = useTheme();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') !== 'false';
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleNotificationChange = (enabled) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', enabled.toString());
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>

      <div className="space-y-4">
        {/* Theme Settings */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>Appearance</span>
          </h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Light</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Dark</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === 'system'}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>System</span>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </h2>
          
          <label className="flex items-center justify-between cursor-pointer">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Enable notifications</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => handleNotificationChange(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${notifications ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${notifications ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
              </div>
            </div>
          </label>
        </div>

        {/* Account Settings */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
            <User className="w-5 h-5" />
            <span>Account</span>
          </h2>
          
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (user) {
      loadNotes();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const { data } = await supabase.from('notes').select('*').order('updated_at', false).execute();
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase.subscribe('notes_changes', (event, data) => {
      switch (event) {
        case 'INSERT':
          setNotes(prev => [data, ...prev]);
          break;
        case 'UPDATE':
          setNotes(prev => prev.map(note => note.id === data.id ? data : note));
          break;
        case 'DELETE':
          setNotes(prev => prev.filter(note => note.id !== data.id));
          break;
      }
    });

    return () => subscription.unsubscribe();
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData.id) {
        // Update existing note
        await supabase.from('notes').update(noteData).eq('id', noteData.id).execute();
        setNotes(prev => prev.map(note => note.id === noteData.id ? { ...note, ...noteData } : note));
      } else {
        // Create new note
        const { data } = await supabase.from('notes').insert({
          ...noteData,
          created_by: user?.id || '1'
        }).execute();
        if (data && data.length > 0) {
          setNotes(prev => [data[0], ...prev]);
        }
      }
      setShowEditor(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleTogglePin = async (noteId, isPinned) => {
    try {
      await supabase.from('notes').update({ is_pinned: isPinned }).eq('id', noteId).execute();
      setNotes(prev => prev.map(note => note.id === noteId ? { ...note, is_pinned: isPinned } : note));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await supabase.from('notes').delete().eq('id', noteId).execute();
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (showEditor) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <NoteEditor
          note={selectedNote}
          onSave={handleSaveNote}
          onClose={() => {
            setShowEditor(false);
            setSelectedNote(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'} transition-colors duration-200`}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          NotesApp
        </h1>
        
        {currentView === 'notes' && (
          <button
            onClick={handleCreateNote}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex h-screen lg:h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-transform duration-300 ease-in-out lg:transition-none`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700 hidden lg:block">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                NotesApp
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 mt-4 lg:mt-0">
            <button
              onClick={() => {
                setCurrentView('notes');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'notes' ? 'bg-blue-500 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Edit3 className="w-5 h-5" />
              <span className="font-medium">Notes</span>
            </button>
            
            <button
              onClick={() => {
                setCurrentView('groups');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'groups' ? 'bg-blue-500 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Groups</span>
            </button>
            
            <button
              onClick={() => {
                setCurrentView('settings');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'settings' ? 'bg-blue-500 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Header */}
          <div className={`hidden lg:flex items-center justify-between p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
            <div className="flex items-center space-x-4">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} capitalize`}>
                {currentView}
              </h2>
            </div>
            
            {currentView === 'notes' && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className={`pl-10 pr-4 py-2 w-64 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                
                <button
                  onClick={handleCreateNote}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Note</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Search (for notes view) */}
          {currentView === 'notes' && (
            <div className="lg:hidden p-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {currentView === 'notes' && (
              <NotesList
                notes={notes}
                searchQuery={searchQuery}
                onNoteSelect={handleNoteSelect}
                onTogglePin={handleTogglePin}
                onDeleteNote={handleDeleteNote}
              />
            )}
            {currentView === 'groups' && <Groups />}
            {currentView === 'settings' && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App with Providers
export default function NotesApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="font-sans antialiased">
          <App />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );Loading(false);
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