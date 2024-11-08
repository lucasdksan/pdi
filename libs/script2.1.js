let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function () {
    let mat = cv.imread(imgElement);

    // console.log({ cv })

    const width = mat.rows;
    const height = mat.cols;

    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);

    let matResult = new cv.Mat(height, width, mat.type());

    for (let y = 0; y < midY; y++) {
        for (let x = 0; x < midX; x++) {
            const pixelValue = mat.ucharPtr(y, x);

            matResult.ucharPtr(y + midY, x + midX).set(pixelValue);
        }
    }

    for (let y = 0; y < midY; y++) {
        for (let x = midX; x < width; x++) {
            const pixelValue = mat.ucharPtr(y, x);

            matResult.ucharPtr(y + midY, x - midX).set(pixelValue);
        }
    }

    for (let y = midY; y < height; y++) {
        for (let x = 0; x < midX; x++) {
            const pixelValue = mat.ucharPtr(y, x);

            matResult.ucharPtr(y - midY, x + midX).set(pixelValue);
        }
    }

    for (let y = midY; y < height; y++) {
        for (let x = midX; x < width; x++) {
            const pixelValue = mat.ucharPtr(y, x);

            matResult.ucharPtr(y - midY, x - midX).set(pixelValue);
        }
    }

    cv.imshow('canvasOutput', matResult);

    mat.delete();
    matResult.delete();
};

var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};