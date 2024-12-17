import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'

function isImageFile(filename) {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(filename).toLowerCase();
  return validExtensions.includes(ext);
}

async function compressImage(inputPath, outputPath, element) {
  try {
    const compressedPath = `${outputPath}/${element.replace(path.extname(element), '.webp')}`;
    fs.ensureDir(outputPath)
    await sharp(inputPath)
      .webp({ quality: 80 }) // Convert to WebP format with 80% quality
      .toFile(compressedPath);

    console.log(`Compressed: ${inputPath} -> ${compressedPath}`);
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error);
  }
}



async function exploreFiles(InDir, OutDir){
    const fileList = await fs.readdir(InDir);
    console.log("Directorio ", InDir);
    
    fileList.filter(el=> el !== "node_modules").forEach(async (element)=>{
        const newInPath = `${InDir}/${element}`
        const newOutPath = `${OutDir}/${element}`

        const isDirectory = (await fs.stat(newInPath)).isDirectory()
        if(isDirectory){
            exploreFiles(newInPath, newOutPath)
        }else if(isImageFile(element)){
            await compressImage(newInPath, OutDir, element);
        }
    })
    
    return;
}
const funcion = async ()=> await exploreFiles('./', './output1')
    .then(() => console.log('Processing complete!'))
    .catch(err => console.error('Error processing folders:', err));

funcion()