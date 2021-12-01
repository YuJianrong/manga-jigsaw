import { processImage, showCanvas } from './canvas';
import { getElement, readFile } from './helper';
import './style.css';

let pieceWidth = 0;
let pieceHeight = 0;

// 块大小自动绑定
const inputWidth = getElement<HTMLInputElement>('pieceWidth');
inputWidth.onchange = () => (pieceWidth = Number(inputWidth.value));
const inputHeight = getElement<HTMLInputElement>('pieceHeight');
inputHeight.onchange = () => (pieceHeight = Number(inputHeight.value));

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
  pieceWidth = maxWidth;
  pieceHeight = maxHeight;
  inputWidth.value = pieceWidth.toString();
  inputHeight.value = pieceHeight.toString();
};

const imageProcess = getElement<HTMLInputElement>('imageProcess');
imageProcess.onclick = () => processImage(pieceWidth, pieceHeight);

// TODO
// const resultCanvas = getElement<HTMLCanvasElement>('imgResult');
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const resultCtx = resultCanvas.getContext('2d')!;

// let lastPieceX = -1;
// let lastPieceY = -1;
// let lastPieceImageData: ImageData;

// resultCanvas.onclick = function (e) {
//   const x = e.offsetX;
//   const y = e.offsetY;

//   const pieceX = Math.floor(x / pieceWidth);
//   const pieceY = Math.floor(y / pieceHeight);

//   if (lastPieceX == -1) {
//     lastPieceX = pieceX;
//     lastPieceY = pieceY;
//     lastPieceImageData = resultCtx.getImageData(
//       lastPieceX * pieceWidth + lastPieceX,
//       lastPieceY * pieceHeight + lastPieceY,
//       pieceWidth,
//       pieceHeight,
//     );
//     // 边框
//     const imgDataCopy = new ImageData(pieceWidth, pieceHeight);
//     imgDataCopy.data.set(lastPieceImageData.data);
//     console.info(imgDataCopy.data[0] + ',' + imgDataCopy.data[1] + ',' + imgDataCopy.data[2]);
//     for (let py = 0; py < pieceHeight; py++) {
//       for (let px = 0; px < pieceWidth; px++) {
//         if (px == 0 || py == 0 || px == pieceWidth - 1 || py == pieceHeight - 1) {
//           for (let i = 0; i < 3; i++) {
//             imgDataCopy.data[py * pieceWidth * 4 + px * 4 + i] = 0;
//           }
//         }
//       }
//     }
//     resultCtx.putImageData(
//       imgDataCopy,
//       lastPieceX * pieceWidth + lastPieceX,
//       lastPieceY * pieceHeight + lastPieceY,
//     );
//     console.info(imgDataCopy.data[0] + ',' + imgDataCopy.data[1] + ',' + imgDataCopy.data[2]);
//   } else if (lastPieceX == pieceX && lastPieceY == pieceY) {
//     // 取消选择
//     resultCtx.putImageData(
//       lastPieceImageData,
//       lastPieceX * pieceWidth + lastPieceX,
//       lastPieceY * pieceHeight + lastPieceY,
//     );
//     lastPieceX = -1;
//     lastPieceY = -1;
//   } else {
//     // 互换位置
//     const newPieceImageData = resultCtx.getImageData(
//       pieceX * pieceWidth + pieceX,
//       pieceY * pieceHeight + pieceY,
//       pieceWidth,
//       pieceHeight,
//     );

//     resultCtx.putImageData(
//       lastPieceImageData,
//       pieceX * pieceWidth + pieceX,
//       pieceY * pieceHeight + pieceY,
//     );
//     resultCtx.putImageData(
//       newPieceImageData,
//       lastPieceX * pieceWidth + lastPieceX,
//       lastPieceY * pieceHeight + lastPieceY,
//     );

//     lastPieceX = -1;
//     lastPieceY = -1;
//   }
// };

// TODO
// const imageSave = getElement<HTMLInputElement>('imageSave');
// imageSave.onclick = function () {
//   // 判断是否已有图片
//   if (resultCanvas.width <= 0 || resultCanvas.height <= 0) {
//     alert('请先执行后再保存图片');
//     return;
//   }

//   // 去除中间空白
//   const canvasSave = document.createElement('canvas');
//   // var canvasSave = getElement<HTMLCanvasElement>('imgSave');
//   const ctxSave = canvasSave.getContext('2d');

//   canvasSave.width = canvasTemp.width;
//   canvasSave.height = canvasTemp.height;

//   for (let px = 0; px < Math.ceil(canvasSave.width / pieceWidth); px++) {
//     for (let py = 0; py < Math.ceil(canvasSave.height / pieceHeight); py++) {
//       const newPieceImageData = resultCtx.getImageData(
//         px * pieceWidth + px,
//         py * pieceHeight + py,
//         pieceWidth,
//         pieceHeight,
//       );
//       ctxSave.putImageData(newPieceImageData, px * pieceWidth, py * pieceHeight);
//     }
//   }

//   // 保存图片
//   const MIME_TYPE = 'image/jpeg';

//   const imgURL = canvasSave.toDataURL(MIME_TYPE);

//   const dlLink = document.createElement('a');
//   dlLink.download = formatDate(new Date()) + '.jpg';
//   dlLink.href = imgURL;
//   dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

//   document.body.appendChild(dlLink);
//   dlLink.click();
//   document.body.removeChild(dlLink);
// };
