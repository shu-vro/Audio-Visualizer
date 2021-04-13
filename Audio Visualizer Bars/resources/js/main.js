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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const red = dataArray[i] * 2,
                green = i * 4,
                blue = barHeight / 2;

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(
                canvas.width / 2 - x + barWidth / 2,
                canvas.height - barHeight - 20,
                barWidth / 2,
                0,
                Math.PI * 2,
                false
            );
            ctx.fill();
            ctx.closePath();
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
            let barHeight = dataArray[i];
            const red = dataArray[i] * 2,
                green = i * 4,
                blue = barHeight / 2;

            ctx.beginPath();
            ctx.arc(
                x + barWidth / 2,
                canvas.height - barHeight - 20,
                barWidth / 2,
                0,
                Math.PI * 2,
                false
            );
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
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
