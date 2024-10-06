from flask import Flask, render_template, jsonify, redirect
import pandas as pd
import pickle

app = Flask(__name__)

# Load data from CSV
data = pd.read_csv('dataset/data.csv')
similarity = pickle.load(open('model/similarity.pkl', 'rb'))

tracks = []
for index, row in data.iterrows():
    track = {
        'index': index,
        'trackId': row['Track_ID'],
        'mainArtistId': row['Main_Artist_ID'],
        'trackImage': row['Track_Image'],
        'songName': row['Song_Name'],
        'artists': row['Artists'],
        'album': row['Movie_Name'],
        'releaseYear': row['Release_Year'],
        'trackUrl': row['Track_URL'],
        'previewUrl': row['Preview_URL'],
        'popularity': row['Popularity']
    }
    tracks.append(track)

def get_tracks():
    return tracks

def recommend(trackId):
    for track in tracks:
        if track['trackId'] == trackId:
            song_ind = track['index']
    # print(song_ind)
    song_year = tracks[song_ind]['releaseYear']
    # print(song_year)
    dis = similarity[song_ind]
    song_name = sorted(list(enumerate(dis)), reverse=True, key=lambda x:x[1])
    # print(song_name)

    count=1;
    recommended_list=[]
    for i in song_name:
        if(tracks[i[0]]['trackId'] == trackId): continue
        
        year = tracks[i[0]]['releaseYear']
        # print(year)
        if(year>song_year-10 and year<song_year+15):
            # print(tracks[i[0]]['trackId'])
            recommended_list.append({
                'index': tracks[i[0]]['index'],
                'trackId': tracks[i[0]]['trackId'],
                'mainArtistId': tracks[i[0]]['mainArtistId'],
                'trackImage': tracks[i[0]]['trackImage'],
                'songName': tracks[i[0]]['songName'],
                'artists': tracks[i[0]]['artists'],
                'album': tracks[i[0]]['album'],
                'releaseYear': tracks[i[0]]['releaseYear'],
                'trackUrl': tracks[i[0]]['trackUrl'],
                'previewUrl': tracks[i[0]]['previewUrl'],
                'popularity': tracks[i[0]]['popularity']
            })
            count+=1
        if(count==25): break
    return recommended_list

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
    return jsonify(sorted(alltracks, key=lambda x: x['releaseYear'], reverse=True)[: 200])

@app.route('/hidden-url/tracks/old-songs')
def old_songs():
    alltracks = get_tracks()
    return jsonify(sorted(alltracks, key=lambda x: x['releaseYear'])[: 50])


@app.route('/hidden-url/tracks/popular-songs')
def popular_songs():
    alltracks = get_tracks()
    return jsonify(sorted(alltracks, key=lambda x: x['popularity'], reverse=True)[: 100])


@app.route('/hidden-url/track/<trackId>')
def music_player(trackId):
    alltracks = get_tracks()
    
    track = next((t for t in alltracks if t['trackId'] == trackId), None)
    rec = recommend(trackId)
    if track:
        return jsonify(track, rec)
    else:
        return jsonify({"error": "Track not found"})

@app.route('/hidden-url/track_for_search')
def serach_track():
    alltracks = get_tracks()
    return jsonify([{'songName': track['songName'], 'trackId': track['trackId']} for track in alltracks])

if __name__ == '__main__':
    app.run(debug=True)