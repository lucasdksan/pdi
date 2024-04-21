let canvasEsteganografada = document.getElementById("canvasEsteganografada");
let canvasRecuperada = document.getElementById("canvasRecuperada");

let ctxEsteganografada = canvasEsteganografada.getContext("2d");
let ctxRecuperada = canvasRecuperada.getContext("2d");

document.getElementById("fileInputEsteganografada").addEventListener("change", function (e) {
    let img = new Image();
    img.onload = function () {
        canvasEsteganografada.width = img.width;
        canvasEsteganografada.height = img.height;
        ctxEsteganografada.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(e.target.files[0]);
});

document.getElementById("recuperar").addEventListener("click", function () {
    if (typeof cv === "undefined") {
        console.error("OpenCV.js ainda está carregando.");
        return;
    }

    let imagemEsteganografada = cv.imread(canvasEsteganografada);
    let imagemRecuperada = new cv.Mat();
    recuperarImagemEsteganografada(imagemEsteganografada, 3, imagemRecuperada);
    cv.imshow("canvasRecuperada", imagemRecuperada);

    imagemEsteganografada.delete();
    imagemRecuperada.delete();
});

function recuperarImagemEsteganografada(imagemEsteganografada, nbits, imagemRecuperada) {
    let rows = imagemEsteganografada.rows;
    let cols = imagemEsteganografada.cols;

    imagemRecuperada.create(rows, cols, cv.CV_8UC3);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let valEsteganografado = imagemEsteganografada.ucharPtr(i, j);

            // Extrair bits menos significativos e mover para posições mais significativas
            let valRecuperado = [
                ((valEsteganografado[0] & ((1 << nbits) - 1)) << (8 - nbits)),
                ((valEsteganografado[1] & ((1 << nbits) - 1)) << (8 - nbits)),
                ((valEsteganografado[2] & ((1 << nbits) - 1)) << (8 - nbits))
            ];

            imagemRecuperada.ucharPtr(i, j).set(valRecuperado);
        }
    }
}

var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};