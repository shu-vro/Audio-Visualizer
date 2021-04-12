let audioContext = new AudioContext();
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DEFAULT_AUDIO = document.querySelector("audio.default");
const container = document.querySelector(".container");
const file = document.getElementById("file");

let audioSource, analyser;
let audio = new Audio();
audio.src = DEFAULT_AUDIO.src;

function audioVisualizer(audio) {
    audioContext.resume();
    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / 2 / bufferLength;

    let x, barHeight;

    function animate() {
        requestAnimationFrame(animate);
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const red = dataArray[i] * 2,
                green = i * 4,
                blue = barHeight / 2;

            ctx.fillStyle = "white";
            ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight - 20, barWidth, 5);
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(
                canvas.width / 2 - x,
                canvas.height - barHeight,
                barWidth,
                barHeight
            );
            x += barWidth;
        }
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const red = dataArray[i] * 2,
                green = i * 4,
                blue = barHeight / 2;

            ctx.fillStyle = "white";
            ctx.fillRect(x, canvas.height - barHeight - 20, barWidth, 5);
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
    }
    animate();
}

container.addEventListener("click", () => {
    audio.play();
    audioVisualizer(audio);
});

file.addEventListener("change", () => {
    const MAIN_AUDIO = document.querySelector("audio#audio1");
    MAIN_AUDIO.src = URL.createObjectURL(file.files[0]);
    MAIN_AUDIO.load();
    MAIN_AUDIO.play();
    audioVisualizer(MAIN_AUDIO);
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
