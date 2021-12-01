import { formatDate, getElement, piece, PieceType, wait } from './helper';
import { getDiffRatio, imgFindX, imgFindY, imgToGray } from './imgHelper';

const canvasTemp = document.createElement('canvas');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const ctxTemp = canvasTemp.getContext('2d')!;

export async function showCanvas(
  dataUrl: string,
): Promise<{ maxWidth: number; maxHeight: number }> {
  const canvas = getElement<HTMLCanvasElement>('imgCanvas');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!;

  return new Promise<{ maxWidth: number; maxHeight: number }>((resolve) => {
    // 加载图片
    const img = new Image();
    img.onload = async function () {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasTemp.width = img.width;
      canvasTemp.height = img.height;

      // 改变canvas大小后延迟绘图，避免空白
      await wait();
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctxTemp.drawImage(img, 0, 0, img.width, img.height);

      let imgData = ctx.getImageData(0, 0, img.width, img.height);

      const imgDataCopy = new ImageData(img.width, img.height);
      imgDataCopy.data.set(imgData.data);

      console.info('*** 灰度化 ***');
      imgData = imgToGray(imgDataCopy);

      // console.info("*** 开始二值化 ***");
      // imgData = imgTo2Value(imgData)

      // console.info("*** 开始腐蚀 ***");
      // imgData = erode(imgData, img.width, img.height);

      // console.info("*** 开始膨胀 ***");
      // imgData = dilate(imgData, img.width, img.height);

      console.info('*** 识别高度 ***');
      const maxHeight = imgFindY(imgDataCopy, img.width, img.height);

      console.info('*** 识别宽度 ***');
      const maxWidth = imgFindX(imgDataCopy, img.width, img.height);
      // var maxWidth = 0;
      // const imgDataCopy = imgFindX(imgDataCopy, img.width, img.height);
      // ctx.putImageData(imgDataCopy, 0, 0)

      console.info('maxWidth=' + maxWidth);
      console.info('maxHeight=' + maxHeight);

      if (maxHeight <= 1 || maxWidth <= 1) {
        return;
      }

      // 增加画板宽度和高度
      canvas.width = img.width + 5 * Math.ceil(img.width / maxWidth) - 5;
      canvas.height = img.height + 5 * Math.ceil(img.height / maxHeight) - 5;

      await wait();

      for (let y = 0; y < Math.ceil(img.height / maxHeight); y++) {
        for (let x = 0; x < Math.ceil(img.width / maxWidth); x++) {
          const startX = x * maxWidth;
          const startY = y * maxHeight;
          const canvasX = x * (maxWidth + 5);
          const canvasY = y * (maxHeight + 5);
          let width = maxWidth;
          let height = maxHeight;

          if (x == Math.ceil(img.width / maxWidth) - 1 && img.width % maxWidth != 0) {
            width = img.width % maxWidth;
          }
          if (y == Math.ceil(img.height / maxHeight) - 1 && img.height % maxWidth != 0) {
            height = img.height % maxHeight;
          }

          ctx.drawImage(img, startX, startY, width, height, canvasX, canvasY, width, height);
        }
      }

      // if (canvas.width > 500) {
      //   reSetCanvasSize();
      // }

      // ctx.putImageData(imgDataCopy, 0, 0)

      resolve({ maxWidth, maxHeight });
    };
    img.src = dataUrl;
  });
}

export function processImage(pieceWidth: number, pieceHeight: number) {
  const canvas = getElement<HTMLCanvasElement>('imgResult');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!;
  canvas.width = canvasTemp.width + Math.ceil(canvasTemp.width / pieceWidth) - 1;
  canvas.height = canvasTemp.height + Math.ceil(canvasTemp.height / pieceHeight) - 1;

  setTimeout(() => {
    // 除不尽则将最后块之间放入结果
    if (canvas.width % pieceWidth != 0) {
      for (let i = 0; i < Math.ceil(canvas.height / pieceHeight); i++) {
        const imgData = ctxTemp.getImageData(
          Math.floor(canvas.width / pieceWidth) * pieceWidth,
          i * pieceHeight,
          pieceWidth,
          pieceHeight,
        );
        ctx.putImageData(
          imgData,
          Math.floor(canvas.width / pieceWidth) * pieceWidth +
            Math.ceil(canvas.width / pieceWidth) -
            1,
          i * pieceHeight + i,
        );
      }
    }
    if (canvas.height % pieceHeight != 0) {
      for (let i = 0; i < Math.ceil(canvas.height / pieceHeight); i++) {
        const imgData = ctxTemp.getImageData(
          i * pieceWidth,
          Math.floor(canvas.height / pieceHeight) * pieceHeight,
          pieceWidth,
          pieceHeight,
        );
        ctx.putImageData(
          imgData,
          i * pieceWidth + i,
          Math.floor(canvas.height / pieceHeight) * pieceHeight +
            Math.ceil(canvas.height / pieceHeight) -
            1,
        );
      }
    }
    // 剩余块转换为ImageData数组
    const imageDatas = [];
    for (let y = 0; y < Math.floor(canvas.height / pieceHeight); y++) {
      for (let x = 0; x < Math.floor(canvas.width / pieceWidth); x++) {
        const imgData = ctxTemp.getImageData(
          x * pieceWidth,
          y * pieceHeight,
          pieceWidth,
          pieceHeight,
        );
        // imgToGray(imgData);
        imageDatas.push(imgData);
      }
    }

    // 从右下角开始识别
    const maxDiffRatios: number[] = [];
    const isHasPiece: Record<string, number> = {};
    console.info(
      '块数量：' +
        Math.floor(canvas.width / pieceWidth) +
        ',' +
        Math.floor(canvas.height / pieceHeight),
    );
    const pxStart = Math.floor(canvas.width / pieceWidth) - (canvas.width % pieceWidth ? 0 : 1);
    for (let px = pxStart; px >= 0; px--) {
      let bottomImageData = ctxTemp.getImageData(
        px * pieceWidth,
        Math.floor(canvas.height / pieceHeight) * pieceHeight,
        pieceWidth,
        canvas.height % pieceHeight,
      );
      for (let py = Math.floor(canvas.height / pieceHeight) - 1; py >= 0; py--) {
        let rightImageData = ctxTemp.getImageData(
          Math.floor(canvas.width / pieceWidth) * pieceWidth,
          py * pieceHeight,
          canvas.width % pieceWidth || 1,
          pieceHeight,
        );
        let rightWidth = canvas.width % pieceWidth;
        if (px < Math.floor(canvas.width / pieceWidth) - 1) {
          rightImageData = ctx.getImageData(
            px * pieceWidth + pieceWidth + px + 1,
            py * pieceHeight + py,
            pieceWidth,
            pieceHeight,
          );
          rightWidth = pieceWidth;

          // console.info(px + "," + py+"  "+(py * Math.floor(canvas.width / pieceWidth) + px + 1));
        }
        let diffRatios = [];
        let maxDiffRatio = 256 * pieceWidth * pieceHeight;
        let maxDiffRatioImageData: ImageData | null = null;
        let maxDiffRatioIndex = 0;
        for (let i = 0; i < imageDatas.length; i++) {
          let diffRatio1 = 2500;
          if (px + 1 + ',' + py in isHasPiece || px == Math.floor(canvas.width / pieceWidth) - 1) {
            diffRatio1 = getDiffRatio(
              imageDatas[i].data,
              pieceWidth,
              pieceHeight,
              rightImageData.data,
              rightWidth,
              pieceHeight,
              PieceType.PIECE_RIGHT,
            );
          }
          let diffRatio2 = 2500;
          if (
            px + ',' + (py + 1) in isHasPiece ||
            py == Math.floor(canvas.height / pieceHeight) - 1
          ) {
            diffRatio2 = getDiffRatio(
              imageDatas[i].data,
              pieceWidth,
              pieceHeight,
              bottomImageData.data,
              pieceWidth,
              canvas.height % pieceHeight,
              PieceType.PIECE_BOTTOM,
            );
          }
          const diffRatio = diffRatio1 + diffRatio2;
          diffRatios.push([diffRatio, diffRatio1, diffRatio2]);

          if (maxDiffRatio > diffRatio) {
            maxDiffRatio = diffRatio;
            maxDiffRatioImageData = imageDatas[i];
            maxDiffRatioIndex = i;
          }
        }

        if (px == 8 && py == 2) {
          console.info(px + ',' + py);
          console.info(diffRatios);
          console.info(maxDiffRatioIndex);
        }

        // 总差异超过5000则使用单边匹配方式
        if (maxDiffRatio >= 5000) {
          diffRatios = [];
          maxDiffRatio = 256 * pieceWidth * pieceHeight;
          for (let i = 0; i < imageDatas.length; i++) {
            let diffRatio1 = 2500;
            if (
              px + 1 + ',' + py in isHasPiece ||
              px == Math.floor(canvas.width / pieceWidth) - 1
            ) {
              diffRatio1 = getDiffRatio(
                imageDatas[i].data,
                pieceWidth,
                pieceHeight,
                rightImageData.data,
                rightWidth,
                pieceHeight,
                PieceType.PIECE_RIGHT,
              );
            }
            let diffRatio2 = 2500;
            if (
              px + ',' + (py + 1) in isHasPiece ||
              py == Math.floor(canvas.height / pieceHeight) - 1
            ) {
              diffRatio2 = getDiffRatio(
                imageDatas[i].data,
                pieceWidth,
                pieceHeight,
                bottomImageData.data,
                pieceWidth,
                canvas.height % pieceHeight,
                PieceType.PIECE_BOTTOM,
              );
            }
            const diffRatio = diffRatio1 + diffRatio2;
            diffRatios.push([diffRatio, diffRatio1, diffRatio2]);

            if (maxDiffRatio > diffRatio1) {
              maxDiffRatio = diffRatio1;
              maxDiffRatioImageData = imageDatas[i];
              maxDiffRatioIndex = i;
            }
            if (maxDiffRatio > diffRatio2) {
              maxDiffRatio = diffRatio2;
              maxDiffRatioImageData = imageDatas[i];
              maxDiffRatioIndex = i;
            }
          }
        }

        // 差异超过3000则认为不匹配
        // if (maxDiffRatio >= 5000) {
        // 	bottomImageData = null;
        // } else {
        if (maxDiffRatioImageData) {
          ctx.putImageData(maxDiffRatioImageData, px * pieceWidth + px, py * pieceHeight + py);
          imageDatas.splice(maxDiffRatioIndex, 1);
          bottomImageData = maxDiffRatioImageData;
        }
        isHasPiece[px + ',' + py] = 1;
        //}

        maxDiffRatios.push(maxDiffRatio);
      }
    }

    console.info(maxDiffRatios);
  }, 0);
}

const resultCanvas = getElement<HTMLCanvasElement>('imgResult');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const resultCtx = resultCanvas.getContext('2d')!;
export function save() {
  // 判断是否已有图片
  if (resultCanvas.width <= 0 || resultCanvas.height <= 0) {
    alert('请先执行后再保存图片');
    return;
  }

  // 去除中间空白
  const canvasSave = document.createElement('canvas');
  // var canvasSave = getElement<HTMLCanvasElement>('imgSave');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctxSave = canvasSave.getContext('2d')!;

  canvasSave.width = canvasTemp.width;
  canvasSave.height = canvasTemp.height;

  for (let px = 0; px < Math.ceil(canvasSave.width / piece.width); px++) {
    for (let py = 0; py < Math.ceil(canvasSave.height / piece.height); py++) {
      const newPieceImageData = resultCtx.getImageData(
        px * piece.width + px,
        py * piece.height + py,
        piece.width,
        piece.height,
      );
      ctxSave.putImageData(newPieceImageData, px * piece.width, py * piece.height);
    }
  }

  // 保存图片
  const MIME_TYPE = 'image/jpeg';

  const imgURL = canvasSave.toDataURL(MIME_TYPE);

  const dlLink = document.createElement('a');
  dlLink.download = formatDate(new Date()) + '.jpg';
  dlLink.href = imgURL;
  dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}

// function reSetCanvasSize() {
//   const canvas = document.getElementById('imgCanvas');
//   const ctx = canvas.getContext('2d');

//   const img = new Image();
//   img.onload = function () {
//     const width = canvas.width;
//     const height = canvas.height;

//     const imgScale = 500 / canvas.width;

//     canvas.width = 500;
//     canvas.height = canvas.height * imgScale;

//     setTimeout(() => {
//       ctx.drawImage(img, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
//     }, 0);
//   };
//   img.src = canvas.toDataURL('image/png');
// }

// 指定图片内容显示
// function showCanvas1(dataUrl) {
//   const canvas = document.getElementById('imgCanvas');
//   const ctx = canvas.getContext('2d');
//   // 加载图片
//   const img = new Image();
//   img.onload = function () {
//     canvas.width = img.width;
//     canvas.height = img.height;

//     setTimeout(() => {
//       const src = cv.imread(img);

//       const rgbaPlanes = new cv.MatVector();

//       cv.split(src, rgbaPlanes);
//       const red = rgbaPlanes.get(0);
//       const green = rgbaPlanes.get(1);
//       const blue = rgbaPlanes.get(2);

//       const t1 = new cv.Mat();
//       const t2 = new cv.Mat();
//       const t3 = new cv.Mat();
//       cv.add(red, green, t1);
//       cv.add(red, blue, t2);
//       cv.add(green, blue, t3);

//       const split_channel_images = [red, green, blue, t1, t2, t3];

//       const size_candidates = [];
//       for (i in split_channel_images) {
//         const image = split_channel_images[i];

//         const thresh = new cv.Mat();
//         cv.threshold(image, thresh, 200, 255, cv.THRESH_BINARY);

//         const opened = new cv.Mat();
//         const element = cv.getStructuringElement(cv.MORPH_OPEN, new cv.Size(5, 5));
//         cv.morphologyEx(thresh, opened, cv.MORPH_OPEN, element);

//         const binary_image = new cv.Mat();
//         cv.bitwise_not(opened, binary_image);

//         const contours = new cv.MatVector();
//         const hierarchy = new cv.Mat();
//         cv.findContours(binary_image, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

//         cv.imshow('imgCanvas', thresh);
//         setTimeout(() => {
//           showCanvas3();
//         }, 100);
//         return;

//         for (let contourIndex = 0; contourIndex < contours.size(); contourIndex++) {
//           const contour = contours.get(contourIndex);

//           const bounding_rect = cv.boundingRect(contour);
//           const contour_area = cv.contourArea(contour);

//           const width = bounding_rect.width;
//           const height = bounding_rect.height;
//           const extent = contour_area / (width * height);

//           const lower_limit = 1;
//           const upper_limit = 200 * 200;

//           const is_square = Math.abs(width - height) < 300;
//           const is_extent_valid = extent >= 0.75;

//           if (is_square && is_extent_valid) {
//             const candidate = (bounding_rect.width + bounding_rect.height) / 2;
//             size_candidates.push(candidate);
//           }
//         }
//       }

//       console.info(size_candidates);

//       cv.imshow('imgCanvas', src);
//     }, 0);
//   };
//   img.src = dataUrl;
// }

// function showCanvas3() {
//   const canvas = document.getElementById('imgCanvas');
//   const ctx = canvas.getContext('2d');
//   console.info(ctx);
//   let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//   console.info('*** 开始识别高度 ***');
//   imgData = imgFindY(imgData, canvas.width, canvas.height);
//   console.info('*** 完成识别高度 ***');

//   ctx.putImageData(imgData, 0, 0);
// }
