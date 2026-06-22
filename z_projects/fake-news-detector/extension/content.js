let lastAnalysis = 0;
const debounceTime = 1000; // 1 second debounce

document.addEventListener('mouseup', async () => {
    const now = Date.now();
    if (now - lastAnalysis < debounceTime) return;

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        try {
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: selectedText, source: window.location.hostname })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            chrome.runtime.sendMessage({ message: "show_result", data: result });
            lastAnalysis = now;
        } catch (error) {
            console.error('Error analyzing text:', error);
            alert('Failed to analyze text. Please try again.');
        }
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const now = Date.now();
    if (now - lastAnalysis < debounceTime) return;

    const articleText = Array.from(document.querySelectorAll('p, article'))
        .map(elem => elem.textContent)
        .join(' ')
        .substring(0, 2000);
    if (articleText) {
        try {
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: articleText, source: window.location.hostname })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            chrome.runtime.sendMessage({ message: "show_result", data: result });
            lastAnalysis = now;
        } catch (error) {
            console.error('Error analyzing article:', error);
        }
    }
});