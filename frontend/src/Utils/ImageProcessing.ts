export type ProcessedImg = ProcessedImgError | ProcessedImgSuccess;
export interface ProcessedImgError {
  type: "error";
  error: string;
}
export interface ProcessedImgSuccess {
  type: "success";
  file: File;
}

export const dataURLtoImage = (dataURL: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("dataURLtoImage(): dataURL is illegal"));
    img.src = dataURL;
  });
};

interface ProcessImageConfig {
  maxw: number;
  maxh: number;
  ratio: number; // compress ratio
}

const processImage = async (
  image: HTMLImageElement,
  config: ProcessImageConfig
): Promise<Blob | null> => {
  const myConfig = { ...config };
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d")!;
  let height = image.height;
  let width = image.width;

  const wratio = image.width / myConfig.maxw;
  const hratio = image.height / myConfig.maxh;
  if (wratio > 1 || hratio > 1) {
    const constrainingratio = Math.max(wratio, hratio);
    width = image.width / constrainingratio;
    height = image.height / constrainingratio;
  }

  cvs.width = width;
  cvs.height = height;
  ctx.drawImage(image, 0, 0, width, height);

  return new Promise((resolve) =>
    cvs.toBlob((blob) => resolve(blob), "image/jpeg", config.ratio)
  );
};

export const handleImg = async (file: any): Promise<ProcessedImg> => {
  const dataURL = URL.createObjectURL(file);
  const img = await dataURLtoImage(dataURL);

  const processedimg = await processImage(img, {
    maxw: 1024,
    maxh: 1024,
    ratio: 0.8,
  });
  if (!processedimg)
    return { type: "error", error: `failed to process ${file.name}` };
  if (processedimg.size > 1048576 * 5)
    return { type: "error", error: `${file.name} too big` }; // 5MB max
  const newfile = new File([processedimg], file.name, {
    type: file.type,
  });
  return { type: "success", file: newfile };
};
