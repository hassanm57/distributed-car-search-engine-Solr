# Distributed Car Review Search Engine 🚗🔍

A distributed search engine for car reviews, built with Python, FastAPI, Apache Solr, and React. The project combines intelligent scraping, cleaning, semantic search, and AI-based ranking to deliver fast, accurate results for car review queries.

## 📦 Features

- **Web Scraping**: Extracts reviews from [carsguide.com.au](https://www.carsguide.com.au/) using BeautifulSoup.
- **Data Cleaning**: Removes HTML noise and irrelevant content.
- **Visualization**: Histograms, bar plots, and word clouds from review content.
- **Apache Solr Integration**: For full-text, faceted, and semantic search.
- **Generative AI Ranking**: Uses Gemini to re-rank search results.
- **Backend**: FastAPI serves RESTful APIs for frontend and Solr interaction.
- **Frontend**: Built with React for a responsive and modern UI.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Python 3.x
- Node.js (if running frontend manually)

### Run the App

```bash
# Inside webapp/ directory
docker-compose up --build
