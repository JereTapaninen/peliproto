import AudioManager from "./audioManager.js";
import InputManager from "./inputManager.js";
import Population from "./population.js";

const startGame = () => {
    document.getElementById("click-overlay").style.display = "none";
    window.removeEventListener("click", startGame);

    const canvas = document.getElementById("game");
    const context = canvas.getContext("2d");
    const inputManager = new InputManager(canvas);
    const populationManager = new Population(6, inputManager, canvas);
    const dpi = window.devicePixelRatio;

    const state = {
        currentSongInfo: null,
        elapsedTicks: 0
    };

    window.state = state;
    window.game = populationManager;

    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    const fixDPI = () => {
        const styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
        const styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
        canvas.setAttribute("height", styleHeight * dpi);
        canvas.setAttribute("width", styleWidth * dpi);
    };

    const tick = () => {
        state.elapsedTicks++;

        fixDPI();

        context.clearRect(0, 0, canvas.width, canvas.height);

        populationManager.update(state.elapsedTicks, canvas, state.currentSongInfo);
        populationManager.draw(canvas, context);
        // state.currentLevel?.update(state.elapsedTicks, canvas, inputManager);
        // state.currentLevel?.draw(canvas, context);

        window.requestAnimationFrame(tick);
    };

    const onPlay = songInfo => {
        state.currentSongInfo = songInfo;
    };

    const onTimeUpdate = ({ gain, analyser }) => {
        //gain.gain.value = Math.random();
        //if (state.audioVisualizer)
            //analyser.getByteTimeDomainData(state.audioVisualizer.dataArray);
    };

    const audioManager = new AudioManager();
    audioManager.startPlaylist({
        timeupdate: onTimeUpdate,
        play: onPlay
    });

    tick();
};

window.addEventListener("click", startGame);
