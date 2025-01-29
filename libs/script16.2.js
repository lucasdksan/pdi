try {
    var statusElement = document.createElement('div');
    document.body.appendChild(statusElement);

    var startButton = document.getElementById('fileInput');

    // Inicialização do OpenCV.js
    var Module = {
        onRuntimeInitialized() {
            statusElement.innerHTML = 'OpenCV.js is ready.';
            startButton.disabled = false;
        }
    };

    // Função para carregar a imagem e calcular o espectro
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = function () {
            // Carregar imagem no OpenCV.js
            let mat = cv.imread(img);

            // Converter para escala de cinza
            let gray = new cv.Mat();
            cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

            // Exibir imagem original no canvas
            const canvasOriginal = document.getElementById('canvasOriginal');
            canvasOriginal.width = mat.cols;
            canvasOriginal.height = mat.rows;
            cv.imshow('canvasOriginal', mat);

            // Liberar a memória da imagem original
            mat.delete();

            // Calcular espectro de magnitude
            let padded = new cv.Mat();
            let optimalRows = cv.getOptimalDFTSize(gray.rows);
            let optimalCols = cv.getOptimalDFTSize(gray.cols);
            cv.copyMakeBorder(gray, padded, 0, optimalRows - gray.rows, 0, optimalCols - gray.cols, cv.BORDER_CONSTANT, new cv.Scalar(0));
            gray.delete();

            // Criar planos para a transformada
            let planes = new cv.MatVector();
            let complexI = new cv.Mat();
            planes.push_back(padded);
            planes.push_back(cv.Mat.zeros(padded.size(), cv.CV_32F));
            cv.merge(planes, complexI);

            // Aplicar DFT
            cv.dft(complexI, complexI);

            // Dividir os planos
            cv.split(complexI, planes);
            let mag = new cv.Mat();
            cv.magnitude(planes.get(0), planes.get(1), mag);

            // Escalar valores para visualização
            let m1 = new cv.Mat();
            mag += cv.Scalar.all(1); // Log(1 + magnitude)
            cv.log(mag, m1);

            // Crop na região central
            let rect = new cv.Rect(0, 0, m1.cols & -2, m1.rows & -2);
            m1 = m1.roi(rect);

            // Reorganizar quadrantes
            let cx = m1.cols / 2;
            let cy = m1.rows / 2;
            let q0 = m1.roi(new cv.Rect(0, 0, cx, cy));
            let q1 = m1.roi(new cv.Rect(cx, 0, cx, cy));
            let q2 = m1.roi(new cv.Rect(0, cy, cx, cy));
            let q3 = m1.roi(new cv.Rect(cx, cy, cx, cy));

            let tmp = new cv.Mat();
            q0.copyTo(tmp);
            q3.copyTo(q0);
            tmp.copyTo(q3);

            q1.copyTo(tmp);
            q2.copyTo(q1);
            tmp.copyTo(q2);

            // Normalizar para visualização
            cv.normalize(m1, m1, 0, 255, cv.NORM_MINMAX);

            // Exibir espectro no canvas
            const canvasEspectro = document.getElementById('canvasEspectro');
            canvasEspectro.width = m1.cols;
            canvasEspectro.height = m1.rows;
            cv.imshow('canvasEspectro', m1);

            // Liberar memória
            padded.delete();
            planes.delete();
            complexI.delete();
            mag.delete();
            m1.delete();
            tmp.delete();
        };

        img.src = URL.createObjectURL(file);
    }

    // Adicionar evento ao input de arquivo
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
} catch (error) {
    console.error("Erro durante o processamento com OpenCV.js:", err);
    alert("Ocorreu um erro no processamento. Verifique a imagem ou o código.");
}