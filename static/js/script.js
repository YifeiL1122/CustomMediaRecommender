document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired - script starting');
    const movieInputs = document.querySelectorAll('.movie-input');
    const continueBtn = document.querySelector('.continue-btn');
    const posterBackground = document.querySelector('.poster-background');
    
    console.log('Elements selected:', 
                'Movie inputs found:', movieInputs.length, 
                'Continue button found:', continueBtn ? 'Yes' : 'No',
                'Poster background found:', posterBackground ? 'Yes' : 'No');

    // 一些经典电影的 IMDb ID，用于获取海报
    const movieIds = [
        'tt0111161', // The Shawshank Redemption
        'tt0068646', // The Godfather
        'tt0071562', // The Godfather: Part II
        'tt0468569', // The Dark Knight
        'tt0050083', // 12 Angry Men
        'tt0108052', // Schindler's List
        'tt0110912', // Pulp Fiction
        'tt0167260', // The Lord of the Rings: The Return of the King
        'tt0060196', // The Good, the Bad and the Ugly
        'tt0137523'  // Fight Club
    ];

    async function fetchMoviePoster(movieId) {
        try {
            console.log(`Attempting to fetch poster for movie ID: ${movieId}`);
            // 使用Flask后端API而不是直接调用OMDB
            const url = `/api/movie/${movieId}`;
            console.log(`Fetching from URL: ${url}`);
            const response = await fetch(url);
            console.log(`Response received, status: ${response.status}`);
            const data = await response.json();
            console.log(`Data parsed:`, data);
            if (data.Response === 'False') {
                console.log(`API returned false response for ${movieId}`);
                return null;
            }
            console.log(`Retrieved poster URL: ${data.Poster}`);
            return data.Poster;
        } catch (error) {
            console.error('Error fetching movie poster:', error);
            return null;
        }
    }

    async function createPoster(x, y, rotation) {
        console.log(`Creating poster at position: x=${x}, y=${y}, rotation=${rotation}`);
        const poster = document.createElement('div');
        poster.className = 'poster';
        poster.style.left = `${x}%`;
        poster.style.top = `${y}%`;
        poster.style.setProperty('--rotation', `${rotation}deg`);
        
        const randomMovieId = movieIds[Math.floor(Math.random() * movieIds.length)];
        console.log('Fetching poster for movie ID:', randomMovieId);
        const posterUrl = await fetchMoviePoster(randomMovieId);
        console.log('Poster URL:', posterUrl);
        
        if (posterUrl && posterUrl !== 'N/A') {
            console.log(`Setting background image for poster: ${posterUrl}`);
            poster.style.backgroundImage = `url(${posterUrl})`;
            return poster;
        }
        console.log('No valid poster URL received, not creating poster');
        return null;
    }

    // 添加更多随机位置的海报
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
        { x: 95, y: 85, rotation: 10 },
        { x: 40, y: 20, rotation: -20 },
        { x: 60, y: 90, rotation: 15 }
    ];

    async function setupPosters() {
        console.log('Setting up posters');
        for (const pos of posterPositions) {
            console.log(`Processing poster position: x=${pos.x}, y=${pos.y}`);
            const poster = await createPoster(pos.x, pos.y, pos.rotation);
            if (poster) {
                console.log('Appending poster to background');
                posterBackground.appendChild(poster);
            }
        }
        console.log('Finished setting up posters');
    }

    setupPosters();

    function updateContinueButton() {
        console.log('Updating continue button state');
        const filledInputs = Array.from(movieInputs).filter(input => input.value.trim() !== '');
        console.log(`Number of filled inputs: ${filledInputs.length}`);
        
        if (filledInputs.length < 3) {
            console.log('Not enough movies, disabling continue button');
            continueBtn.style.pointerEvents = 'none';
            continueBtn.style.backgroundColor = '#fff';
            continueBtn.style.borderColor = '#333';
            continueBtn.style.color = '#333';
        } else {
            console.log('Enough movies entered, enabling continue button');
            continueBtn.style.pointerEvents = 'auto';
            continueBtn.style.backgroundColor = '#333';
            continueBtn.style.borderColor = '#333';
            continueBtn.style.color = '#fff';
        }
    }

    movieInputs.forEach((input, index) => {
        console.log(`Adding input event listener to movie input ${index+1}`);
        input.addEventListener('input', updateContinueButton);
    });

    updateContinueButton();

    console.log('Adding keypress event listener to continue button');
    continueBtn.addEventListener('keypress', (e) => {
        console.log(`Key pressed on continue button: ${e.key}`);
        if (e.key === 'Enter' || e.key === ' ') {
            console.log('Enter or space pressed, triggering click');
            e.preventDefault();
            continueBtn.click();
        }
    });

    console.log('Adding click event listener to continue button');
    continueBtn.addEventListener('click', () => {
        console.log('Continue button clicked');
        
        const filledInputs = Array.from(movieInputs)
            .filter(input => input.value.trim() !== '')
            .map(input => input.value.trim());
        
        console.log('Filled inputs:', filledInputs);
            
        if (filledInputs.length >= 3) {
            console.log('At least 3 movie titles entered, continuing to analysis');
            // Store the movies in sessionStorage
            sessionStorage.setItem('selectedMovies', JSON.stringify(filledInputs));
            console.log('Movies stored in sessionStorage');
            
            // Navigate to the analysis page
            console.log('Attempting to navigate to /analysis');
            try {
                window.location.href = '/analysis';
                console.log('Navigation code executed');
            } catch (error) {
                console.error('Error during navigation:', error);
            }
        } else {
            console.log('Less than 3 movie titles, showing alert');
            alert('Please search for at least 3 movies before continuing.');
        }
    });
    
    console.log('Script initialization completed');
});