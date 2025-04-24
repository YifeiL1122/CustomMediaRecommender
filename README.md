# Custom Media Recommender Website

##  Project Scope

This project builds a personalized recommendation website for movies or music using user-uploaded collection data and ChatGPT's language capabilities. Users can upload a file containing their favorite media titles, ratings, and watch/listen dates. The backend system parses this file, extracts relevant information, and generates tailored recommendations through the ChatGPT API. The recommendations are then displayed in an intuitive front-end interface, accompanied by visual explanations.

**Objectives:**
- Enable personalized content recommendations through simple data upload.
- Leverage GPT's language reasoning to reflect user taste.
- Provide users with understandable and engaging recommendations.

**Boundaries:**
- Focus on single-user interaction.
- Only supports file-based input (CSV, JSON, TXT).
- No authentication, social features, or user accounts in the initial version.

---

## Target Users

- Individuals who keep personal lists of movies/music they've consumed.
- Users who enjoy receiving smart, tailored suggestions from AI.
- Non-technical users seeking simple and intuitive recommendation tools.

---

## Features

- **File Upload Interface**  
  Upload collection files in CSV, JSON, or TXT formats. Example fields: `Title`, `Rating`, `Date Watched`.

- **Data Parsing & Cleaning**  
  Extracts title, genre, and rating from the input file and processes the data for API use.

- **ChatGPT-Powered Recommendations**  
  A custom prompt is generated to retrieve 5 personalized recommendations with concise reasoning based on the user's past media preferences.

- **Interactive Recommendation Display**  
  Recommendations are shown in a visually clear and interactive layout. Users can click a recommendation to view more details.

- **Visualized API Feedback**  
  Displays insights into why certain recommendations were made. This could include:
  - Genre similarity scores
  - Shared keywords or themes
  - Rating distribution comparisons
  - Tag clouds of common descriptors

- **Expandable Architecture**  
  Ready for future features like feedback loops, login systems, history tracking, and music/movie API integration (e.g., Spotify, OMDb).

---

## Timeline

| Week | Milestone                                               |
|------|---------------------------------------------------------|
| 1    | Research user needs and define prompt template          |
| 2    | Implement upload UI and build file parser               |
| 3    | Integrate ChatGPT API and test recommendation logic     |
| 4    | Display formatted results in UI                         |
| 5    | Add interactivity to recommendation cards               |
| 6    | Implement visualized recommendation insights            |
| 7    | Conduct user testing and refine the interface           |
| 8    | Final polishing, deployment, and documentation          |

---

## Contact Information

**Team Member:**

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
2. Add your OMDb API key:
```
OMDB_API_KEY=your_api_key_here
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
- [x] Multiple movie poster display (13 positions)
- [x] Visual enhancements (opacity, shadows, transitions)

### In Progress
- [ ] File upload interface for user collections
- [ ] Data parsing system for uploaded files
- [ ] ChatGPT API integration
- [ ] Recommendation display interface
- [ ] Visualization of recommendation insights

### Next Steps
1. Implement file upload functionality
2. Develop data parsing system for different file formats
3. Design and integrate ChatGPT prompts for recommendations
4. Create interactive recommendation display
5. Add visualization features for recommendation explanations


