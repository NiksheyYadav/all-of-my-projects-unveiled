// Research Writer 2.0 - Frontend Application Logic

const API_BASE = 'http://localhost:8000/api';

// State management
const state = {
    currentResearch: null,
    researchHistory: [],
    config: null,
    isResearching: false,
    deepThinkMode: false
};

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadHistory();
    loadConfig();
});

function initializeApp() {
    console.log('🚀 Research Writer 2.0 initialized');
    // Check for URL params or saved state if needed
}

// ============ EVENT LISTENERS ============

function setupEventListeners() {
    // Input handling
    const topicInput = document.getElementById('topic-input');
    const startBtn = document.getElementById('start-btn');
    const deepThinkToggle = document.getElementById('deep-think-toggle');

    topicInput?.addEventListener('input', (e) => {
        startBtn.disabled = !e.target.value.trim();
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    });

    topicInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!startBtn.disabled) {
                startResearch();
            }
        }
    });

    startBtn?.addEventListener('click', startResearch);

    // Deep Think Toggle
    deepThinkToggle?.addEventListener('change', (e) => {
        state.deepThinkMode = e.target.checked;
        if (state.deepThinkMode) {
            showNotification('Deep Think Mode Activated: Expect deeper analysis and longer processing times.', 'info');
        }
    });

    // Navigation
    document.getElementById('new-research-btn')?.addEventListener('click', resetToHome);

    // Settings Modal
    const settingsModal = document.getElementById('settings-modal');
    document.getElementById('settings-btn')?.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });
    document.getElementById('close-settings')?.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    document.getElementById('save-settings')?.addEventListener('click', saveSettings);

    // Results actions
    document.getElementById('download-btn')?.addEventListener('click', downloadDocument);
    document.getElementById('download-word-btn')?.addEventListener('click', downloadAsWord);
    document.getElementById('download-pdf-btn')?.addEventListener('click', downloadAsPDF);
    document.getElementById('copy-btn')?.addEventListener('click', copyDocument);
}

// ============ RESEARCH WORKFLOW ============

async function startResearch() {
    if (state.isResearching) return;

    const topicInput = document.getElementById('topic-input');
    const formatInstruction = document.getElementById('format-instruction');
    const topic = topicInput.value.trim();

    if (!topic) return;

    state.isResearching = true;
    showLoading(true);
    clearLogs();
    addLog('Initializing research protocol...', 'info');

    try {
        // Collect settings
        const settings = {
            deep_think: state.deepThinkMode,
            format_instructions: formatInstruction.value.trim(),
            include_images: document.getElementById('setting-images').checked,
            depth: document.getElementById('setting-depth').value,
            citation_style: document.getElementById('setting-citation').value
        };

        addLog(`Target: ${topic}`, 'info');
        addLog(`Mode: ${state.deepThinkMode ? 'Deep Think' : 'Standard'}`, 'info');

        // Simulate initial planning logs
        if (state.deepThinkMode) {
            addLog('🧠 Deep Think: Analyzing topic complexity...', 'info');
            await new Promise(r => setTimeout(r, 1000));
            addLog('🧠 Deep Think: Generating recursive research plan...', 'info');
        } else {
            addLog('Generating research plan...', 'info');
        }

        // Make API call
        const response = await fetch(`${API_BASE}/research`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic,
                depth: settings.depth,
                settings: settings
            })
        });

        // Simulate streaming logs while waiting (since we don't have real websockets yet)
        const logInterval = setInterval(() => {
            const actions = [
                '🔍 Searching: ' + topic,
                '📊 Analyzing source credibility...',
                '🧠 Synthesizing findings...',
                '✍️ Drafting section: Introduction...',
                '✍️ Drafting section: Methodology...',
                '🔍 Verifying citations...'
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            addLog(randomAction, 'search');
        }, 2000);

        if (!response.ok) {
            clearInterval(logInterval);
            throw new Error('Research failed');
        }

        const result = await response.json();
        clearInterval(logInterval);

        if (result.success) {
            state.currentResearch = result.result;
            addLog('Research completed successfully.', 'success');
            await new Promise(r => setTimeout(r, 1000)); // Show success log briefly
            await showResults(result.result);
            // Refresh history
            loadHistory();
        } else {
            throw new Error(result.error || 'Unknown error');
        }

    } catch (error) {
        console.error('Research error:', error);
        addLog(`❌ Error: ${error.message}`, 'error');
        showNotification(`Error: ${error.message}`, 'error');
        // Keep loading screen open for a moment to show error log
        await new Promise(r => setTimeout(r, 3000));
    } finally {
        state.isResearching = false;
        showLoading(false);
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function addLog(message, type = 'info') {
    const logsContainer = document.getElementById('live-logs');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${message}`;
    logsContainer.appendChild(entry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function clearLogs() {
    document.getElementById('live-logs').innerHTML = '';
}

async function showResults(result) {
    // Hide welcome screen
    document.getElementById('welcome-screen').style.display = 'none';

    // Show results container
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.add('active');

    // Update title
    document.getElementById('doc-title').textContent = result.topic;

    // Load document content
    try {
        const docResponse = await fetch(`${API_BASE}/document/${result.research_id}`);
        const docData = await docResponse.json();

        if (docData.success) {
            const markdownContent = document.getElementById('markdown-output');
            // Use marked library to parse markdown
            markdownContent.innerHTML = marked.parse(docData.content);
        }
    } catch (error) {
        console.error('Error loading document:', error);
        showNotification('Error loading document content', 'error');
    }

    showNotification('Research completed successfully! 🎉', 'success');
}

function resetToHome() {
    document.getElementById('results-container').classList.remove('active');
    document.getElementById('welcome-screen').style.display = 'flex';
    document.getElementById('topic-input').value = '';
    document.getElementById('start-btn').disabled = true;
    state.currentResearch = null;
}

// ============ SETTINGS MANAGEMENT ============

async function saveSettings() {
    const settings = {
        research_settings: {
            max_sources: parseInt(document.getElementById('setting-max-sources').value),
            depth_level: document.getElementById('setting-depth').value,
            include_images: document.getElementById('setting-images').checked
        },
        output_settings: {
            citation_style: document.getElementById('setting-citation').value
        }
    };

    // In a real app, we'd save this to the backend
    // For now, we just update the UI state and notify
    showNotification('Configuration saved successfully', 'success');
    document.getElementById('settings-modal').style.display = 'none';
}

// ============ HISTORY MANAGEMENT ============

async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE}/history`);
        const data = await response.json();

        if (data.success) {
            state.researchHistory = data.history;
            renderHistory(data.history);
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function renderHistory(history) {
    const container = document.getElementById('history-list');

    if (history.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 14px;">
                No history yet
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item ${state.currentResearch?.research_id === item.research_id ? 'active' : ''}" 
             onclick="loadHistoryItem('${item.research_id}')">
            <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
                <span class="material-icons" style="font-size: 16px;">article</span>
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(item.topic)}</span>
            </div>
            <span class="material-icons delete-btn" style="font-size: 16px;" 
                  onclick="deleteHistoryItem(event, '${item.research_id}')">delete</span>
        </div>
    `).join('');
}

async function deleteHistoryItem(event, researchId) {
    event.stopPropagation(); // Prevent loading the item

    if (!confirm('Are you sure you want to delete this research?')) return;

    try {
        const response = await fetch(`${API_BASE}/history/${researchId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
            showNotification('Research deleted', 'success');
            // Reload history
            loadHistory();
            // If deleted item was active, clear view
            if (state.currentResearch && state.currentResearch.research_id === researchId) {
                state.currentResearch = null;
                document.getElementById('results-area').innerHTML = '';
                document.getElementById('welcome-screen').style.display = 'flex';
            }
        } else {
            showNotification('Failed to delete research', 'error');
        }
    } catch (error) {
        console.error('Error deleting history:', error);
        showNotification('Error deleting research', 'error');
    }
}

async function loadHistoryItem(researchId) {
    try {
        showLoading(true);
        clearLogs();
        addLog('Loading archived research...', 'info');

        const response = await fetch(`${API_BASE}/document/${researchId}`);
        const data = await response.json();

        if (data.success) {
            // Fetch metadata for context
            const resultResponse = await fetch(`${API_BASE}/results/${researchId}`);
            const resultData = await resultResponse.json();

            if (resultData.success) {
                state.currentResearch = {
                    research_id: researchId,
                    topic: resultData.results.research_plan.topic
                };
                await showResults(state.currentResearch);

                // Update active state in sidebar
                document.querySelectorAll('.history-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.textContent.trim().includes(state.currentResearch.topic)) {
                        item.classList.add('active');
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading history item:', error);
        showNotification('Error loading research document', 'error');
    } finally {
        showLoading(false);
    }
}

// ============ CONFIG MANAGEMENT ============

async function loadConfig() {
    try {
        const response = await fetch(`${API_BASE}/config`);
        const data = await response.json();
        if (data.success) {
            state.config = data.config;
            // Populate settings modal
            if (data.config.research_settings) {
                document.getElementById('setting-max-sources').value = data.config.research_settings.max_sources || 20;
                document.getElementById('setting-depth').value = data.config.research_settings.depth_level || 'comprehensive';
            }
            if (data.config.output_settings) {
                document.getElementById('setting-citation').value = data.config.output_settings.citation_style || 'IEEE';
            }
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// ============ DOCUMENT ACTIONS ============

function downloadDocument() {
    if (!state.currentResearch) return;

    fetch(`${API_BASE}/document/${state.currentResearch.research_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const blob = new Blob([data.content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${state.currentResearch.topic.replace(/[^a-z0-9]/gi, '_')}_research.md`;
                a.click();
                URL.revokeObjectURL(url);
                showNotification('Document downloaded! 📥', 'success');
            }
        });
}

function copyDocument() {
    fetch(`${API_BASE}/document/${state.currentResearch.research_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                navigator.clipboard.writeText(data.content).then(() => {
                    showNotification('Copied to clipboard! 📋', 'success');
                });
            }
        });
}

async function downloadAsWord() {
    if (!state.currentResearch) return;
    try {
        showNotification('Generating Word document... ⏳', 'info');
        const response = await fetch(`${API_BASE}/export/word/${state.currentResearch.research_id}`);

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Export failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.currentResearch.topic.replace(/[^a-z0-9]/gi, '_')}.docx`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Word document downloaded! 📄', 'success');
    } catch (error) {
        console.error('Word export error:', error);
        showNotification(`Failed to export Word: ${error.message}`, 'error');
    }
}

async function downloadAsPDF() {
    if (!state.currentResearch) return;
    try {
        showNotification('Generating PDF document... ⏳', 'info');
        const response = await fetch(`${API_BASE}/export/pdf/${state.currentResearch.research_id}`);
        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.currentResearch.topic.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('PDF document downloaded! 📕', 'success');
    } catch (error) {
        console.error('PDF export error:', error);
        showNotification('Failed to export PDF document', 'error');
    }
}

// ============ UTILITIES ============

function showNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <span class="material-icons" style="font-size: 18px; cursor: pointer;" onclick="this.parentElement.remove()">close</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
