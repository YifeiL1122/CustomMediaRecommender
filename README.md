# Custom Movie Recommendation Website

## Project Overview
This project delivers a personalized movie recommendation website powered by Google’s Gemini AI and OMDb. Users can enter their favorite movies (or upload a simple list) and receive tailored suggestions along with visual explanations. The interface displays word clouds, interactive recommendation cards, and lets users manage personal watchlists—all within a responsive, engaging UI. 😊

**Objectives:**
- Generate personalized movie recommendations based on user-provided titles.
- Leverage Gemini AI’s language reasoning to analyze common themes and styles.
- Present recommendations in an intuitive, interactive interface with visual insights.
- Allow users to maintain personal movie lists (watchlist / “not interested”).
- Prepare the architecture for future enhancements (file uploads, authentication, music integration).

**Scope & Boundaries:**
- Focus on single-user interaction (no multi-account system in v1).
- Support direct movie-title input (three titles) for recommendations.
- No user authentication or social sharing in the initial release.
- Basic persistence via localStorage; database integration is planned later.

---

## Target Users
- Movie enthusiasts who keep personal lists of films they’ve watched.
- Anyone looking to discover new movies based on their tastes.
- Users who enjoy AI-generated insights and clear visual explanations.
- Non-technical individuals seeking a simple, web‐based recommendation tool.

---

## Key Features

1. **Movie Input Interface**  
   - Users enter three favorite movie titles.
   - Client-side validation to ensure valid inputs.

2. **AI-Powered Analysis**  
   - Google Gemini AI processes the entered titles.
   - Extracts common themes, genres, and elements.

3. **Recommendation Generation**  
   - Gemini AI suggests five new movies with concise reasoning.
   - OMDb API integration fetches posters and metadata (rating, genre, plot).

4. **Visual Word Cloud**  
   - ECharts-powered word cloud displays keywords from selected movies.
   - Helps users see thematic overlaps at a glance.

5. **Interactive Recommendation Cards**  
   - Each card shows poster (300px height), title, genre, rating, and a short synopsis.
   - Clickable cards expand to show more details and “Add to Watchlist” / “Not Interested” buttons.

6. **Personal Movie Lists**  
   - **Watchlist**: Add or remove recommended movies.
   - **Not Interested**: Mark suggestions to exclude from future sessions.
   - **List Management Modal**: View, filter, and manage all saved movies.
   - **Status Tracking**: Visual indicators (e.g., icons or colored tags) show each movie’s status.

7. **Dynamic Background Poster**  
   - The landing page features a rotating background of user-selected or recommended movie posters, creating an immersive feel.

8. **Responsive Design**  
   - Optimized for both mobile and desktop.
   - Smooth animations and hover effects (e.g., card elevation, image transitions).

9. **Markdown Rendering**  
   - Any textual explanations or analysis are rendered via marked.js for consistent formatting.

10. **Technical Infrastructure**  
    - **Backend:** Flask API endpoints handle movie search, Gemini prompts, and OMDb calls.
    - **Session Management:** Client-side storage (localStorage) for user selections.
    - **Error Handling:** Graceful fallbacks, user notifications for failed API calls.
    - **Cross-Browser Compatibility:** Tested on Chrome, Firefox, Safari, and Edge.

---

## Timeline & Milestones

| Week | Milestone                                               | Status      |
| ---- | ------------------------------------------------------- | ----------- |
| 1    | Research user needs and define Gemini prompt template   | ✅ Complete |
| 2    | Implement input UI and build movie search functions     | ✅ Complete |
| 3    | Integrate Gemini API and test recommendation logic      | ✅ Complete |
| 4    | Display formatted results and word cloud in UI          | ✅ Complete |
| 5    | Add interactivity to recommendation cards               | ✅ Complete |
| 6    | Implement personal movie lists and management           | ✅ Complete |
| 7    | Conduct user testing and refine the interface           | ✅ Complete |
| 8    | Final polishing, deployment optimization, documentation | ✅ Complete |

---

## Installation & Setup

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/movie-recommender.git
   cd movie-recommender
