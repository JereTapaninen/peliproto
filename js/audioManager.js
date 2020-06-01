import { collectionToArray } from "./utils.js";

class AudioManager {
    songs = [];
    _audioContext = null;
    _analyser = null;
    playingSong = false;

    constructor() {
        this._audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.songs = this.shuffle(collectionToArray(
            document.getElementById("songs").getElementsByTagName("audio")
        ).map(song => {
            const analyser = this._audioContext.createAnalyser();
            const source = this._audioContext.createMediaElementSource(song);
            const gain = this._audioContext.createGain();
            source.connect(analyser);
            analyser.connect(gain);
            gain.connect(this._audioContext.destination);

            return {
                source,
                analyser,
                gain,
                song
            };
        }));
    }

    shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

    playNext(index, eventMappings) {
        const { song, ...songInfo } = this.songs[index];

        Object.entries(eventMappings)
            .forEach(([key, value]) => {
                song.addEventListener(key, () => { value(songInfo); });
            });

        const onSongEnded = () => {
            song.removeEventListener("ended", onSongEnded);

            if (index + 1 < this.songs.length)
                this.playNext(index + 1, eventMappings);
            else
                this.playNext(0, eventMappings);
        };

        song.addEventListener("ended", onSongEnded);
        song.play();
    }

    startPlaylist(eventMappings) {
        if (this.songs.length > 0)
            this.playNext(0, eventMappings);
    }
}

export default AudioManager;
