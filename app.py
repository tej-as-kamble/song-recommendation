from flask import Flask, render_template, jsonify, redirect
import pandas as pd

app = Flask(__name__)

# Load data from CSV
data = pd.read_csv('dataset/data.csv')

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

def get_tracks():
    return tracks


@app.route('/')
@app.route('/<path:anything>')
def red_track(anything=None):
    return render_template('index.html')

@app.route('/track/<trackId>')
def track(trackId):
    return render_template('index.html')


@app.route('/hidden-url/tracks/new-songs')
def new_songs():
    alltracks = get_tracks()
    return jsonify(sorted(alltracks, key=lambda x: x['releaseYear'], reverse=True))

@app.route('/hidden-url/tracks/old-songs')
def old_songs():
    alltracks = get_tracks()
    return jsonify(sorted(alltracks, key=lambda x: x['releaseYear']))


@app.route('/hidden-url/tracks/popular-songs')
def popular_songs():
    alltracks = get_tracks()
    return jsonify(sorted(alltracks, key=lambda x: x['popularity'], reverse=True))


@app.route('/hidden-url/track/<trackId>')
def music_player(trackId):
    alltracks = get_tracks()
    
    track = next((t for t in alltracks if t['trackId'] == trackId), None)
    
    if track:
        return jsonify(track)
    else:
        return jsonify({"error": "Track not found"})

@app.route('/hidden-url/track_for_search')
def serach_track():
    alltracks = get_tracks()
    return jsonify([{'songName': track['songName'], 'trackId': track['trackId']} for track in alltracks])

if __name__ == '__main__':
    app.run(debug=True)