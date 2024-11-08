let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function () {
    let mat = cv.imread(imgElement);
    let grayMat = new cv.Mat();

    cv.cvtColor(mat, grayMat, cv.COLOR_RGBA2GRAY);
    let colorMat = new cv.Mat();
    for (let i = 0; i < grayMat.rows; i++) {
        for (let j = 0; j < grayMat.cols; j++) {
            let grayValue = grayMat.ucharPtr(i, j)[0];

            let r = grayValue * 2;
            let g = 255 - grayValue;  
            let b = grayValue / 2; 

            r = Math.min(r, 255);
            g = Math.min(g, 255);
            b = Math.min(b, 255);

            colorMat.ucharPtr(i, j)[0] = r; 
            colorMat.ucharPtr(i, j)[1] = g; 
            colorMat.ucharPtr(i, j)[2] = b; 
        }
    }

    cv.imshow('canvasOutput', colorMat);

    mat.delete();
    grayMat.delete();
    colorMat.delete();
};

var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};