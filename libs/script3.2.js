const generateImg = document.querySelector("#g-img");

generateImg.addEventListener("click", function(){
    const SIDE = 256;
    const PERIODOS = 8;
    const amplitude = 127;

    const image = new cv.Mat(SIDE, SIDE, cv.CV_32FC1);
    
    for (let i = 0; i < SIDE; i++) {
        for (let j = 0; j < SIDE; j++) {
            let value = amplitude * Math.sin(2 * Math.PI * PERIODOS * j / SIDE) + 128;
            image.floatPtr(i)[j] = value;
        }
    }

    cv.normalize(image, image, 0, 255, cv.NORM_MINMAX);
    image.convertTo(image, cv.CV_8U);

    cv.imshow('canvasOutput', image);
    image.delete();
});

var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};