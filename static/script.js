const trackList = document.getElementById('track-list');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const recommendedSongs = document.getElementById('recommended-songs');


function createTrackTable(tracks, headingText) {
    const parts = document.createDocumentFragment();

    const heading = document.createElement('h2');
    heading.innerText = headingText;
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
            audioPlayer.load();
            audioPlayer.play();
        });
        playCell.appendChild(playButton);
        row.appendChild(playCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    parts.appendChild(table);

    trackList.innerHTML = '';
    trackList.appendChild(parts);

    document.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', function() {
            const newUrl = `/track/${row.id}`;
            history.pushState(null, '', newUrl);
            // console.log(window.location.pathname);

            const buttons = document.querySelectorAll('.library-content-btn');
    
            buttons.forEach(btn => {
                btn.classList.remove('active-btn');
            });
            createMusicPlayer();

        });
    });
    
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
    history.pushState(null, '', newUrl);

    const curr_Btn = document.getElementById("new-releases-btn");
    setActive(curr_Btn);

    fetch('/hidden-url/tracks/new-songs')
        .then(response => response.json())
        .then(tracks => {
            createTrackTable(tracks, 'New Release');
        })
        .catch(error => console.error('Error fetching tracks:', error));
}


function topSongs() {
    console.log("topSongs working");
    const newUrl = `/top-songs`;
    history.pushState(null, '', newUrl);
    
    const curr_Btn = document.getElementById("top-songs-btn");
    setActive(curr_Btn);

    fetch('/hidden-url/tracks/popular-songs')
        .then(response => response.json())
        .then(tracks => {
            createTrackTable(tracks, 'Popular Songs');
        })
        .catch(error => console.error('Error fetching tracks:', error));
}

function bestArtists(){
    console.log("bestArtists working");
    trackList.innerHTML = '';
    const newUrl = `/best-artists`;
    history.pushState(null, '', newUrl);

    const curr_Btn = document.getElementById("best-artists-btn");
    setActive(curr_Btn);

    const heading = document.createElement('h2');
    heading.innerText = "We will add BEST Artists soon...";
    trackList.appendChild(heading);
}


function newSongs() {
    console.log("newRelease working");
    const newUrl = `/new-songs`;
    history.pushState(null, '', newUrl);

    const curr_Btn = document.getElementById("new-songs-btn");
    setActive(curr_Btn);

    fetch('/hidden-url/tracks/new-songs')
        .then(response => response.json())
        .then(tracks => {
            createTrackTable(tracks, 'New Songs');
        })
        .catch(error => console.error('Error fetching tracks:', error));
}

function oldSongs(){
    console.log("topSongs working");
    const newUrl = `/old-songs`;
    history.pushState(null, '', newUrl);

    const curr_Btn = document.getElementById("old-songs-btn");
    setActive(curr_Btn);
    
    fetch('/hidden-url/tracks/old-songs')
        .then(response => response.json())
        .then(tracks => {
            createTrackTable(tracks, 'Old Songs');
        })
        .catch(error => console.error('Error fetching tracks:', error));
}


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
    createMusicPlayer();
}
else{
    newRelease();
}


function createMusicPlayer(){
    console.log("music player working");
    trackList.innerHTML = '';
    const heading = document.createElement('h2');
    heading.innerText = "We will add Music Player soon...";
    trackList.appendChild(heading);
}