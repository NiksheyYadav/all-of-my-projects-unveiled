# Comprehensive Research Writer System

## ✨ Overview

A powerful AI-powered research assistant that automates the entire research workflow - from planning and data collection to analysis and document generation. Features a beautiful Google AI Studio-themed web interface.

## 🎯 Features

### Research Capabilities
- **Intelligent Planning** - Generates subtopics, research questions, and keywords
- **Multi-Source Search** - Gathers information from web, academic, and news sources
- **Smart Analysis** - Evaluates source quality, credibility, and relevance
- **Content Extraction** - Scrapes and caches content with intelligent parsing
- **Information Extraction** - Pulls facts, statistics, quotes, and key terms
- **Research Synthesis** - Organizes findings by topic and subtopic
- **Document Generation** - Creates well-structured reports with proper citations

### Web Interface
- **Modern Google AI Studio Design** - Beautiful gradients and animations
- **Real-time Progress Tracking** - Visual feedback during research
- **Document Viewer** - In-app document viewing and editing
- **Research History** - Access all previous research projects
- **Settings Management** - Customize research depth, citations, and more
- **Export Options** - Download in multiple formats (Markdown, PDF, HTML, DOCX)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python api_server.py
```

### 3. Open the Interface

Navigate to `http://localhost:5000` in your browser.

## 📦 Installation

### Requirements

- Python 3.7+
- pip package manager
- Modern web browser

### Python Dependencies

```bash
pip install requests beautifulsoup4 lxml markdown2 pypdf2 flask flask-cors
```

## 🛠️ Usage

### Web Interface

1. **Enter Research Topic** - Type your research subject
2. **Configure Settings** - Choose depth, citation style, and options
3. **Start Research** - Click "Start Research" button
4. **Monitor Progress** - Watch real-time progress through 4 stages
5. **View Results** - Read the generated document
6. **Download/Export** - Save your research document

### Python API

```python
from research_writer import ResearchWriter

# Initialize
writer = ResearchWriter()

# Conduct research
result = writer.conduct_research("Artificial Intelligence in Healthcare")

# Access results
print(f"Document: {result['document_path']}")
print(f"Sources used: {result['sources_used']}")
```

### REST API

```javascript
// Start research
fetch('http://localhost:5000/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        topic: 'AI in Healthcare',
        depth: 'comprehensive'
    })
})

// Get document
fetch('http://localhost:5000/api/document/{research_id}')

// Get history
fetch('http://localhost:5000/api/history')
```

## 📁 Project Structure

```
research-writer/
├── research_writer.py    # Core research engine
├── api_server.py         # Flask REST API
├── index.html           # Web interface
├── styles.css           # Google AI Studio theme
├── app.js              # Frontend logic
├── requirements.txt    # Python dependencies
├── research_config.json # Configuration file
├── research_output/    # Generated documents
└── research_cache/     # Cached web content
```

## ⚙️ Configuration

Edit `research_config.json` to customize:

### Research Settings
- `max_sources`: Maximum number of sources to collect (default: 20)
- `depth_level`: basic, moderate, or comprehensive
- `min_words_per_source`: Minimum content length
- `include_citations`: Enable/disable citations
- `fact_check`: Enable fact checking

### Output Settings
- `format`: markdown, pdf, html, or docx
- `include_toc`: Table of contents
- `include_references`: Bibliography
- `include_summary`: Executive summary
- `citation_style`: APA, MLA, or Chicago

### Search Settings
- `search_engines`: ["google", "bing", "scholar"]
- `time_range`: day, week, month, year, any
- `language`: Language code (e.g., "en")

## 🎨 Features Showcase

### Research Planning
- Automatic subtopic generation
- Research question formulation
- Keyword extraction and expansion

### Multi-Source Collection
- Web search integration
- Academic database support (Scholar, PubMed, arXiv)
- News article aggregation
- Smart content caching

### Source Analysis
- Quality scoring (credibility, relevance, recency)
- Content filtering
- Duplicate detection
- Bias assessment

### Document Writing
- Structured sections
- Proper citations
- Executive summary
- Table of contents
- Key findings synthesis
- Professional formatting

## 🚀 Enhancement Ideas

1. **AI Integration** - Use GPT-4/Claude for better synthesis
2. **Semantic Search** - Implement embeddings for relevance
3. **Fact Checking** - Cross-reference claims across sources
4. **Visual Data** - Generate charts and graphs from statistics
5. **PDF Generation** - Convert to formatted PDFs
6. **Multi-language** - Research in any language
7. **Plagiarism Detection** - Ensure content originality
8. **Collaborative Features** - Share and collaborate on research

## 📝 Examples

### Single Topic Research

```python
writer = ResearchWriter()
result = writer.conduct_research("Quantum Computing Applications")
```

### Batch Research

```python
topics = [
    "AI in Healthcare",
    "Climate Change Solutions",
    "Blockchain Technology"
]

for topic in topics:
    writer.conduct_research(topic)
```

### Custom Configuration

```python
writer.config['research_settings']['max_sources'] = 30
writer.config['output_settings']['citation_style'] = 'MLA'
result = writer.conduct_research("Neural Networks")
```

## 🐛 Troubleshooting

### API Server Won't Start
- Ensure port 5000 is not in use
- Check Python dependencies are installed
- Verify Python version is 3.7+

### Research Fails
- Check internet connection
- Verify API keys (if using external services)
- Review `research_config.json` for invalid settings

### Document Not Generated
- Check `research_output/` directory permissions
- Ensure sufficient disk space
- Review console logs for errors

## 🔐 Privacy & Data

- All research is stored locally
- No data sent to external services (except web scraping)
- Cache can be cleared anytime
- No telemetry or tracking

## 📄 License

This project is provided as-is for educational and research purposes.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📧 Support

For issues and questions:
- Check the troubleshooting section
- Review the documentation
- Open an issue on the repository

---

**Built with ❤️ using Python, Flask, and modern web technologies**

Inspired by Google AI Studio's beautiful design aesthetics.
