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
        
        // Update the analysis text with common points and recommendations
        if (analysisResult.recommendations && Array.isArray(analysisResult.recommendations)) {
            const recommendationsHtml = analysisResult.recommendations
                .map(rec => `<p><strong>${rec.title}</strong>: ${rec.reason}</p>`)
                .join('');
                
            const analysisHtml = `
                <h3>Analysis</h3>
                <p>${analysisResult.commonPoints || 'No analysis available'}</p>
                <h3>Recommended Movies</h3>
                ${recommendationsHtml}
            `;
            
            console.log('Updating analysis result HTML');
            document.getElementById('analysisResult').innerHTML = analysisHtml;
            
            // Add recommended movie posters to the background
            addRecommendedMoviePosters(analysisResult.recommendations);
        } else {
            console.error('Invalid recommendations data:', analysisResult.recommendations);
            document.getElementById('analysisResult').innerHTML = '<p>Error: Invalid analysis data received</p>';
        }
    } catch (error) {
        console.error('Detailed error in analyzeMovies:', error);
        document.getElementById('analysisResult').innerHTML = `
            <p>Error analyzing movies. Please try again.</p>
            <p>Error details: ${error.message}</p>
        `;
    }
}

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

// Add event listener for the back button
document.getElementById('backButton').addEventListener('click', () => {
    console.log('Back button clicked');
    window.location.href = '/';  // 使用Flask路由
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
