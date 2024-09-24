from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

# Load data from CSV
data = pd.read_csv('dataset/data.csv')

def get_tracks():
    tracks = []
    for index, row in data.iterrows():
        track = {
            'trackId': row['Track_ID'],
            'mainArtistId': row['Main_Artist_ID'],
            'trackImage': row['Track_Image'],
            'songName': row['Song_Name'],
            'artists': row['Artists'],
            'album': row['Album/Movie_Name'],
            'releaseYear': row['Release_Year'],
            'trackUrl': row['Track_URL'],
            'previewUrl': row['Preview_URL'],
            'popularity': row['Popularity']
        }
        tracks.append(track)
    # return sorted(tracks, key=lambda x: x['releaseYear'], reverse=True)
    return tracks


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/tracks/new-songs')
def new_songs():
    alltracks = get_tracks()
    return jsonify(sorted(alltracks, key=lambda x: x['releaseYear'], reverse=True)[: 10])

@app.route('/tracks/popular-songs')
def popular_songs():
    alltracks = get_tracks()
    return jsonify(sorted(alltracks, key=lambda x: x['popularity'], reverse=True)[: 10])

if __name__ == '__main__':
    app.run(debug=True)