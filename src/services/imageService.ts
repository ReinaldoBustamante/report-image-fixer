import fs from 'fs';
import path from 'path';
import FormData from 'form-data'
import sharp from 'sharp'
import { Axios } from '../config'
export class ImageService {

    private static async deleteImagesFromFs(): Promise<void> {
        const dirPath = path.join(__dirname, '..', '..', 'assets', 'img');
        if (fs.existsSync(dirPath)) {
            try {
                const files = await fs.promises.readdir(dirPath);
                await Promise.all(files.map(file => {
                    const filePath = path.join(dirPath, file);
                    return fs.promises.unlink(filePath);
                }));
            } catch (err) {
                console.error(`Error al leer o eliminar archivos: ${err}`);
            }
        } else {
            console.log('La carpeta no existe');
        }
    }    

    public static async downloadImages(url: string): Promise<string> {

        const dirPath = path.join(__dirname, '..', '..', 'assets', 'img');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const fileName = path.basename(url);
        const outputPath = path.join(dirPath, fileName);
        const binaryData = await Axios.getBinaryData(url)
        fs.writeFileSync(outputPath, binaryData);

        return outputPath
    }


    public static async uploadImages(name: string, imgBuffer: Buffer, url: string, token: string) {
        const form = new FormData();
        form.append('files', imgBuffer, { filename: `${name}` })
        const image = await Axios.postData(`${url}/api/upload`, token, form)
        const { id, url: urlImage } = image[0]
        await this.deleteImagesFromFs()

        return {
            id,
            url: urlImage
        }
    }

    public static async rotateImage(imagePath: string, grade: number) {
        try {
            const correctedImage = await sharp(imagePath)
                .rotate(grade)
                .toFormat('png')
                .toBuffer();
                
            return correctedImage;
        } catch (error) {
            console.error(`Error al rotar la imagen: ${error}`);
            throw error;
        }
    }
    

    public static async deleteImageFromStrapi(url: string, token: string, id:number) {
        const imageDeleted = await Axios.deleteData(`${url}/api/upload/files/${id}`, token)

        return imageDeleted
        
    }

}



