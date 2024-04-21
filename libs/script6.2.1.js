document.querySelector("#start-btn").addEventListener("click", async function () {
    const video = document.querySelector("#videoInput");
    const FPS = 30;

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });

    let src = new cv.Mat(video.clientHeight, video.clientWidth, cv.CV_8UC4);
    let cap = new cv.VideoCapture(video);

    video.srcObject = stream;
    video.play();

    function processVideo(){ 
        let begin = Date.now();
    
        cap.read(src);

        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        let equalized = new cv.Mat();
        cv.equalizeHist(gray, equalized);

        cv.imshow('canvasOutput', equalized);

        gray.delete();
        equalized.delete();
    
        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    }

    setTimeout(processVideo, 0);
});

var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};