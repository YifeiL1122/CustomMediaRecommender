# Custom Media Recommender Website

##  Project Scope

This project builds a personalized recommendation website for movies or music using user-uploaded collection data and ChatGPT’s language capabilities. Users can upload a file containing their favorite media titles, ratings, and watch/listen dates. The backend system parses this file, extracts relevant information, and generates tailored recommendations through the ChatGPT API. The recommendations are then displayed in an intuitive front-end interface, accompanied by visual explanations.

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

- Individuals who keep personal lists of movies/music they’ve consumed.
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


