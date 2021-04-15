let audioContext = new AudioContext(); // Get audio context

// Get canvas element.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DEFAULT_AUDIO = document.querySelector("audio.default");
const container = document.querySelector(".container");
const file = document.getElementById("file"); // File input

let audioSource, analyser;
let audio = new Audio(); // Make the audio tag
audio.src = DEFAULT_AUDIO.src; // And give it default audio's source.

// Audio Visualizer function
function audioVisualizer(audio) {
    audioContext.resume(); // Each time browser refreshes, the AudioContext have to resume.
    audioSource = audioContext.createMediaElementSource(audio); // Create a audio source to work with.
    analyser = audioContext.createAnalyser(); // Make the analyser.
    audioSource.connect(analyser); // Connect to analyser.
    analyser.connect(audioContext.destination); // Connect to Audio Context destination.
    analyser.fftSize = 128; // Frequency count (have to be 2<sup>n</sup> type where n = 1, 2, 3,......).
    const bufferLength = analyser.frequencyBinCount; // Readonly. Returns the half of the fftSize.
    const dataArray = new Uint8Array(bufferLength); // Store the bufferLength to a uint-8 (unicode integer 8 bit) array.
    const barWidth = canvas.width / 2 / bufferLength; // Bar Width. Make this half of it's original size.

    let x, barHeight;

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray); // Frequency rate.
        x = 0;
        let opacity = 1; // Line between 2 balls opacity.
        for (let i = 0; i < bufferLength; i++) {
            // This will start from CENTER and increase to LEFT.
            barHeight = dataArray[i];
            // Color combinations.
            const red = dataArray[i] * 2,
                green = i * 4,
                blue = barHeight / 4;

            let dy = Math.abs(barHeight - dataArray[i + 1]); // The distance between target ball and it's before ball.
            opacity = 1 - dy / bufferLength; // Set the dynamic opacity.

            // LINE
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.moveTo(
                canvas.width / 2 - x + barWidth / 2,
                canvas.height - barHeight - 30
            );
            ctx.lineTo(
                canvas.width / 2 - x - barWidth / 2,
                canvas.height - dataArray[i + 1] - 30
            );
            ctx.stroke();
            ctx.closePath();

            // BALL
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(
                canvas.width / 2 - x + barWidth / 2,
                canvas.height - barHeight - 30,
                barWidth / 2,
                0,
                Math.PI * 2,
                false
            );
            ctx.fill();
            ctx.closePath();

            // BAR
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
            // This will start from CENTER and increase to RIGHT.
            barHeight = dataArray[i];
            // Color combinations.
            const red = dataArray[i] * 2,
                green = i * 4,
                blue = barHeight / 4;

            let dy = Math.abs(barHeight - dataArray[i - 1]); // The distance between target ball and it's after ball.
            opacity = 1 - dy / bufferLength; // Set the dynamic opacity.

            // LINE
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.moveTo(x + barWidth / 2, canvas.height - barHeight - 30);
            ctx.lineTo(x - barWidth / 2, canvas.height - dataArray[i - 1] - 30);
            ctx.stroke();
            ctx.closePath();

            // BALL
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(
                x + barWidth / 2,
                canvas.height - barHeight - 30,
                barWidth / 2,
                0,
                Math.PI * 2,
                false
            );
            ctx.fill();
            ctx.closePath();

            // BAR
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
