import { processImage, save, showCanvas } from './canvas';
import { getElement, piece, readFile } from './helper';
import './style.css';

// 块大小自动绑定
const inputWidth = getElement<HTMLInputElement>('pieceWidth');
inputWidth.onchange = () => (piece.width = Number(inputWidth.value));
const inputHeight = getElement<HTMLInputElement>('pieceHeight');
inputHeight.onchange = () => (piece.height = Number(inputHeight.value));

// 读取本地文件
const inputOne = getElement<HTMLInputElement>('imageSelect');
inputOne.onchange = async function () {
  // 获取选中的文件列表
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fileList = inputOne.files!;
  const file = fileList[0];
  // 读取文件内容
  const dataUrl = await readFile(file);
  // 将结果显示到canvas
  const { maxWidth, maxHeight } = await showCanvas(dataUrl);
  piece.width = maxWidth;
  piece.height = maxHeight;
  inputWidth.value = piece.width.toString();
  inputHeight.value = piece.height.toString();
};

const imageProcess = getElement<HTMLInputElement>('imageProcess');
imageProcess.onclick = () => processImage(piece.width, piece.height);

const resultCanvas = getElement<HTMLCanvasElement>('imgResult');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const resultCtx = resultCanvas.getContext('2d')!;

let lastPieceX = -1;
let lastPieceY = -1;
let lastPieceImageData: ImageData;

resultCanvas.onclick = function (e) {
  const x = e.offsetX;
  const y = e.offsetY;

  const pieceX = Math.floor(x / piece.width);
  const pieceY = Math.floor(y / piece.height);

  if (lastPieceX == -1) {
    lastPieceX = pieceX;
    lastPieceY = pieceY;
    lastPieceImageData = resultCtx.getImageData(
      lastPieceX * piece.width + lastPieceX,
      lastPieceY * piece.height + lastPieceY,
      piece.width,
      piece.height,
    );
    // 边框
    const imgDataCopy = new ImageData(piece.width, piece.height);
    imgDataCopy.data.set(lastPieceImageData.data);
    console.info(imgDataCopy.data[0] + ',' + imgDataCopy.data[1] + ',' + imgDataCopy.data[2]);
    for (let py = 0; py < piece.height; py++) {
      for (let px = 0; px < piece.width; px++) {
        if (px == 0 || py == 0 || px == piece.width - 1 || py == piece.height - 1) {
          for (let i = 0; i < 3; i++) {
            imgDataCopy.data[py * piece.width * 4 + px * 4 + i] = 0;
          }
        }
      }
    }
    resultCtx.putImageData(
      imgDataCopy,
      lastPieceX * piece.width + lastPieceX,
      lastPieceY * piece.height + lastPieceY,
    );
    console.info(imgDataCopy.data[0] + ',' + imgDataCopy.data[1] + ',' + imgDataCopy.data[2]);
  } else if (lastPieceX == pieceX && lastPieceY == pieceY) {
    // 取消选择
    resultCtx.putImageData(
      lastPieceImageData,
      lastPieceX * piece.width + lastPieceX,
      lastPieceY * piece.height + lastPieceY,
    );
    lastPieceX = -1;
    lastPieceY = -1;
  } else {
    // 互换位置
    const newPieceImageData = resultCtx.getImageData(
      pieceX * piece.width + pieceX,
      pieceY * piece.height + pieceY,
      piece.width,
      piece.height,
    );

    resultCtx.putImageData(
      lastPieceImageData,
      pieceX * piece.width + pieceX,
      pieceY * piece.height + pieceY,
    );
    resultCtx.putImageData(
      newPieceImageData,
      lastPieceX * piece.width + lastPieceX,
      lastPieceY * piece.height + lastPieceY,
    );

    lastPieceX = -1;
    lastPieceY = -1;
  }
};

const imageSave = getElement<HTMLInputElement>('imageSave');
imageSave.onclick = () => save();
