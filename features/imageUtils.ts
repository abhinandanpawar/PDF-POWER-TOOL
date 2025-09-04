import pica from 'pica';

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export async function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  return canvas.toDataURL('image/jpeg');
}

export async function resizeImage(imageSrc: string, width: number, height: number) {
  const from = await createImage(imageSrc);
  const to = document.createElement('canvas');
  to.width = width;
  to.height = height;

  const picaInstance = pica();
  const result = await picaInstance.resize(from, to);
  return result.toDataURL();
}

export async function transformImage(
  imageSrc: string,
  rotation: number,
  flip: { horizontal: boolean; vertical: boolean }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const radian = (rotation * Math.PI) / 180;

  const absRotation = Math.abs(rotation) % 180;
  const isOrthogonal = absRotation === 90;

  const newWidth = isOrthogonal ? image.height : image.width;
  const newHeight = isOrthogonal ? image.width : image.height;

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radian);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return canvas.toDataURL('image/png');
}
