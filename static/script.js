const trackList = document.getElementById('track-list');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const recommendedSongs = document.getElementById('recommended-songs');
const musicPlayer = document.getElementById('music-player');


let storeLibrary = {
    "new-release": [],
    "top-songs": [],
    "new-songs": [],
    "old-songs": []
};

let storeSong = {};

let track_for_search= null;

function createTrackTable(tracks, headingText) {
    const parts = document.createDocumentFragment();

    const heading = document.createElement('h2');
    heading.innerText = headingText;
    heading.classList.add('new-song-heading');
    parts.appendChild(heading);

    const table = document.createElement('table');
    table.classList.add('track-table');

    const tbody = document.createElement('tbody');

    tracks.forEach(track => {
        const row = document.createElement('tr');
        row.id = track.trackId;

        // Image column
        const imgCell = document.createElement('td');
        const trackImg = document.createElement('img');
        trackImg.src = track.trackImage;
        imgCell.appendChild(trackImg);
        row.appendChild(imgCell);

        // Song Name column
        const nameCell = document.createElement('td');
        nameCell.innerText = track.songName;
        row.appendChild(nameCell);

        // Release Year column
        const yearCell = document.createElement('td');
        yearCell.innerText = track.releaseYear;
        row.appendChild(yearCell);

        // Play Button column
        const playCell = document.createElement('td');
        const playButton = document.createElement('button');
        playButton.classList.add('play-btn');
        playButton.innerText = 'Play';
        playButton.addEventListener('click', function () {
            audioSource.src = track.previewUrl;
            // console.log(audioSource);
            audioPlayer.load();
            audioPlayer.play();
        });
        playCell.appendChild(playButton);
        row.appendChild(playCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    parts.appendChild(table);

    musicPlayer.innerHTML = '';
    trackList.innerHTML = '';
    trackList.appendChild(parts);

    document.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', function() {
            const newUrl = `/track/${row.id}`;
            history.pushState({trackId: row.id }, '', newUrl);
            // console.log(window.location.pathname);

            const buttons = document.querySelectorAll('.library-content-btn');
    
            buttons.forEach(btn => {
                btn.classList.remove('active-btn');
            });
            fetchMusic(row.id);

        });
    });
    
}


function fetchBtn(category, fetchUrl, headingText, curr_Btn) {
    if (storeLibrary[category].length > 0) {
        createTrackTable(storeLibrary[category], headingText);
    } else {
        fetch(fetchUrl)
            .then(response => response.json())
            .then(tracks => {
                storeLibrary[category] = tracks; // Store fetched data as raw data
                createTrackTable(tracks, headingText);
            })
            .catch(error => console.error(`Error fetching ${category} tracks:`, error));
    }
}


function setActive(btn) {
    // console.log(btn);
    const buttons = document.querySelectorAll('.library-content-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('active-btn');
    });
    
    btn.classList.add('active-btn');
}


function newRelease() {
    console.log("newRelease working");
    const newUrl = `/new-release`;
    history.pushState({ category: 'new-release' }, '', newUrl);

    const curr_Btn = document.getElementById("new-releases-btn");
    setActive(curr_Btn);

    fetchBtn("new-release", '/hidden-url/tracks/new-songs', 'New Release');
}

function topSongs() {
    console.log("topSongs working");
    const newUrl = `/top-songs`;
    history.pushState({ category: 'top-songs' }, '', newUrl);

    const curr_Btn = document.getElementById("top-songs-btn");
    setActive(curr_Btn);

    fetchBtn("top-songs", '/hidden-url/tracks/popular-songs', 'Popular Songs');
}

function bestArtists(){
    console.log("bestArtists working");
    const newUrl = `/best-artists`;
    history.pushState({ category: 'best-artists' }, '', newUrl);

    const curr_Btn = document.getElementById("best-artists-btn");
    setActive(curr_Btn);

    bestArtistsDisplay();
}

function bestArtistsDisplay() {
    const heading = document.createElement('h2');
    heading.innerText = "We will add BEST Artists soon...";

    musicPlayer.innerHTML = '';
    trackList.innerHTML = '';
    trackList.appendChild(heading);
}

function newSongs() {
    console.log("newRelease working");
    const newUrl = `/new-songs`;
    history.pushState({ category: 'new-songs' }, '', newUrl);

    const curr_Btn = document.getElementById("new-songs-btn");
    setActive(curr_Btn);

    fetchBtn("new-songs", '/hidden-url/tracks/new-songs', 'New Songs');
}

function oldSongs(){
    console.log("topSongs working");
    const newUrl = `/old-songs`;
    history.pushState({ category: 'old-songs' }, '', newUrl);

    const curr_Btn = document.getElementById("old-songs-btn");
    setActive(curr_Btn);
    
    fetchBtn("old-songs", '/hidden-url/tracks/old-songs', 'Old Songs');
}


window.addEventListener('popstate', e => {
    const fetchMap = {
        'top-songs': () => fetchBtn("top-songs", '/hidden-url/tracks/popular-songs', 'Popular Songs'),
        'new-songs': () => fetchBtn("new-songs", '/hidden-url/tracks/new-songs', 'New Songs'),
        'old-songs': () => fetchBtn("old-songs", '/hidden-url/tracks/old-songs', 'Old Songs'),
        'best-artists': bestArtistsDisplay,
    };

    if (e.state && e.state.category) {
        const category = e.state.category;
        console.log("Category from popstate:", category);
        if (category && fetchMap[category]) {
            const curr_Btn = document.getElementById(category + "-btn");
            console.log(category + "-btn");
            setActive(curr_Btn);
            fetchMap[category]();
        } else {
            const curr_Btn = document.getElementById("new-releases-btn");
            setActive(curr_Btn);
            fetchBtn("new-release", '/hidden-url/tracks/new-songs', 'New Release');
        }
    } else {
        const urlSegments = window.location.pathname.split('/');
        const trackId = urlSegments.length > 2 ? urlSegments[2] : null;

        if (urlSegments[1] === "track" && trackId) {
            console.log("Track ID from URL:", trackId);
            fetchMusic(trackId);
        } else {
            const curr_Btn = document.getElementById("new-releases-btn");
            setActive(curr_Btn);
            fetchBtn("new-release", '/hidden-url/tracks/new-songs', 'New Release');
        }
    }
});



const url_pathname = window.location.pathname.split('/');
console.log("url_pathname =", url_pathname[1]);
if(url_pathname[1]==="top-songs"){
    topSongs();
}
else if(url_pathname[1]==="best-artists"){
    bestArtists();
}
else if(url_pathname[1]==="new-songs"){
    newSongs();
}
else if(url_pathname[1]==="old-songs"){
    oldSongs();
}
else if(url_pathname[1]==="track" && url_pathname[2]){
    // console.log(url_pathname[2]);
    fetchMusic(url_pathname[2]);
}
else{
    newRelease();
}

function createMusicPlayer(track){
    console.log("createMusicPlayer working");
    const parts = document.createDocumentFragment();

    const trackImgDiv = document.createElement('div');
    const trackImg = document.createElement('img');
    trackImg.src = track.trackImage;
    trackImg.alt = "track img";
    trackImgDiv.appendChild(trackImg);
    parts.appendChild(trackImgDiv);

    const songDetails = document.createElement('div');
    songDetails.classList.add('song-details');

    const songAndMovieAndArtistsNameDiv = document.createElement('div');
    const songName = document.createElement('h1');
    songName.innerText = track.songName;
    songName.id = 'song-name';

    const artistsName = document.createElement('h2');
    artistsName.innerText = track.artists;
    artistsName.id = 'artists-name';

    const releaseYear = document.createElement('h3');
    releaseYear.innerText = track.releaseYear;
    releaseYear.id = 'release-year';

    const playBtn = document.createElement('div');
    playBtn.id = 'play-btn-div';

    const playButtonDiv = document.createElement('div');
    const playButton = document.createElement('button');
    playButton.id = 'play-btn2';
    playButton.innerText = 'Preview';
    playButton.addEventListener('click', function () {
        audioSource.src = track.previewUrl;
        // console.log(audioSource);
        // console.log("playButton clicked")
        if (audioPlayer.paused) {
            playButton.innerText = 'Pause';
            playButton.classList.add('playing');
            audioPlayer.play();
        } else {
            playButton.innerText = 'Preview';
            playButton.classList.remove('playing');
            audioPlayer.pause();
        }
    });
    playButtonDiv.appendChild(playButton);
    playBtn.appendChild(playButtonDiv);


    const Spotify = document.createElement('div');
    Spotify.id = 'spotify-link';

    const spotifyBtn = document.createElement('a');
    spotifyBtn.href = track.trackUrl;
    spotifyBtn.target = '_blank';
    const spotifyLogo =document.createElement('img');
    spotifyLogo.src = '../static/images/Spotify.jpg'
    spotifyLogo.id = 'spotify-logo';
    const spotifyLink = document.createElement('p');
    spotifyLink.innerText = 'Listen On Spotify';
    spotifyBtn.appendChild(spotifyLogo);
    spotifyBtn.appendChild(spotifyLink);

    Spotify.appendChild(spotifyBtn);

    playBtn.appendChild(Spotify);

    songAndMovieAndArtistsNameDiv.appendChild(songName);
    songAndMovieAndArtistsNameDiv.appendChild(artistsName);
    songAndMovieAndArtistsNameDiv.appendChild(releaseYear);
    songDetails.appendChild(songAndMovieAndArtistsNameDiv);
    songDetails.appendChild(playBtn);

            

    audioSource.src = track.previewUrl;
    if(audioPlayer.paused){
        audioPlayer.load();
    }

    parts.appendChild(songDetails);

    musicPlayer.innerHTML = '';
    trackList.innerHTML = '';
    musicPlayer.appendChild(parts);

}

function fetchMusic(id){
    console.log("music player working and id is", id);
    if (storeSong[id]) {
        console.log("song exist in storeSong");
        createMusicPlayer(storeSong[id]);
    }
    else{
        const url = `/hidden-url/track/${id}`;
        fetch(url)
            .then(response => response.json())
            .then(track => {
                // console.log(track);
                storeSong[id]=track;
                createMusicPlayer(track);
            })
            .catch(error => console.error('Error fetching tracks:', error));
    }
}







function searchCSV() {
    const query = document.getElementById('search').value.toLowerCase();
    
    if (track_for_search) {
        const filteredTracks = track_for_search.filter(track => 
            track.songName.toLowerCase().includes(query)
        );
        displayResults(filteredTracks.slice(0, 25));
    } else {
        fetch('/hidden-url/track_for_search')
        .then(response => response.json())
        .then(tracks => {
            track_for_search = tracks;
            const filteredTracks = track_for_search.filter(track => 
                track.songName.toLowerCase().includes(query)
            );
            displayResults(filteredTracks.slice(0, 25));
        })
        .catch(error => console.error('Error fetching tracks:', error));
    }
}

function displayResults(tracks) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (tracks.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    tracks.forEach(track => {
        const resultItem = document.createElement('a');
        resultItem.classList.add('search-options');
        resultItem.innerText = track.songName; 
        resultItem.onclick = () => {
            console.log("search working");
            const newUrl = `/track/${track.trackId}`;
            history.pushState(null, '', newUrl);
            const buttons = document.querySelectorAll('.library-content-btn');
    
            buttons.forEach(btn => {
                btn.classList.remove('active-btn');
            });
            fetchMusic(track.trackId);
        };
        resultsContainer.appendChild(resultItem);
    });

    resultsContainer.style.display = 'block';
}


document.addEventListener('click', function(event) {
    const searchBar = document.getElementById('search');
    const resultsContainer = document.getElementById('search-results');

    if (!searchBar.contains(event.target)) {
        resultsContainer.style.display = 'none';
    }
});


document.getElementById('search').addEventListener('click', function() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer.innerHTML !== '') {
        resultsContainer.style.display = 'block';
    }
});
