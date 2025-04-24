document.addEventListener('DOMContentLoaded', () => {
    const movieInputs = document.querySelectorAll('.movie-input');
    const continueBtn = document.querySelector('.continue-btn');
    const posterBackground = document.querySelector('.poster-background');

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

    const API_KEY = 'd8a61810';

    async function fetchMoviePoster(movieId) {
        try {
            const url = `http://www.omdbapi.com/?apikey=d8a61810&i=${movieId}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === 'False') {
                return null;
            }
            return data.Poster;
        } catch (error) {
            console.error('Error fetching movie poster:', error);
            return null;
        }
    }

    async function createPoster(x, y, rotation) {
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
            poster.style.backgroundImage = `url(${posterUrl})`;
            return poster;
        }
        console.log('No valid poster URL received');
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
        for (const pos of posterPositions) {
            const poster = await createPoster(pos.x, pos.y, pos.rotation);
            if (poster) {
                posterBackground.appendChild(poster);
            }
        }
    }

    setupPosters();

    function updateContinueButton() {
        const filledInputs = Array.from(movieInputs).filter(input => input.value.trim() !== '');
        if (filledInputs.length < 3) {
            continueBtn.style.pointerEvents = 'none';
            continueBtn.style.backgroundColor = '#fff';
            continueBtn.style.borderColor = '#333';
            continueBtn.style.color = '#333';
        } else {
            continueBtn.style.pointerEvents = 'auto';
            continueBtn.style.backgroundColor = '#333';
            continueBtn.style.borderColor = '#333';
            continueBtn.style.color = '#fff';
        }
    }

    movieInputs.forEach(input => {
        input.addEventListener('input', updateContinueButton);
    });

    updateContinueButton();

    continueBtn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            continueBtn.click();
        }
    });

    continueBtn.addEventListener('click', () => {
        const movies = Array.from(movieInputs).map(input => input.value.trim());
        console.log('Selected movies:', movies);
        alert('Thank you for your movie selections! We\'ll use these to find your next favorite movies.');
    });
}); 