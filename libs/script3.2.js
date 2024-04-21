const generateImg = document.querySelector("#g-img");

function generateYAML(mat) {
    let yaml = "image:\n";
    yaml += "  rows: " + mat.rows + "\n";
    yaml += "  cols: " + mat.cols + "\n";
    yaml += "  type: " + mat.type() + "\n";
    yaml += "  data: [";

    for (let i = 0; i < mat.rows; i++) {
        for (let j = 0; j < mat.cols; j++) {
            yaml += mat.ucharPtr(i, j)[0];
            if (i < mat.rows - 1 || j < mat.cols - 1) {
                yaml += ", ";
            }
        }
    }
    yaml += "]\n";
    return yaml;
}

generateImg.addEventListener("click", function () {
    const SIDE = 256;
    const PERIODOS = 4; 
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

    let canvas = document.querySelector("#canvasOutput");
    cv.imshow(canvas, image);

    const pngData = canvas.toDataURL("image/png");
    const linkPng = document.createElement("a");
    linkPng.href = pngData;
    linkPng.download = "sine_wave.png";
    linkPng.textContent = "Download PNG";
    document.body.appendChild(linkPng);

    const yamlText = generateYAML(image);
    const yamlData = "data:text/yaml;base64," + btoa(yamlText);
    const linkYml = document.createElement("a");
    linkYml.href = yamlData;
    linkYml.download = "sine_wave.yml";
    linkYml.textContent = "Download YML";
    document.body.appendChild(linkYml);

    image.delete();
});

var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};
