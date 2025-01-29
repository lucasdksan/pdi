_Observação: estou utilizando este espaço para postar os resultados das tarefas
da disciplina Processamento Digital de Imagens._

# **2.2 Exercícios**

## **Primeira questão**

Nesta tarefa, é necessário identificar uma região específica da imagem onde o
efeito negativo será aplicado, utilizando a biblioteca OpenCV.js para
manipulação da imagem. Com essa biblioteca, é possível acessar uma ampla
variedade de funcionalidade de visão computacional diretamente no navegador.

O primeiro passo desta tarefa foi a criação do arquivo index.html que receberá a
imagem a ser manipulada e exibirá o resultado do processo.

```html
<p id="status">OpenCV.js is loading...</p>
<div>
    <div>
        <div class="container-inputs">
            <span>Coordenadas do primeiro ponto P1</span>
            <input type="number" id="p1x" />
            <input type="number" id="p1y" />
        </div>
        <div class="container-inputs">
            <span>Coordenadas do primeiro ponto P2</span>
            <input type="number" id="p2x" />
            <input type="number" id="p2y" />
        </div>
        <button class="upload-image">Carregar</button>
    </div>
    <div style="display: flex;gap: 100px;margin-top: 100px;">
        <div class="inputoutput">
            <img id="imageSrc" alt="No Image" />
            <div class="caption">imageSrc <input type="file" id="fileInput" name="file" /></div>
        </div>
        <div class="inputoutput">
            <canvas id="canvasOutput"></canvas>
            <div class="caption">canvasOutput</div>
        </div>
    </div>
</div>
<script async src="./libs/opencv.js" type="text/javascript"></script>
<script src="./libs/script2.js"></script>
```

O processo consiste em inserir as coordnadas dos pontos inicial e final, além de
fazer o upload da imagem que será manipulada. Com essas informações preenchidas,
é necessário clicar no botão para iniciar o processo de manipulação. O codigo é
bastante simples:

```js
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
cv.imshow("canvasOutput", mat);
mat.delete();
```

Utilizando as coordenadas inseridas, o código faz dois loops navegando na área
selecionada, alterando as cores do pixel e depois definindo os valores
alterados.

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/2.2.png?raw=true)

## **Segunda questão**

Esta questão pede a implementação de um código para alterar os quadrantes de uma
imagem. Neste caso, reutilizei o código do exercício anterior para obter a
imagem que o usuário deseja e, além disso, modifiquei a lógica do loop.

```js
let mat = cv.imread(imgElement);

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

cv.imshow("canvasOutput", matResult);

mat.delete();
matResult.delete();
```

O código realiza a troca dos quadrantes de uma imagem dividida em quatro partes.
Cada quadrante é movido para a posição do quadrante oposto, resultando em uma
imagem com os quadrantes trocados. Para fazer isso, o código utiliza quatro
loops aninhados para iterar sobre cada quadrante da imagem original (mat) e
copiar os pixels para um novo local no resultado (matResult), criando o efeito
de troca de posição.

Inicialmente, o código pega as dimensões da imagem e calcula o ponto médio da
imagem. Depois disso, o código produz uma nova “imagem” com as mesmas dimensões
onde será inserida a imagem alterada. Após a criação, o código utiliza os 4
links principais para inserir os quadrantes da imagem principal na nova imagem,
só que invertidos.

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/2.1.png?raw=true)

# **3.2 Exercícios**

## **Primeira questão**

```js
let videoElement = document.getElementById("video");
let canvasElement = document.getElementById("canvasOutput");
let startButton = document.getElementById("g-video");
let statusElement = document.getElementById("status");

var Module = {
    onRuntimeInitialized() {
        statusElement.innerHTML = "OpenCV.js is ready.";
        startButton.disabled = false;
    },
};

startButton.addEventListener("click", async () => {
    videoElement.src = "./video/video.mp4";
    videoElement.play();

    videoElement.onloadedmetadata = () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        const src = new cv.Mat(
            videoElement.videoHeight,
            videoElement.videoWidth,
            cv.CV_8UC4,
        );
        const gray = new cv.Mat(
            videoElement.videoHeight,
            videoElement.videoWidth,
            cv.CV_8UC1,
        );

        function processVideo() {
            if (videoElement.paused || videoElement.ended) {
                src.delete();
                gray.delete();
                return;
            }

            let ctx = canvasElement.getContext("2d");

            ctx.drawImage(
                videoElement,
                0,
                0,
                canvasElement.width,
                canvasElement.height,
            );

            let imageData = ctx.getImageData(
                0,
                0,
                canvasElement.width,
                canvasElement.height,
            );
            src.data.set(imageData.data);

            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            cv.imshow(canvasElement, gray);

            requestAnimationFrame(processVideo);
        }

        processVideo();
    };
});
```

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/3.1.png?raw=true)

Este código JavaScript é responsável por carregar e processar um vídeo,
convertendo seus quadros em escala de cinza e exibindo-os em um elemento
<canvas>. O processamento é feito com a ajuda do OpenCV.js, uma biblioteca que
oferece funcionalidades de visão computacional diretamente no navegador.

A função onloadedmetadata é chamada quando os metadados do vídeo (como largura e
altura) são carregados. O tamanho do canvasElement é ajustado para coincidir com
as dimensões do vídeo.

São criados dois objetos cv.Mat:

- src: Uma matriz de imagem com as dimensões do vídeo, no formato RGBA (4 canais
  de cor).
- gray: Uma matriz de imagem em escala de cinza, com as mesmas dimensões do
  vídeo, no formato de um único canal (8 bits por pixel).
- A função processVideo é chamada repetidamente com requestAnimationFrame, o que
  permite que o vídeo seja processado quadro a quadro.
- A verificação if (videoElement.paused || videoElement.ended) interrompe o
  processamento quando o vídeo é pausado ou chega ao fim.
- getContext('2d') é usado para obter o contexto 2D do canvasElement, e o vídeo
  é desenhado no canvas com ctx.drawImage().
- getImageData() captura os dados do quadro desenhado no canvas.
- Os dados da imagem (imageData.data) são copiados para a matriz src usando
  src.data.set().
- A função cv.cvtColor() converte a imagem colorida em src para escala de cinza,
  armazenando o resultado na matriz gray.
- A função cv.imshow() exibe a imagem em escala de cinza no canvasElement.
- requestAnimationFrame(processVideo) chama a função novamente para processar o
  próximo quadro, criando um loop contínuo.

## **Segunda questão**

```js
let videoElement = document.getElementById("video");
let canvasElement = document.getElementById("canvasOutput");
let startButton = document.getElementById("g-video");
let statusElement = document.getElementById("status");

var Module = {
    onRuntimeInitialized() {
        statusElement.innerHTML = "OpenCV.js is ready.";
        startButton.disabled = false;
    },
};

startButton.addEventListener("click", async () => {
    videoElement.src = "./video/video.mp4";
    videoElement.play();

    videoElement.onloadedmetadata = () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        const src = new cv.Mat(
            videoElement.videoHeight,
            videoElement.videoWidth,
            cv.CV_8UC4,
        );

        function processVideo() {
            if (videoElement.paused || videoElement.ended) {
                src.delete();
                return;
            }

            let ctx = canvasElement.getContext("2d");
            ctx.drawImage(
                videoElement,
                0,
                0,
                canvasElement.width,
                canvasElement.height,
            );

            let imageData = ctx.getImageData(
                0,
                0,
                canvasElement.width,
                canvasElement.height,
            );
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
```

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/3.2.png?raw=true)

Este código JavaScript é responsável por carregar e processar um vídeo,
aplicando o negativo no frame do video e exibindo-os em um elemento <canvas>. É
o mesmo codigo do exercicio anterior, porém ao invés de aplicar uma escala de
cinza é usado o negativo usando esse trecho de codigo:

```js
for (let i = 0; i < src.rows; i++) {
    for (let j = 0; j < src.cols; j++) {
        let pixel = src.ucharPtr(i, j);
        pixel[0] = 255 - pixel[0];
        pixel[1] = 255 - pixel[1];
        pixel[2] = 255 - pixel[2];
    }
}
```

# **5.2 Exercícios**

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/5.senoide_periodo_4.png?raw=true)

PNG é um formato comprimido com um algoritmo de compressão sem perda, mas ainda assim pode introduzir pequenas variações devido a técnicas de compressão. Essas pequenas alterações podem surgir ao compactar dados para reduzir o tamanho do arquivo. YML, no entanto, é um formato de armazenamento de dados usado pelo OpenCV, que geralmente preserva informações com alta fidelidade, sem compressão significativa. Isso pode resultar em uma representação mais precisa dos dados da imagem.

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/5.senoide_periodo_8.png?raw=true)

# **10.3 Exercícios**

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/10.3.png?raw=true)

```js
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
```

Quando o usuário carrega uma imagem através do campo fileInputEsteganografada, o seguinte acontece:

- O arquivo carregado é lido como um objeto Image.
- O canvasEsteganografada tem suas dimensões ajustadas para corresponder à imagem carregada.
- A imagem carregada é desenhada no canvasEsteganografada usando o contexto 2d (armazenado em ctxEsteganografada).

Ao clicar no botão recuperar, a função associada ao evento é executada. Esse código executa o seguinte processo:

- Verifica se o OpenCV.js foi carregado com sucesso.
- Lê a imagem do canvasEsteganografada usando cv.imread(), que converte a imagem para uma matriz do OpenCV (cv.Mat).
- Chama a função recuperarImagemEsteganografada() para tentar extrair a mensagem (ou imagem oculta) da imagem esteganografada.
- Exibe a imagem recuperada no canvasRecuperada com cv.imshow().
- Libera a memória das imagens utilizadas com delete().

A função recuperarImagemEsteganografada() é responsável por realizar o processo de recuperação da imagem escondida na esteganografia. Ela usa a técnica de manipulação dos bits menos significativos (LSB) para extrair a informação oculta. Aqui está o que acontece:

- A imagem esteganografada é percorrida pixel por pixel.
- Para cada pixel, os valores das cores (R, G, B) são recuperados.
- Os n bits menos significativos de cada canal de cor (R, G e B) são extraídos e movidos para os n bits mais significativos de cada canal de cor do pixel da imagem recuperada.
- Isso é feito com operações de bitwise, utilizando máscaras de bits e deslocamentos.

# **13.2 Exercícios**

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/13.2.png?raw=true)

Captura de pontos com o mouse:

Adicionamos um manipulador de eventos click para o canvas onde a imagem é exibida. Cada clique do usuário registra um ponto e desenha um círculo vermelho no local clicado.
O evento capturarPontos é responsável por capturar até quatro pontos. Após o quarto ponto ser clicado, o programa automaticamente aplica a correção de perspectiva.
Função de desenhar pontos:

A função desenharPontos() é responsável por desenhar círculos vermelhos nos pontos que foram selecionados pelo usuário no canvas.
Correção de perspectiva:

Assim que os quatro pontos são selecionados, a transformação de perspectiva é calculada e aplicada com a função aplicarCorrecao(). Ela calcula a largura e altura da nova imagem, realiza a transformação e exibe a imagem corrigida.
Canvas de exibição:

Usamos dois canvases: um para exibir a imagem original e outro para a imagem corrigida.

# **16.2 Exercícios**

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/16.2-espec.png?raw=true)

1* Para uma função senoidal de frequência fx, a Transformada de Fourier gera picos em +/- fx no domínio da frequência.
Se a senóide for I(x,y) = Asin(2pifxX), então sua DFT teórica é dada por:

![Formula](https://github.com/lucasdksan/pdi/blob/main/github/form.png?raw=true)

Ou seja, o espectro terá dois picos simétricos nas coordenadas (+/-fx, 0).
Observações sobre o espectro gerado:

Devemos observar dois picos bem definidos nas posições 𝑓𝑥 e −𝑓𝑥​.
O espectro pode ter um brilho maior no centro devido ao valor DC da imagem.

3* A transformada de Fourier da senóide ideal tem picos em 𝑓𝑥 e −𝑓𝑥, então devemos observar dois picos bem definidos no espectro.

Com a nova abordagem usando ponto flutuante, esperamos que:

O espectro fique mais próximo do teórico.
Reduza artefatos numéricos e erros de quantização.
Melhore a precisão das altas frequências.

Quando a imagem era lida de um arquivo PNG/JPG, os valores estavam no formato inteiro (uint8), o que causava:

Quantização: Detalhes sutis eram perdidos.
Ruído de aliasing: Pequenos artefatos numéricos no espectro.

Agora, com valores de ponto flutuante (float32):

Maior precisão: A DFT opera diretamente nos valores reais da senóide.
Menos ruído: Artefatos são reduzidos.
Espectro mais limpo: Os picos nas frequências ±𝑓𝑥 aparecem mais nítidos.

# **18.2 Exercícios**

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/18.2.png?raw=true)

O resultado obtido mostra uma imagem binária onde os objetos são destacados em preto e o fundo em branco. Aqui estão alguns pontos para discussão:

Segmentação por Otsu:

O algoritmo de Otsu escolheu automaticamente um limiar para separar os pixels em dois grupos: fundo e objeto.
Se a imagem original tinha regiões com intensidades bem distintas, a segmentação pode ter sido eficaz.
Regiões Pretas e Brancas:

As áreas pretas representam pixels abaixo do limiar escolhido.
As áreas brancas representam pixels acima do limiar.
Qualidade da Segmentação:

Se os objetos desejados estão bem separados, o limiar de Otsu foi adequado.
Caso haja ruído ou falhas na segmentação, pode ser necessário aplicar pré-processamento, como suavização com GaussianBlur antes de aplicar threshold.
Formato dos Objetos:

Se os objetos estão bem preservados e têm contornos definidos, o algoritmo funcionou corretamente.
Se há perda de detalhes ou buracos nos objetos, pode ser necessário um ajuste no pré-processamento.

**Segmentação Modificado:**

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/18.2.kai.png?raw=true)

Explicação das etapas:
Filtro Gaussiano:

A imagem original é suavizada usando um filtro Gaussiano (cv.GaussianBlur). O tamanho do kernel (cv.Size(55, 55)) pode ser ajustado dependendo da resolução da imagem e da intensidade das variações de iluminação.

O filtro Gaussiano remove detalhes de alta frequência (como texturas e ruídos), mantendo apenas as variações de baixa frequência (iluminação).

Correção de Iluminação:

A imagem suavizada (que representa a iluminação) é subtraída da imagem original (cv.subtract). Isso remove o efeito da iluminação desigual, normalizando o brilho da cena.

Limiarização de Otsu:

A limiarização de Otsu é aplicada na imagem corrigida, resultando em uma segmentação mais precisa.

Ajustes:
O tamanho do kernel do filtro Gaussiano (cv.Size(55, 55)) pode ser ajustado dependendo da resolução da imagem e da intensidade das variações de iluminação. Valores maiores suavizam mais, mas podem remover detalhes importantes.

Se a imagem ainda não estiver sendo segmentada corretamente, experimente ajustar o tamanho do kernel ou aplicar técnicas adicionais de pré-processamento, como equalização de histograma.

Observação:
Certifique-se de que a biblioteca OpenCV.js está corretamente carregada no seu projeto.

O código acima assume que a imagem de entrada é carregada corretamente e que o elemento outputCanvas existe no HTML para exibir o resultado.

# **19.3 Exercícios**

![Resultado](https://github.com/lucasdksan/pdi/blob/main/github/19.3.kai.png?raw=true)

Explicação do Código:
Detecção de Bordas com Canny:

O algoritmo de Canny é aplicado à imagem em escala de cinza para detectar bordas.

O limiar inferior de Canny é controlado por um slider, permitindo ajustar a sensibilidade da detecção de bordas.

Pontilhismo com Base nas Bordas:

Para cada ponto gerado no pontilhismo, verifica-se se ele está localizado em uma borda detectada por Canny.

Se o ponto estiver em uma borda, ele é desenhado com um raio maior (RAIO_MAX).

Caso contrário, o ponto é desenhado com um raio menor (RAIO_MIN).

Interatividade:

Um slider permite ajustar o limiar inferior de Canny em tempo real, atualizando a imagem pontilhista conforme o valor é alterado.

Exibição do Resultado:

A imagem pontilhista resultante é exibida em um <canvas> usando cv.imshow.

Técnica Utilizada:
Combinação de Pontilhismo e Canny:

As bordas detectadas pelo algoritmo de Canny são usadas para destacar regiões de alto contraste na imagem.

Pontos maiores são desenhados nas bordas para enfatizar os detalhes, enquanto pontos menores são usados nas regiões suaves para criar um efeito mais uniforme.

Ajuste Dinâmico:

O limiar de Canny pode ser ajustado dinamicamente, permitindo explorar diferentes níveis de detalhes na imagem pontilhista.