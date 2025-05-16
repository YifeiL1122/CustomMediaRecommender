# Custom Media Recommender Website

## Project Scope

This project builds a personalized recommendation website for movies using user-entered favorite titles and Gemini AI's language capabilities. Users can enter their favorite movies, and the system generates tailored recommendations through the Gemini API. The recommendations are then displayed in an intuitive front-end interface, accompanied by visual explanations and a word cloud showing common themes.

**Objectives:**
- Enable personalized content recommendations through simple input.
- Leverage AI language reasoning to reflect user taste.
- Provide users with understandable and engaging recommendations.
- Allow users to manage personal movie lists.

**Boundaries:**
- Focus on single-user interaction.
- Supports direct input of movie titles.
- No authentication, social features, or user accounts in the initial version.

---

## Target Users

- Movie enthusiasts who want to discover new films based on their taste.
- Users who enjoy receiving smart, tailored suggestions from AI.
- Non-technical users seeking simple and intuitive recommendation tools.

---

## Features

- **Movie Input Interface**  
  Enter three favorite movies to receive personalized recommendations.

- **AI-Powered Analysis**  
  Google's Gemini AI analyzes common themes, styles, and elements across selected movies.

- **Visual Word Cloud**  
  Interactive word cloud showing key themes, genres, and elements from your selected movies.

- **Interactive Recommendation Cards**  
  Recommendations are shown in a visually clear card layout with movie posters, ratings, genres, and plot information.

- **Personal Movie Lists**  
  Add recommended movies to your watchlist or mark them as "not interested".

- **Background Visual Elements**  
  Dynamic movie poster background creates an immersive experience.

- **Responsive Design**  
  Works well on different screen sizes and devices.

---

## Timeline

| Week | Milestone                                               | Status |
|------|---------------------------------------------------------|--------|
| 1    | Research user needs and define Gemini prompt template   | ✅ Complete |
| 2    | Implement input UI and build movie search functions     | ✅ Complete |
| 3    | Integrate Gemini API and test recommendation logic      | ✅ Complete |
| 4    | Display formatted results and word cloud in UI          | ✅ Complete |
| 5    | Add interactivity to recommendation cards               | ✅ Complete |
| 6    | Implement personal movie lists and management           | ✅ Complete |
| 7    | Conduct user testing and refine the interface           | ✅ Complete |
| 8    | Final polishing and bug fixes                           | ✅ Complete |

---

## Contact Information

**Team Members:**

- Jialu Huang
*Email:* jhuang95@uw.edu
- Suzy Liu
*Email:* yifei92@uw.edu

---

## Development Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Virtual Environment Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:

On Windows:
```bash
.\venv\Scripts\activate
```

On macOS and Linux:
```bash
source venv/bin/activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

### Environment Variables

1. Create a `.env` file in the project root
2. Add your API keys:
```
OMDB_API_KEY=your_omdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the Application

1. Ensure your virtual environment is activated
2. Start the Flask application:
```bash
python app.py
```
3. Open your browser and navigate to `http://localhost:5000`

### Development Notes

- Always keep your virtual environment activated while developing
- After installing new packages, update requirements.txt:
```bash
pip freeze > requirements.txt
```
- Don't commit the `.env` file or the `venv` directory to version control

---

## Progress Notes

### Completed Features
- [x] Basic Flask application setup
- [x] Environment configuration with python-dotenv
- [x] Movie poster display functionality using OMDb API
- [x] Interactive UI with film reel icon and Courier font styling
- [x] Multiple movie poster display
- [x] Visual enhancements (opacity, shadows, transitions)
- [x] Movie input interface
- [x] Gemini API integration
- [x] Word cloud visualization
- [x] Recommendation card display with movie details
- [x] Local storage-based movie list management
- [x] Responsive design optimization

### Recent Updates
- [x] Improved text readability with expandable analysis section
- [x] Enhanced movie cards with poster, rating, genre and plot
- [x] Added personal movie list management
- [x] Converted all UI text to English
- [x] Optimized layout for various screen sizes

### Known Issues
- Movie poster images may occasionally fail to load
- Some obscure movie titles may not be recognized correctly
- Analysis text may become cut off on very small screens

