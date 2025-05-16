// analysis.js - 修改版本

// Get the stored movies from sessionStorage
const movies = JSON.parse(sessionStorage.getItem('selectedMovies')) || [];
console.log('Loaded movies from sessionStorage:', movies);

// Initialize the word cloud chart
let chart;
try {
    chart = echarts.init(document.getElementById('wordCloud'));
    console.log('Word cloud chart initialized');
} catch (error) {
    console.error('Error initializing word cloud chart:', error);
}

// Movie lists management module - IIFE
(function() {
    // Define list types
    const LIST_TYPES = {
        WATCHLIST: 'watchlist',
        FAVORITES: 'favorites',
        DISLIKED: 'disliked',
        WATCHED: 'watched'
    };
    
    // Get movie list by type
    function getMovieList(listType) {
        return JSON.parse(localStorage.getItem(listType) || '[]');
    }
    
    // Add movie to list
    function addMovieToList(movieTitle, listType) {
        if (!movieTitle) return false;
        
        const list = getMovieList(listType);
        
        // Check if movie already exists
        if (list.includes(movieTitle)) {
            return false; // Movie already exists
        }
        
        // Add movie and save
        list.push(movieTitle);
        localStorage.setItem(listType, JSON.stringify(list));
        return true; // Added successfully
    }
    
    // Remove movie from list
    function removeMovieFromList(movieTitle, listType) {
        if (!movieTitle) return false;
        
        const list = getMovieList(listType);
        const index = list.indexOf(movieTitle);
        
        // Check if movie is in list
        if (index === -1) {
            return false; // Movie not in list
        }
        
        // Remove movie and save
        list.splice(index, 1);
        localStorage.setItem(listType, JSON.stringify(list));
        return true; // Removed successfully
    }
    
    // Check if movie is in list
    function isMovieInList(movieTitle, listType) {
        if (!movieTitle) return false;
        
        const list = getMovieList(listType);
        return list.includes(movieTitle);
    }
    
    // Add to watchlist
    window.addToWatchlist = function(movieTitle, movieDetails = null) {
        console.log(`Adding "${movieTitle}" to watchlist`);
        
        // If movie is in disliked list, remove it first
        if (isMovieInList(movieTitle, LIST_TYPES.DISLIKED)) {
            removeMovieFromList(movieTitle, LIST_TYPES.DISLIKED);
        }
        
        // Add to watchlist
        if (addMovieToList(movieTitle, LIST_TYPES.WATCHLIST)) {
            // If we have details, store them too
            if (movieDetails) {
                // Get current stored movie details
                const storedDetails = JSON.parse(localStorage.getItem('movieDetails') || '{}');
                // Add or update details for this movie
                storedDetails[movieTitle] = movieDetails;
                localStorage.setItem('movieDetails', JSON.stringify(storedDetails));
            }
            
            showNotification(`Added "${movieTitle}" to watchlist`);
            updateMovieCardStatus(movieTitle);
            return true;
        } else {
            showNotification(`"${movieTitle}" is already in your watchlist`);
            return false;
        }
    };
    
    // Mark as disliked
    window.dislikeMovie = function(movieTitle) {
        console.log(`Marking "${movieTitle}" as disliked`);
        
        // If movie is in watchlist or favorites, remove it first
        if (isMovieInList(movieTitle, LIST_TYPES.WATCHLIST)) {
            removeMovieFromList(movieTitle, LIST_TYPES.WATCHLIST);
        }
        if (isMovieInList(movieTitle, LIST_TYPES.FAVORITES)) {
            removeMovieFromList(movieTitle, LIST_TYPES.FAVORITES);
        }
        
        // Add to disliked list
        if (addMovieToList(movieTitle, LIST_TYPES.DISLIKED)) {
            showNotification(`Marked "${movieTitle}" as not interested`);
            updateMovieCardStatus(movieTitle);
            return true;
        } else {
            showNotification(`"${movieTitle}" is already marked as not interested`);
            return false;
        }
    };
    
    // Add to favorites
    window.addToFavorites = function(movieTitle, movieDetails = null) {
        console.log(`Adding "${movieTitle}" to favorites`);
        
        // If movie is in disliked list, remove it first
        if (isMovieInList(movieTitle, LIST_TYPES.DISLIKED)) {
            removeMovieFromList(movieTitle, LIST_TYPES.DISLIKED);
        }
        
        // Add to favorites
        if (addMovieToList(movieTitle, LIST_TYPES.FAVORITES)) {
            // If we have details, store them too
            if (movieDetails) {
                // Get current stored movie details
                const storedDetails = JSON.parse(localStorage.getItem('movieDetails') || '{}');
                // Add or update details for this movie
                storedDetails[movieTitle] = movieDetails;
                localStorage.setItem('movieDetails', JSON.stringify(storedDetails));
            }
            
            showNotification(`Added "${movieTitle}" to favorites`);
            updateMovieCardStatus(movieTitle);
            return true;
        } else {
            showNotification(`"${movieTitle}" is already in your favorites`);
            return false;
        }
    };
    
    // Mark as watched
    window.markAsWatched = function(movieTitle, movieDetails = null) {
        console.log(`Marking "${movieTitle}" as watched`);
        
        // Add to watched list
        if (addMovieToList(movieTitle, LIST_TYPES.WATCHED)) {
            // If we have details, store them too
            if (movieDetails) {
                // Get current stored movie details
                const storedDetails = JSON.parse(localStorage.getItem('movieDetails') || '{}');
                // Add or update details for this movie
                storedDetails[movieTitle] = movieDetails;
                localStorage.setItem('movieDetails', JSON.stringify(storedDetails));
            }
            
            showNotification(`Marked "${movieTitle}" as watched`);
            updateMovieCardStatus(movieTitle);
            return true;
        } else {
            showNotification(`"${movieTitle}" is already marked as watched`);
            return false;
        }
    };
    
    // Update movie card status
    window.updateMovieCardStatus = function(movieTitle) {
        // Find all cards related to this movie
        const cards = document.querySelectorAll(`.recommendation-card[data-movie="${encodeURIComponent(movieTitle)}"]`);
        
        cards.forEach(card => {
            // Reset card classes
            card.classList.remove('in-watchlist', 'in-favorites', 'disliked', 'watched');
            
            // Add appropriate classes
            if (isMovieInList(movieTitle, LIST_TYPES.WATCHLIST)) {
                card.classList.add('in-watchlist');
            }
            if (isMovieInList(movieTitle, LIST_TYPES.FAVORITES)) {
                card.classList.add('in-favorites');
            }
            if (isMovieInList(movieTitle, LIST_TYPES.DISLIKED)) {
                card.classList.add('disliked');
            }
            if (isMovieInList(movieTitle, LIST_TYPES.WATCHED)) {
                card.classList.add('watched');
            }
            
            // Update button states
            updateButtonsInCard(card, movieTitle);
        });
    };
    
    // Update buttons in card
    function updateButtonsInCard(card, movieTitle) {
        // Update watchlist button
        const watchlistBtn = card.querySelector('.action-btn.add-to-list');
        if (watchlistBtn) {
            if (isMovieInList(movieTitle, LIST_TYPES.WATCHLIST)) {
                watchlistBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                    </svg>
                    In Watchlist
                `;
                watchlistBtn.classList.add('active');
            } else {
                watchlistBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    Add to Watchlist
                `;
                watchlistBtn.classList.remove('active');
            }
        }
        
        // Update dislike button
        const dislikeBtn = card.querySelector('.action-btn.dislike');
        if (dislikeBtn) {
            if (isMovieInList(movieTitle, LIST_TYPES.DISLIKED)) {
                dislikeBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Not Interested
                `;
                dislikeBtn.classList.add('active');
            } else {
                dislikeBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Not Interested
                `;
                dislikeBtn.classList.remove('active');
            }
        }
        
        // Update favorites button (if exists)
        const favoriteBtn = card.querySelector('.action-btn.add-favorite');
        if (favoriteBtn) {
            if (isMovieInList(movieTitle, LIST_TYPES.FAVORITES)) {
                favoriteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    Favorited
                `;
                favoriteBtn.classList.add('active');
            } else {
                favoriteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    Favorite
                `;
                favoriteBtn.classList.remove('active');
            }
        }
        
        // Update watched button (if exists)
        const watchedBtn = card.querySelector('.action-btn.mark-watched');
        if (watchedBtn) {
            if (isMovieInList(movieTitle, LIST_TYPES.WATCHED)) {
                watchedBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Watched
                `;
                watchedBtn.classList.add('active');
            } else {
                watchedBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Mark as Watched
                `;
                watchedBtn.classList.remove('active');
            }
        }
    }
    
    // Expose movie list management methods
    window.MovieLists = {
        types: LIST_TYPES,
        get: getMovieList,
        add: addMovieToList,
        remove: removeMovieFromList,
        isInList: isMovieInList,
        updateCardStatus: updateMovieCardStatus
    };
})();

// Fetch movie details
async function fetchMovieDetails(title) {
    try {
        console.log(`Fetching details for movie: ${title}`);
        
        // Build query URL - using your backend API
        const searchUrl = `/api/search?query=${encodeURIComponent(title)}&full=true`;
        
        const response = await fetch(searchUrl);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Detailed data for ${title}:`, data);
        
        // If we have search results, use the first one
        if (data.Search && data.Search.length > 0) {
            // Get the IMDB ID of the first result
            const imdbID = data.Search[0].imdbID;
            
            // Use IMDB ID to get full movie details
            const detailResponse = await fetch(`/api/movie/${imdbID}`);
            if (!detailResponse.ok) {
                throw new Error(`Detail API error: ${detailResponse.status}`);
            }
            
            const detailData = await detailResponse.json();
            console.log(`Full details for ${title}:`, detailData);
            
            return detailData;
        } else if (data.imdbID) {
            // Return detail data directly (if API already returned details)
            return data;
        } else {
            console.log(`No detailed results found for: ${title}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching movie details for ${title}:`, error);
        return null;
    }
}

// Function to fetch movie poster for a movie title
async function fetchMoviePosterByTitle(title) {
    try {
        // Use Flask backend API
        const url = `/api/search?query=${encodeURIComponent(title)}`;
        console.log(`Fetching poster for: ${title} with URL: ${url}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`API response for ${title}:`, data);
        
        if (data.Response === 'False') {
            console.log(`No poster found for: ${title}`, data.Error);
            return null;
        }
        
        // If we have search results, use the first one's poster
        if (data.Search && data.Search.length > 0 && data.Search[0].Poster && data.Search[0].Poster !== 'N/A') {
            console.log(`Found poster for: ${title}`, data.Search[0].Poster);
            return data.Search[0].Poster;
        } else if (data.Poster && data.Poster !== 'N/A') {
            console.log(`Found poster for: ${title}`, data.Poster);
            return data.Poster;
        } else {
            console.log(`No valid poster URL for: ${title}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching movie poster for ${title}:`, error);
        return null;
    }
}

// Function to create and add a poster to the background
async function createPoster(title, x, y, rotation) {
    console.log(`Creating poster for: ${title} at position: ${x}, ${y}, rotation: ${rotation}`);
    
    const poster = document.createElement('div');
    poster.className = 'poster';
    poster.style.left = `${x}%`;
    poster.style.top = `${y}%`;
    poster.style.setProperty('--rotation', `${rotation}deg`);
    
    const posterUrl = await fetchMoviePosterByTitle(title);
    
    if (posterUrl && posterUrl !== 'N/A') {
        console.log(`Setting background image for ${title}: ${posterUrl}`);
        poster.style.backgroundImage = `url('${posterUrl}')`;
        return poster;
    } else {
        console.log(`Could not create poster for: ${title} - no valid URL`);
        return null;
    }
}

// Function to add recommended movie posters to the background
async function addRecommendedMoviePosters(recommendedMovies) {
    console.log('Adding recommended movie posters:', recommendedMovies);
    
    // Check if poster-background element exists
    const posterBackground = document.querySelector('.poster-background');
    if (!posterBackground) {
        console.error('Poster background element not found in the DOM');
        return;
    }
    
    console.log('Found poster background element');
    
    // Clear existing posters (if any)
    posterBackground.innerHTML = '';
    
    // Set poster positions
    const posterPositions = [
        { x: 5, y: 15, rotation: -15 },
        { x: 85, y: 25, rotation: 12 },
        { x: 10, y: 65, rotation: 8 },
        { x: 80, y: 75, rotation: -10 },
        { x: 92, y: 45, rotation: 15 },
        { x: 15, y: 35, rotation: -8 },
        { x: 75, y: 15, rotation: 5 },
        { x: 25, y: 85, rotation: -12 },
        { x: 70, y: 55, rotation: 7 },
        { x: 3, y: 90, rotation: -5 },
        { x: 95, y: 85, rotation: 10 }
    ];
    
    let addedPosters = 0;
    
    // Add posters for recommended movies
    console.log(`Adding posters for ${recommendedMovies.length} recommended movies`);
    for (let i = 0; i < recommendedMovies.length && i < posterPositions.length; i++) {
        const pos = posterPositions[i];
        const title = recommendedMovies[i].title;
        console.log(`Processing recommended movie ${i+1}: ${title}`);
        
        const poster = await createPoster(title, pos.x, pos.y, pos.rotation);
        if (poster) {
            console.log(`Appending poster for ${title} to background`);
            posterBackground.appendChild(poster);
            addedPosters++;
        }
    }
    
    // Add posters for user input movies
    console.log(`Adding posters for ${movies.length} input movies`);
    for (let i = 0; i < movies.length && i < posterPositions.length - recommendedMovies.length; i++) {
        const index = i + recommendedMovies.length;
        if (index < posterPositions.length) {
            const pos = posterPositions[index];
            const title = movies[i];
            console.log(`Processing input movie ${i+1}: ${title}`);
            
            const poster = await createPoster(title, pos.x, pos.y, pos.rotation);
            if (poster) {
                console.log(`Appending poster for ${title} to background`);
                posterBackground.appendChild(poster);
                addedPosters++;
            }
        }
    }
    
    // If no posters were added, try adding default posters
    if (addedPosters === 0) {
        console.log('No posters were added, trying to add default posters');
        
        // Some classic movie titles to get posters for
        const fallbackMovies = [
            'The Shawshank Redemption',
            'The Godfather', 
            'Pulp Fiction',
            'The Dark Knight',
            'Fight Club'
        ];
        
        for (let i = 0; i < fallbackMovies.length && i < posterPositions.length; i++) {
            const pos = posterPositions[i];
            const title = fallbackMovies[i];
            console.log(`Trying fallback movie: ${title}`);
            
            const poster = await createPoster(title, pos.x, pos.y, pos.rotation);
            if (poster) {
                console.log(`Appending fallback poster for ${title}`);
                posterBackground.appendChild(poster);
            }
        }
    }
}

// Format analysis text
function formatAnalysisText(text) {
    // Split text into paragraphs
    const paragraphs = text.split(/\n\n|\.\s+(?=[A-Z])/g).filter(p => p.trim().length > 0);
    
    // Create HTML with appropriate markup
    return paragraphs.map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
}

// Format recommendation reason
function formatRecommendationReason(reason) {
    // Properly format the text, highlighting key phrases
    return reason
        .replace(/themes/gi, '<em>themes</em>')
        .replace(/style/gi, '<em>style</em>')
        .replace(/characters/gi, '<em>characters</em>')
        .replace(/cinematography/gi, '<em>cinematography</em>')
        .replace(/directing/gi, '<em>directing</em>');
}

// Toggle display of analysis text
function toggleAnalysisDisplay() {
    const content = document.getElementById('analysisContent');
    const button = document.getElementById('toggleAnalysis');
    const buttonText = button.querySelector('.toggle-text');
    const buttonIcon = button.querySelector('.toggle-icon');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        buttonText.textContent = 'Collapse';
        buttonIcon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('collapsed');
        buttonText.textContent = 'Expand';
        buttonIcon.style.transform = 'rotate(0deg)';
    }
}

// Create rating stars display
function createRatingStars(rating) {
    if (!rating || isNaN(rating)) return ''; 
    
    // Convert rating to 1-5 stars (IMDb ratings are 1-10)
    const normalizedRating = parseFloat(rating) / 2;
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 1; i <= Math.floor(normalizedRating); i++) {
        starsHtml += '<span class="star full">★</span>';
    }
    
    // Half star (if rating has decimal part >= 0.5)
    if (normalizedRating % 1 >= 0.5) {
        starsHtml += '<span class="star half">★</span>';
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(normalizedRating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span class="star empty">☆</span>';
    }
    
    return starsHtml;
}

// Update UI with recommendations
function updateUIWithRecommendations(analysisResult) {
    console.log('Updating UI with enhanced recommendations:', analysisResult.recommendations);
    
    // Format analysis text
    const formattedAnalysis = formatAnalysisText(analysisResult.commonPoints || 'No analysis available');
    
    // Format movie recommendations with details
    const recommendationsHtml = analysisResult.recommendations
        .map((rec, index) => {
            // Extract useful information from details (if available)
            const details = rec.details || {};
            const rating = details.imdbRating ? `${details.imdbRating}/10` : 'N/A';
            const year = details.Year || 'N/A';
            const runtime = details.Runtime || 'N/A';
            const genre = details.Genre || '';
            const plot = details.Plot || rec.reason; // Use recommendation reason if no plot is available
            
            // Create star rating display
            const stars = createRatingStars(details.imdbRating);
            
            // Check movie status in various lists
            const inWatchlist = window.MovieLists && window.MovieLists.isInList(rec.title, window.MovieLists.types.WATCHLIST);
            const inFavorites = window.MovieLists && window.MovieLists.isInList(rec.title, window.MovieLists.types.FAVORITES);
            const isDisliked = window.MovieLists && window.MovieLists.isInList(rec.title, window.MovieLists.types.DISLIKED);
            const isWatched = window.MovieLists && window.MovieLists.isInList(rec.title, window.MovieLists.types.WATCHED);
            
            // Build HTML with data attributes and status classes - using card layout
            return `
                <div class="recommendation-card ${inWatchlist ? 'in-watchlist' : ''} 
                                             ${inFavorites ? 'in-favorites' : ''} 
                                             ${isDisliked ? 'disliked' : ''}
                                             ${isWatched ? 'watched' : ''}"
                     data-movie="${encodeURIComponent(rec.title)}"
                     data-imdbid="${details.imdbID || ''}">
                    <div class="recommendation-poster">
                        ${details.Poster && details.Poster !== 'N/A' ? 
                            `<img src="${details.Poster}" alt="${rec.title} poster" class="movie-poster-small">` : 
                            `<div class="poster-placeholder">${rec.title.charAt(0)}</div>`
                        }
                        
                        <div class="movie-badges">
                            ${inWatchlist ? '<span class="badge watchlist-badge" title="In Watchlist">📋</span>' : ''}
                            ${inFavorites ? '<span class="badge favorite-badge" title="Favorited">❤️</span>' : ''}
                            ${isWatched ? '<span class="badge watched-badge" title="Watched">👁️</span>' : ''}
                            ${isDisliked ? '<span class="badge disliked-badge" title="Not Interested">✕</span>' : ''}
                        </div>
                    </div>
                    <div class="recommendation-details">
                        <div class="recommendation-header">
                            <h4>${rec.title}</h4>
                            <div class="movie-meta">
                                <span class="year">${year}</span>
                                <span class="runtime">${runtime}</span>
                            </div>
                        </div>
                        
                        <div class="movie-rating-container">
                            <div class="rating-stars">${stars}</div>
                            <span class="rating-value">${rating}</span>
                        </div>
                        
                        <div class="movie-genres">
                            ${genre ? genre.split(',').map(g => `<span class="genre-tag">${g.trim()}</span>`).join('') : ''}
                        </div>
                        
                        <div class="movie-plot">
                            <p>${plot}</p>
                        </div>
                        
                        <div class="recommendation-actions">
                            <button class="action-btn add-to-list ${inWatchlist ? 'active' : ''}" data-movie="${encodeURIComponent(rec.title)}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    ${inWatchlist ? 
                                        `<path d="M9 11l3 3L22 4"></path>
                                         <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>` : 
                                        `<path d="M12 5v14M5 12h14"></path>`
                                    }
                                </svg>
                                ${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                            </button>
                            
                            <button class="action-btn dislike ${isDisliked ? 'active' : ''}" data-movie="${encodeURIComponent(rec.title)}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                ${isDisliked ? 'Not Interested' : 'Not Interested'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');
    
    // Complete analysis result HTML
    const analysisHtml = `
        <div class="analysis-container">
            <div class="analysis-section">
                <div class="section-header">
                    <h3>Movie Analysis</h3>
                    <button id="toggleAnalysis" class="toggle-btn">
                        <span class="toggle-text">Expand</span>
                        <svg class="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
                <div id="analysisContent" class="analysis-content collapsed">
                    ${formattedAnalysis}
                </div>
            </div>
            
            <div class="recommendations-section">
                <h3>Recommendations</h3>
                <div class="recommendations-grid">
                    ${recommendationsHtml}
                </div>
            </div>
            
            <div class="my-lists-section">
                <button id="viewWatchlistBtn" class="list-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                    </svg>
                    View My Lists
                </button>
            </div>
        </div>
    `;
    
    // Update DOM
    console.log('Updating analysis result HTML with detailed information');
    document.getElementById('analysisResult').innerHTML = analysisHtml;
    
    // Add event listeners
    document.getElementById('toggleAnalysis').addEventListener('click', toggleAnalysisDisplay);
    
    // Add event listeners for all action buttons
    document.querySelectorAll('.action-btn.add-to-list').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieTitle = decodeURIComponent(e.currentTarget.dataset.movie);
            // Find movie details
            const movieData = analysisResult.recommendations.find(m => m.title === movieTitle);
            // Add to watchlist with details (if available)
            window.addToWatchlist(movieTitle, movieData?.details || null);
        });
    });
    
    document.querySelectorAll('.action-btn.dislike').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieTitle = decodeURIComponent(e.currentTarget.dataset.movie);
            window.dislikeMovie(movieTitle);
        });
    });
    
    // List view button
    document.getElementById('viewWatchlistBtn').addEventListener('click', () => {
        showWatchlistModal();
    });
    
    // Add recommended movie posters to background
    addRecommendedMoviePosters(analysisResult.recommendations);
}

// Show movie list management modal
function showWatchlistModal() {
    console.log('Showing watchlist modal');
    
    // Get all list types
    const watchlist = window.MovieLists.get(window.MovieLists.types.WATCHLIST);
    const favorites = window.MovieLists.get(window.MovieLists.types.FAVORITES);
    const watched = window.MovieLists.get(window.MovieLists.types.WATCHED);
    const disliked = window.MovieLists.get(window.MovieLists.types.DISLIKED);
    
    // Get stored movie details
    const storedDetails = JSON.parse(localStorage.getItem('movieDetails') || '{}');
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>My Lists</h2>
                    <button class="modal-close-btn">×</button>
                </div>
                
                <div class="modal-tabs">
                    <button class="modal-tab active" data-tab="watchlist">Watchlist (${watchlist.length})</button>
                    <button class="modal-tab" data-tab="favorites">Favorites (${favorites.length})</button>
                    <button class="modal-tab" data-tab="watched">Watched (${watched.length})</button>
                    <button class="modal-tab" data-tab="disliked">Not Interested (${disliked.length})</button>
                </div>
                
                <div class="modal-content">
                    <div class="modal-tab-content active" id="watchlist-content">
                        ${generateMovieListHtml(watchlist, storedDetails)}
                    </div>
                    <div class="modal-tab-content" id="favorites-content">
                        ${generateMovieListHtml(favorites, storedDetails)}
                    </div>
                    <div class="modal-tab-content" id="watched-content">
                        ${generateMovieListHtml(watched, storedDetails)}
                    </div>
                    <div class="modal-tab-content" id="disliked-content">
                        ${generateMovieListHtml(disliked, storedDetails)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create modal element
    const modalElement = document.createElement('div');
    modalElement.id = 'watchlistModal';
    modalElement.innerHTML = modalHtml;
    
    // Add to page
    document.body.appendChild(modalElement);
    
    // Add event listeners
    document.querySelector('.modal-close-btn').addEventListener('click', () => {
        document.body.removeChild(modalElement);
    });
    
    // Click outside modal to close
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.modal-overlay')) {
            document.body.removeChild(modalElement);
        }
    });
    
    // Tab switching
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state from all tabs
            document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
            
            // Activate current tab
            tab.classList.add('active');
            const tabId = tab.dataset.tab;
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // Add event listeners for movie items
    addMovieItemEventListeners(modalElement);
}

// Generate movie list HTML
function generateMovieListHtml(movies, detailsMap) {
    if (movies.length === 0) {
        return `<div class="empty-list">This list is empty</div>`;
    }
    
    // Create list HTML
    return `
        <div class="movie-list">
            ${movies.map(title => {
                // Try to get movie details
                const details = detailsMap[title] || {};
                
                // Extract info
                const poster = details.Poster && details.Poster !== 'N/A' ? details.Poster : null;
                const year = details.Year || '';
                const rating = details.imdbRating ? `${details.imdbRating}/10` : '';
                
                return `
                    <div class="movie-list-item" data-movie="${encodeURIComponent(title)}">
                        <div class="movie-list-poster">
                            ${poster ? 
                                `<img src="${poster}" alt="${title} poster" class="movie-poster-small">` : 
                                `<div class="movie-poster-placeholder">${title.charAt(0)}</div>`
                            }
                        </div>
                        <div class="movie-list-info">
                            <div class="movie-list-title">${title}</div>
                            <div class="movie-list-meta">
                                ${year ? `<span class="movie-list-year">${year}</span>` : ''}
                                ${rating ? `<span class="movie-list-rating">⭐ ${rating}</span>` : ''}
                            </div>
                        </div>
                        <div class="movie-list-actions">
                            <button class="movie-list-btn remove-btn" data-movie="${encodeURIComponent(title)}" data-action="remove">Remove</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Add event listeners to movie list items
function addMovieItemEventListeners(modalElement) {
    // Remove buttons
    modalElement.querySelectorAll('.movie-list-btn.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            
            const movieTitle = decodeURIComponent(btn.dataset.movie);
            const activeTab = modalElement.querySelector('.modal-tab.active').dataset.tab;
            
            // Determine which list to remove from based on active tab
            let listType;
            switch(activeTab) {
                case 'watchlist':
                    listType = window.MovieLists.types.WATCHLIST;
                    break;
                case 'favorites':
                    listType = window.MovieLists.types.FAVORITES;
                    break;
                case 'watched':
                    listType = window.MovieLists.types.WATCHED;
                    break;
                case 'disliked':
                    listType = window.MovieLists.types.DISLIKED;
                    break;
                default:
                    return; // Unknown list type
            }
            
            // Remove from list
            if (window.MovieLists.remove(movieTitle, listType)) {
                // Update UI
                const parentItem = btn.closest('.movie-list-item');
                parentItem.classList.add('removed');
                
                // Remove element after brief animation
                setTimeout(() => {
                    parentItem.remove();
                    
                    // If list is now empty, show empty message
                    const movieList = btn.closest('.movie-list');
                    if (movieList && movieList.children.length === 0) {
                        const tabContent = movieList.closest('.modal-tab-content');
                        tabContent.innerHTML = `<div class="empty-list">This list is empty</div>`;
                    }
                    
                    // Update tab counts
                    updateTabCounts(modalElement);
                    
                    // Update card status if movie is displayed on page
                    window.updateMovieCardStatus(movieTitle);
                    
                    // Show notification
                    showNotification(`Removed "${movieTitle}" from list`);
                }, 300);
            }
        });
    });
    
    // Click on movie item to open details
    modalElement.querySelectorAll('.movie-list-item').forEach(item => {
        item.addEventListener('click', () => {
            const movieTitle = decodeURIComponent(item.dataset.movie);
            
            // Get movie details
            const storedDetails = JSON.parse(localStorage.getItem('movieDetails') || '{}');
            const details = storedDetails[movieTitle] || {};
            
            // If we have IMDb ID, open IMDb page
            if (details.imdbID) {
                window.open(`https://www.imdb.com/title/${details.imdbID}`, '_blank');
            } else {
                // Otherwise search for the movie
                window.open(`https://www.imdb.com/find?q=${encodeURIComponent(movieTitle)}`, '_blank');
            }
        });
    });
}

// Update tab counts
function updateTabCounts(modalElement) {
    const watchlist = window.MovieLists.get(window.MovieLists.types.WATCHLIST);
    const favorites = window.MovieLists.get(window.MovieLists.types.FAVORITES);
    const watched = window.MovieLists.get(window.MovieLists.types.WATCHED);
    const disliked = window.MovieLists.get(window.MovieLists.types.DISLIKED);
    
    // Update tab text
    modalElement.querySelector('.modal-tab[data-tab="watchlist"]').textContent = `Watchlist (${watchlist.length})`;
    modalElement.querySelector('.modal-tab[data-tab="favorites"]').textContent = `Favorites (${favorites.length})`;
    modalElement.querySelector('.modal-tab[data-tab="watched"]').textContent = `Watched (${watched.length})`;
    modalElement.querySelector('.modal-tab[data-tab="disliked"]').textContent = `Not Interested (${disliked.length})`;
}

// Show notification
window.showNotification = function(message) {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // If not, create one
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Animation effect
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Remove element after animation
        setTimeout(() => {
            notification.remove();
            
            // If container is empty, remove it too
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300);
    }, 3000);
};

// Function to update the word cloud
function updateWordCloud(data) {
    console.log('Updating word cloud with data:', data);
    
    // Check if data is valid
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('Invalid or empty data for word cloud:', data);
        document.getElementById('analysisResult').innerHTML += '<p>Error: Invalid data for word cloud visualization</p>';
        return;
    }
    
    // Ensure chart is initialized
    if (!chart) {
        console.error('Chart not initialized, attempting to reinitialize');
        try {
            const wordCloudElement = document.getElementById('wordCloud');
            
            // Ensure wordCloud element exists and has dimensions
            if (wordCloudElement) {
                console.log('WordCloud element dimensions:', 
                            wordCloudElement.offsetWidth, 
                            wordCloudElement.offsetHeight);
                
                // If element has no height, set a minimum height
                if (wordCloudElement.offsetHeight < 100) {
                    wordCloudElement.style.height = '400px';
                    console.log('Set minimum height for wordCloud container');
                }
                
                chart = echarts.init(wordCloudElement);
                console.log('Chart reinitialized');
            } else {
                console.error('WordCloud element not found in the DOM');
                return;
            }
        } catch (error) {
            console.error('Failed to reinitialize chart:', error);
            return;
        }
    }

    // Simplify data structure, ensure data format is correct
    const processedData = data.map(item => {
        // Ensure each item has necessary properties
        return {
            name: String(item.name || 'Unknown'),
            value: Number(item.value || 50),  // Default value is 50
            category: String(item.category || 'Other')
        };
    });
    
    console.log('Processed data for chart:', processedData);

    try {
        const option = {
            tooltip: {
                show: true,
                formatter: function(params) {
                    return `${params.name}<br/>Category: ${params.data.category}`;
                }
            },
            series: [{
                type: 'wordCloud',
                shape: 'circle',
                left: 'center',
                top: 'center',
                width: '90%',
                height: '90%',
                right: null,
                bottom: null,
                sizeRange: [12, 60],
                rotationRange: [-90, 90],
                rotationStep: 45,
                gridSize: 8,
                drawOutOfBound: false,
                textStyle: {
                    fontFamily: 'Courier, monospace',
                    fontWeight: 'bold',
                    color: '#000000' // All words are black now
                },
                emphasis: {
                    focus: 'self',
                    textStyle: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: processedData
            }]
        };

        console.log('Setting chart option');
        chart.setOption(option);
        
        // Force redraw to ensure chart displays
        setTimeout(() => {
            if (chart) {
                console.log('Forcing chart resize');
                chart.resize();
            }
        }, 500);
    } catch (error) {
        console.error('Error updating word cloud:', error);
        document.getElementById('analysisResult').innerHTML += `
            <p>Error rendering word cloud: ${error.message}</p>
        `;
    }
}

// Function to call Gemini API
async function analyzeMovies(movies) {
    console.log('Starting movie analysis for:', movies);
    
    const apiKey = 'AIzaSyDX9zdJZ_gjtzsMJVmXpydlWhhLBJqQrEU';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `Analyze these three movies in detail: ${movies.join(', ')}. 
    Please provide a comprehensive analysis including:
    1. Common themes, narrative styles, and storytelling elements
    2. Shared character archetypes and development patterns
    3. Similar production elements and technical aspects
    4. Genre overlaps and unique combinations
    
    Based on this analysis, also suggest three new movie recommendations that viewers might enjoy.
    
    Please return the analysis in JSON format with the following structure:
    {
        "keywords": [
            {"name": "keyword", "value": weight(10-100), "category": "Theme/Genre/Style/Element"}
        ],
        "commonPoints": "Detailed analysis of common elements and themes",
        "recommendations": [
            {
                "title": "Movie Title",
                "reason": "Brief explanation of why this movie is recommended"
            }
        ]
    }
    
    Note: Please provide at least 20 keywords across different categories for a rich word cloud visualization.`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        safetySettings: [{
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
        }
    };

    try {
        console.log('Sending request to Gemini API with URL:', apiUrl);
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error Response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        // Extract the text from the response
        const text = data.candidates[0].content.parts[0].text;
        console.log('Extracted text:', text);
        
        // Clean Markdown code block markers (if present)
        let cleanedText = text;
        
        // Remove Markdown code block indicators (if present)
        if (text.includes('```json')) {
            cleanedText = text.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (text.includes('```')) {
            cleanedText = text.replace(/```\s*/, '').replace(/```\s*$/, '');
        }
        
        // Parse the cleaned text as JSON
        const analysisResult = JSON.parse(cleanedText);
        console.log('Parsed analysis result:', analysisResult);
        
        // Update the word cloud with keywords
        if (analysisResult.keywords && Array.isArray(analysisResult.keywords)) {
            console.log('Updating word cloud with keywords:', analysisResult.keywords);
            updateWordCloud(analysisResult.keywords);
        } else {
            console.error('Invalid keywords data:', analysisResult.keywords);
            document.getElementById('analysisResult').innerHTML = '<p>Error: Invalid keywords data received from API</p>';
            return;
        }
        
        // Fetch detailed information for recommended movies
        if (analysisResult.recommendations && Array.isArray(analysisResult.recommendations)) {
            console.log('Fetching detailed information for recommended movies');
            
            // Get details for all recommended movies
            const movieDetailsPromises = analysisResult.recommendations.map(async (rec) => {
                try {
                    // Enhance movie object with details
                    const detailedMovie = await fetchMovieDetails(rec.title);
                    return {
                        ...rec,
                        details: detailedMovie
                    };
                } catch (error) {
                    console.error(`Error fetching details for ${rec.title}:`, error);
                    return rec; // Return original recommendation object if error
                }
            });
            
            // Wait for all detail requests to complete
            Promise.all(movieDetailsPromises)
                .then(enhancedRecommendations => {
                    // Update UI with enhanced recommendation data
                    analysisResult.recommendations = enhancedRecommendations;
                    updateUIWithRecommendations(analysisResult);
                })
                .catch(error => {
                    console.error('Error processing movie details:', error);
                    // Still update UI with original data
                    updateUIWithRecommendations(analysisResult);
                });
        } else {
            document.getElementById('analysisResult').innerHTML = '<p>Error: Invalid recommendations data received</p>';
        }
    } catch (error) {
        console.error('Detailed error in analyzeMovies:', error);
        document.getElementById('analysisResult').innerHTML = `
            <p>Error analyzing movies. Please try again.</p>
            <p>Error details: ${error.message}</p>
        `;
    }
}

// Add event listener for the back button
document.getElementById('backButton').addEventListener('click', () => {
    console.log('Back button clicked');
    window.location.href = '/';  // Use Flask routes
});

// Start the analysis when the page loads
window.addEventListener('load', () => {
    console.log('Page loaded, checking for movies');
    
    if (movies.length > 0) {
        console.log('Starting analysis for movies:', movies);
        analyzeMovies(movies);
    } else {
        console.log('No movies found in sessionStorage');
        document.getElementById('analysisResult').textContent = 'No movies selected. Please go back and select at least three movies.';
    }
});