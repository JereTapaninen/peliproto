import { collectionToArray } from "./utils.js";

class AudioManager {
    songs = [];
    _audioContext = null;
    _analyser = null;

    constructor() {
        this._audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this._loadAll();
    }

    async start(id, eventMappings) {
        const { song, ...songInfo } = this.songs.find(({ song }) => song.id === id + "-song");

        Object.entries(eventMappings)
            .forEach(([key, value]) => {
                song.addEventListener(key, () => { value(songInfo); });
            });

        song.play();
    }

    _loadAll() {
        this.songs = collectionToArray(
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
        });
    }
}

export default AudioManager;
