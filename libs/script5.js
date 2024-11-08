// Elementos da página
const statusElement = document.getElementById('status');
const startButton = document.getElementById('startButton');

// Definir o objeto Module para inicialização
var Module = {
    onRuntimeInitialized: function() {
        statusElement.innerHTML = 'OpenCV.js is ready.';
        startButton.disabled = false; // Ativar o botão quando o OpenCV.js estiver pronto
    }
};

// Função para gerar a senóide e desenhá-la na imagem
function generateSineWaveImage() {
    const width = 256;
    const height = 256;
    const amplitude = 127;
    const periods = 4;
    const frequency = periods / width; // Frequência para 4 períodos ao longo da largura

    // Criar uma imagem em branco (imagem preta com fundo branco)
    let img = new cv.Mat(height, width, cv.CV_8UC1, new cv.Scalar(255));

    // Gerar a senóide e desenhar na imagem
    for (let x = 0; x < width; x++) {
        const y = Math.round(height / 2 + amplitude * Math.sin(2 * Math.PI * frequency * x));
        img.data[y * width + x] = 0; // Desenha a linha da senóide (preto no fundo branco)
    }

    // Exibir a imagem no canvas
    const canvas = document.getElementById('outputCanvas');
    cv.imshow(canvas, img);

    // Salvar imagem em PNG
    cv.imwrite('sine_wave.png', img);

    // Salvar imagem em YML
    cv.FileStorage('sine_wave.yml', cv.FileStorage.WRITE).write('image', img);

    // Limpar a memória
    img.delete();
}

// Função para comparar as imagens geradas
function compareImages() {
    const imgPNG = cv.imread('sine_wave.png');
    const imgYML = cv.imread('sine_wave.yml');

    const height = imgPNG.rows;
    const width = imgPNG.cols;

    let differences = [];
    for (let i = 0; i < width; i++) {
        const diff = Math.abs(imgPNG.data[i] - imgYML.data[i]);
        differences.push(diff);
    }

    // Criar um gráfico de diferenças
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, differences[0]);
    for (let i = 1; i < differences.length; i++) {
        ctx.lineTo(i, differences[i]);
    }
    ctx.stroke();
    document.body.appendChild(ctx.canvas);
}

// Configurar o evento do botão para iniciar o processo
startButton.onclick = function() {
    generateSineWaveImage();
    setTimeout(compareImages, 1000); // Comparar as imagens após um pequeno delay
};