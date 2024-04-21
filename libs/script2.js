let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
let inputP1x = document.querySelector("#p1x");
let inputP2x = document.querySelector("#p2x");
let inputP1y = document.querySelector("#p1y");
let inputP2y = document.querySelector("#p2y");

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function () {
    let valueP1x = parseInt(inputP1x.value);
    let valueP2x = parseInt(inputP2x.value);
    let valueP1y = parseInt(inputP1y.value);
    let valueP2y = parseInt(inputP2y.value);
    let mat = cv.imread(imgElement);

    for (let i = valueP1y; i < valueP2y; i++) {
        for (let j = valueP1x; j < valueP2x; j++) {
            let pixel = mat.ucharPtr(i, j);
            
            pixel[0] = 255 - pixel[0];
            pixel[1] = 255 - pixel[1];
            pixel[2] = 255 - pixel[2];
        }
    }
    cv.imshow('canvasOutput', mat);
    mat.delete();
};

var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};