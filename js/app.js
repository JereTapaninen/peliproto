import AudioManager from "./audioManager.js";
import Level from "./levels/level.js";

const startGame = () => {
    window.removeEventListener("click", startGame);

    const canvas = document.getElementById("game");
    const context = canvas.getContext("2d");
    const dpi = window.devicePixelRatio;

    const state = {
        currentSongInfo: null,
        currentLevel: null,
        elapsedTicks: 0
    };

    window.state = state;

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

        state.currentLevel?.update(canvas, state.elapsedTicks);
        state.currentLevel?.draw(canvas, context);

        window.requestAnimationFrame(tick);
    };

    const onPlay = songInfo => {
        console.log("audio is playing!");

        state.currentSongInfo = songInfo;

        const { analyser } = songInfo;

        state.currentLevel = new Level("ghost", analyser, 1, state.elapsedTicks);
    };

    const onTimeUpdate = ({ gain, analyser }) => {
        //gain.gain.value = Math.random();
        //if (state.audioVisualizer)
            //analyser.getByteTimeDomainData(state.audioVisualizer.dataArray);
    };

    const audioManager = new AudioManager();
    audioManager.start(
        "ghost",
        {
            timeupdate: onTimeUpdate,
            play: onPlay
        }
    );

    tick();
};

window.addEventListener("click", startGame);
