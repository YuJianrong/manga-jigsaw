/* eslint-disable @typescript-eslint/no-unused-vars */
import { PieceType } from './helper';

// 灰度化
export function imgToGray(imgData: ImageData) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    const R = imgData.data[i]; //R(0-255)
    const G = imgData.data[i + 1]; //G(0-255)
    const B = imgData.data[i + 2]; //G(0-255)
    const Alpha = imgData.data[i + 3]; //Alpha(0-255)

    //const gray = R*0.299 + G*0.587 + B*0.114;
    const gray = (R + G + B) / 3;

    imgData.data[i] = gray;
    imgData.data[i + 1] = gray;
    imgData.data[i + 2] = gray;
    imgData.data[i + 3] = Alpha;
  }

  return imgData;
}

// 寻找Y轴高度
export function imgFindY(imgData: ImageData, width: number, height: number) {
  const yCount = [0];
  let ySum = 0;
  let yAvg = 0;
  const hCount: Record<number, number> = {};

  const imgDataCopy = new ImageData(width, height);
  imgDataCopy.data.set(imgData.data);
  const mData = imgDataCopy.data;

  for (let y = 1; y < height - 2; y += 1) {
    let count = 0;
    for (let x = 1; x < width - 2; x += 1) {
      const i = y * width * 4 + x * 4;
      const i1 = i - 4;
      const i2 = i + 4;
      const i3 = i - width * 4;

      const j = i + width * 4;
      const j1 = j - 4;
      const j2 = j + 4;
      const j3 = j + width * 4;

      const pa = (mData[i] + mData[i1] + mData[i2] + mData[i3]) / 4;
      const pb = (mData[j] + mData[j1] + mData[j2] + mData[j3]) / 4;

      if (Math.abs(pa - pb) > 25) {
        count += 1;

        // imgData.data[i] = 255;
        // imgData.data[i + 1] = 0;
        // imgData.data[i + 2] = 0;
      }
    }
    yCount.push(count);
    ySum += count;
  }

  yAvg = ySum / yCount.length;

  // 相互之间最多高度
  for (let i = 0; i < yCount.length; i++) {
    if (yCount[i] > yAvg * 0.7 + width * 0.3) {
      yCount[i] = 1;
    } else {
      yCount[i] = 0;
    }
  }
  const yNum = [];
  for (let i = 0; i < yCount.length; i++) {
    if (yCount[i] == 1) {
      yNum.push(i);
    }
  }
  for (let i = 0; i < yNum.length; i++) {
    for (let j = 0; j < i; j++) {
      if (!hCount[yNum[i] - yNum[j]]) {
        hCount[yNum[i] - yNum[j]] = 1;
      } else {
        hCount[yNum[i] - yNum[j]]++;
      }
    }
  }

  // 最多高度
  let maxCount = 0;
  let maxHeight = 0;
  for (const i in hCount) {
    if (hCount[i] > maxCount && parseInt(i) > 10) {
      maxCount = hCount[i];
      maxHeight = parseInt(i);
    }
  }

  // console.info(hCount);
  // console.info(maxHeight);

  return maxHeight;

  // if (maxHeight <= 1) {
  // 	return imgData;
  // }

  // for (let y = 0; y < height; y++) {
  // 	if ((y + 1) % maxHeight != 0) {
  // 		continue;
  // 	}
  // 	for (let x = 0; x < width; x++) {
  // 		const i = y * width * 4 + x * 4

  // 		imgData.data[i] = 255;
  // 	}
  // }

  // return imgData;
}

// 寻找X轴高度
export function imgFindX(imgData: ImageData, width: number, height: number) {
  const xCount = [];
  let xSum = 0;
  let xAvg = 0;
  const wCount: Record<number, number> = {};

  const imgDataCopy = new ImageData(width, height);
  imgDataCopy.data.set(imgData.data);
  const mData = imgDataCopy.data;

  for (let x = 20; x < width - 2; x += 1) {
    let count = 0;
    for (let y = 20; y < height; y += 1) {
      const i = y * width * 4 + x * 4;
      const i1 = i - 4;
      const i2 = i + width * 4;
      const i3 = i - width * 4;

      const j = i + 4;
      const j1 = j + 4;
      const j2 = j - width * 4;
      const j3 = j + width * 4;

      const pa = (mData[i] + mData[i1] + mData[i2] + mData[i3]) / 4;
      const pb = (mData[j] + mData[j1] + mData[j2] + mData[j3]) / 4;

      if (Math.abs(pa - pb) > 25) {
        count += 1;

        // imgData.data[i] = 255;
        // imgData.data[i + 1] = 0;
        // imgData.data[i + 2] = 0;
      }
    }
    xCount.push(count);
    xSum += count;
  }

  xAvg = xSum / xCount.length;

  // 相互之间最多高度
  for (let i = 0; i < xCount.length; i++) {
    if (xCount[i] > xAvg * 0.7 + height * 0.3) {
      xCount[i] = 1;
    } else {
      xCount[i] = 0;
    }
  }
  const xNum = [];
  for (let i = 0; i < xCount.length; i++) {
    if (xCount[i] == 1) {
      xNum.push(i);
    }
  }
  for (let i = 0; i < xNum.length; i++) {
    for (let j = 0; j < i; j++) {
      if (!wCount[xNum[i] - xNum[j]]) {
        wCount[xNum[i] - xNum[j]] = 1;
      } else {
        wCount[xNum[i] - xNum[j]]++;
      }
    }
  }

  // 最多宽度
  let maxCount = 0;
  let maxWidth = 0;
  for (const i in wCount) {
    if (wCount[i] > maxCount && parseInt(i) > 1) {
      maxCount = wCount[i];
      maxWidth = parseInt(i);
    }
  }

  // console.info(xCount);
  // console.info(wCount);
  // console.info(maxWidth);

  // return imgData;
  return maxWidth;

  // if (maxWidth <= 1) {
  // 	return imgData;
  // }

  // for (let y = 0; y < height; y++) {
  // 	for (let x = 0; x < width; x++) {
  // 		if ((x + 1) % maxWidth != 0) {
  // 			continue;
  // 		}

  // 		const i = y * width * 4 + x * 4

  // 		imgData.data[i] = 255;
  // 	}
  // }

  // return imgData;
}

// 获取差异大小
export function getDiffRatio(
  sImgData: ImageData['data'],
  sWidth: number,
  sHeight: number,
  dImgData: ImageData['data'],
  dWidth: number,
  dHeight: number,
  pieceType: PieceType,
) {
  let count = 0;

  switch (pieceType) {
    case PieceType.PIECE_LEFT:
      for (let i = 1; i < sHeight - 2; i++) {
        const s01 = i * sWidth * 4;
        const s02 = s01 - sWidth * 4;
        const s03 = s01 + sWidth * 4;
        const s04 = s01 + 4;

        const d01 = i * dWidth * 4 + dWidth * 4 - 4;
        const d02 = d01 - sWidth * 4;
        const d03 = d01 + sWidth * 4;
        const d04 = d01 - 4;

        const numbers = [];
        numbers.push(
          Math.abs(dImgData[d01] - sImgData[s01]) +
            Math.abs(dImgData[d01 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d01 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d02] - sImgData[s01]) +
            Math.abs(dImgData[d02 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d02 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d03] - sImgData[s01]) +
            Math.abs(dImgData[d03 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d03 + 2] - sImgData[s01 + 2]),
        );
        const minNumber = Math.min(...numbers);

        count += numbers[0];
      }
      break;
    case PieceType.PIECE_TOP:
      for (let i = 1; i < sWidth - 2; i++) {
        const s01 = i * 4;
        const s02 = s01 - 4;
        const s03 = s01 + 4;
        const s04 = s01 + sWidth * 4;

        const d01 = i * 4 + (dHeight - 1) * dWidth * 4;
        const d02 = d01 - 4;
        const d03 = d01 + 4;
        const d04 = d01 - dWidth * 4;

        const numbers = [];
        numbers.push(
          Math.abs(dImgData[d01] - sImgData[s01]) +
            Math.abs(dImgData[d01 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d01 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d02] - sImgData[s01]) +
            Math.abs(dImgData[d02 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d02 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d03] - sImgData[s01]) +
            Math.abs(dImgData[d03 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d03 + 2] - sImgData[s01 + 2]),
        );
        const minNumber = Math.min(...numbers);

        count += numbers[0];
      }
      break;
    case PieceType.PIECE_RIGHT:
      for (let i = 1; i < sHeight - 2; i++) {
        const s01 = i * sWidth * 4 + sWidth * 4 - 4;
        const s02 = s01 - sWidth * 4;
        const s03 = s01 + sWidth * 4;
        const s04 = s01 - 4;

        const d01 = i * dWidth * 4;
        const d02 = d01 - dWidth * 4;
        const d03 = d01 + dWidth * 4;
        const d04 = d01 + 4;

        const numbers = [];
        numbers.push(
          Math.abs(dImgData[d01] - sImgData[s01]) +
            Math.abs(dImgData[d01 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d01 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d02] - sImgData[s01]) +
            Math.abs(dImgData[d02 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d02 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d03] - sImgData[s01]) +
            Math.abs(dImgData[d03 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d03 + 2] - sImgData[s01 + 2]),
        );
        const minNumber = Math.min(...numbers);

        count += numbers[0];
      }
      break;
    case PieceType.PIECE_BOTTOM:
      for (let i = 1; i < sWidth - 2; i++) {
        const s01 = i * 4 + (sHeight - 1) * sWidth * 4;
        const s02 = s01 - 4;
        const s03 = s01 + 4;
        const s04 = s01 - sWidth * 4;

        const d01 = i * 4;
        const d02 = d01 - 4;
        const d03 = d01 + 4;
        const d04 = d01 - dWidth * 4;

        const numbers = [];
        numbers.push(
          Math.abs(dImgData[d01] - sImgData[s01]) +
            Math.abs(dImgData[d01 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d01 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d02] - sImgData[s01]) +
            Math.abs(dImgData[d02 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d02 + 2] - sImgData[s01 + 2]),
        );
        numbers.push(
          Math.abs(dImgData[d03] - sImgData[s01]) +
            Math.abs(dImgData[d03 + 1] - sImgData[s01 + 1]) +
            Math.abs(dImgData[d03 + 2] - sImgData[s01 + 2]),
        );
        const minNumber = Math.min(...numbers);

        count += numbers[0];
      }
      break;
  }

  return count;
}

// // 二值化
// function imgTo2Value(imgData: ImageData) {
//   // 平均值
//   let s = 0;
//   let c = 0;
//   for (let i = 0; i < imgData.data.length; i += 4) {
//     s += imgData.data[i];
//     c++;
//   }
//   const a = s / c;

//   for (let i = 0; i < imgData.data.length; i += 4) {
//     const R = imgData.data[i];

//     let gray = 0;
//     if (R > a) {
//       gray = 255;
//     }
//     imgData.data[i] = gray;
//     imgData.data[i + 1] = gray;
//     imgData.data[i + 2] = gray;
//   }

//   return imgData;
// }

// // 膨胀
// function dilate(dst, width, height) {
//   const size = 3;
//   const dstData = dst.data;
//   const mData = JSON.parse(JSON.stringify(dstData));

//   let newOffset, total, nowX, offsetY, offsetI, nowOffset, i, j;

//   for (i = height; i--; ) {
//     offsetI = i * width;
//     for (j = width; j--; ) {
//       newOffset = 0;
//       total = 0;
//       for (y = size; y--; ) {
//         offsetY = (y + i) * width * 4;
//         for (x = size; x--; ) {
//           nowX = (x + j) * 4;
//           nowOffset = offsetY + nowX;
//           mData[nowOffset] + mData[nowOffset + 1] + mData[nowOffset + 2] > total &&
//             (total = mData[nowOffset] + mData[nowOffset + 1] + mData[nowOffset + 2]) &&
//             (newOffset = nowOffset);
//         }
//       }
//       dstData[(j + offsetI) * 4] = mData[newOffset];
//       dstData[(j + offsetI) * 4 + 1] = mData[newOffset + 1];
//       dstData[(j + offsetI) * 4 + 2] = mData[newOffset + 2];
//       dstData[(j + offsetI) * 4 + 3] = mData[newOffset + 3];
//     }
//   }

//   return dst;
// }

// // 腐蚀
// function erode(dst, width, height) {
//   const size = 3;
//   const dstData = dst.data;
//   const mData = JSON.parse(JSON.stringify(dstData));

//   let newOffset, total, nowX, offsetY, offsetI, nowOffset, i, j;

//   for (i = height; i--; ) {
//     offsetI = i * width;
//     for (j = width; j--; ) {
//       newOffset = 0;
//       total = 765;
//       for (y = size; y--; ) {
//         offsetY = (y + i) * width * 4;
//         for (x = size; x--; ) {
//           nowX = (x + j) * 4;
//           nowOffset = offsetY + nowX;
//           mData[nowOffset] + mData[nowOffset + 1] + mData[nowOffset + 2] < total &&
//             (total = mData[nowOffset] + mData[nowOffset + 1] + mData[nowOffset + 2]) &&
//             (newOffset = nowOffset);
//         }
//       }
//       dstData[(j + offsetI) * 4] = mData[newOffset];
//       dstData[(j + offsetI) * 4 + 1] = mData[newOffset + 1];
//       dstData[(j + offsetI) * 4 + 2] = mData[newOffset + 2];
//       dstData[(j + offsetI) * 4 + 3] = mData[newOffset + 3];
//     }
//   }

//   return dst;
// }
