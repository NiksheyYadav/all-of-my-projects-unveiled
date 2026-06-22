document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.onMessage.addListener((message) => {
        if (message.message === "show_result" && message.data) {
            const score = message.data.score.toFixed(2);
            const details = message.data.details;
            document.getElementById('score').textContent = `Credibility Score: ${score}`;
            document.getElementById('details').textContent = details;
        }
    });
});