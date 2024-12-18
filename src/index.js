import { fail } from "assert";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";

let totalSuccess = 0;
function isImageFile(filename) {
  const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = path.extname(filename).toLowerCase();
  return validExtensions.includes(ext);
}

async function compressImage(inputPath, outputPath, element) {
  try {
    const compressedPath = `${outputPath}/${element.replace(
      path.extname(element),
      ".webp"
    )}`;
    await fs.ensureDir(outputPath);
    await sharp(inputPath)
      .webp({ quality: 80 }) // Convert to WebP format with 80% quality
      .toFile(compressedPath)
      
    totalSuccess+=1;
    console.log(totalSuccess);
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error);
  }
}

async function exploreFiles(InDir, OutDir) {
  const fileList = await fs.readdir(InDir);
  console.log("Directorio ", InDir);

  fileList
    .filter((e) => e !== "node_modules")
    .forEach(async (element) => {
      const newInPath = `${InDir}/${element}`;
      const newOutPath = `${OutDir}/${element}`;

      const isDirectory = (await fs.stat(newInPath)).isDirectory();
      if (isDirectory) {
        await exploreFiles(newInPath, newOutPath);
      } else if (isImageFile(element)) {
        await compressImage(newInPath, OutDir, element);
      } else {
        await fs
          .copy(newInPath, newOutPath)
          .then(() => {
            totalSuccess+=1;
            console.log(totalSuccess);
          })
          .catch(() =>
            console.log("Hubo un error en el archivo: ", newInPath, "\n")
          );
      }
    });

  return;
}
const funcion = async () => {
  await exploreFiles("./assets", "./output1");
};

funcion();
