let videoElement = document.getElementById('video');
let canvasElement = document.getElementById('canvasOutput');
let startButton = document.getElementById('g-video');
let statusElement = document.getElementById('status');

var Module = {
    onRuntimeInitialized() {
        statusElement.innerHTML = 'OpenCV.js is ready.';
        startButton.disabled = false;
    }
};

startButton.addEventListener('click', async () => {
    videoElement.src = "./video/video.mp4";
    videoElement.play();

    videoElement.onloadedmetadata = () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        
        const src = new cv.Mat(videoElement.videoHeight, videoElement.videoWidth, cv.CV_8UC4);

        function processVideo() {
            if (videoElement.paused || videoElement.ended) {
                src.delete();
                return;
            }

            let ctx = canvasElement.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

            let imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
            src.data.set(imageData.data);

            for (let i = 0; i < src.rows; i++) {
                for (let j = 0; j < src.cols; j++) {
                    let pixel = src.ucharPtr(i, j);
                    pixel[0] = 255 - pixel[0];
                    pixel[1] = 255 - pixel[1];
                    pixel[2] = 255 - pixel[2];
                }
            }

            cv.imshow(canvasElement, src);

            requestAnimationFrame(processVideo);
        }

        processVideo();
    };
});
