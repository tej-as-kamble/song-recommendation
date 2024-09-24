const trackList = document.getElementById('track-list');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');

// Function to create and append a track table
function createTrackTable(tracks, headingText, tableType) {
    const heading = document.createElement('h2');
    heading.innerText = headingText;
    trackList.appendChild(heading);

    const table = document.createElement('table');
    table.classList.add('track-table');
    if (tableType === 'topSongs') {
        table.id = 'top-song-track-table';
        heading.id = 'top-song-heading';
    } else if (tableType === 'newRelease') {
        table.id = 'new-song-track-table';
        heading.id = 'new-song-heading';
    }

    const tbody = document.createElement('tbody');

    tracks.forEach(track => {
        const row = document.createElement('tr');

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
    trackList.appendChild(table);
}


function newRelease() {
    console.log("newRelease working");

    fetch('/tracks/new-songs')
        .then(response => response.json())
        .then(tracks => {
            createTrackTable(tracks, 'New Release', 'newRelease');
        })
        .catch(error => console.error('Error fetching tracks:', error));
}

function topSongs() {
    console.log("topSongs working");
    
    fetch('/tracks/popular-songs')
        .then(response => response.json())
        .then(tracks => {
            createTrackTable(tracks, 'Popular Songs', 'topSongs');
        })
        .catch(error => console.error('Error fetching tracks:', error));
}
