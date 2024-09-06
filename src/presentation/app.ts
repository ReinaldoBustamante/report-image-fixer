import { Label } from "../domain"
import { DataService, ImageService } from "../services"

export class App {


    constructor(
        private readonly apiUrl: string,
        private readonly apiToken: string
    ) { }

    public async start() {
        console.log('----- obtencion de datos -----')
        const reports = await DataService.extractReports({
            url: this.apiUrl,
            token: this.apiToken,
            pageSize: 750
        })

        console.log(`${reports.length} reportes extraidos`)

        const reportsToFix = reports.filter((report) => {
            return report.attributes.images.data.some(({ attributes }: any) => {
                const { width, height } = attributes;
                return width < height
            })
        })

        console.log(`${reportsToFix.length} reportes por arreglar`)


        for (let { id: idReport, attributes } of reportsToFix) {
            const imagesIds: number[] = []
            const labelsFixed: Label[] = []

            const { images, labels } = attributes
            console.log(`El reporte con id: ${idReport} tiene ${images.data.length} imagenes`)


            for (let image of images.data) {
                const { id: idImage, attributes } = image
                const { width, height, url, name } = attributes
                const labelsForImage = labels.filter((label) => label.imageCharacteristics.url === url);

                if (width < height) {
                    console.log(`imagen con id: ${idImage} se tiene que arreglar`)
                    //descarga de imagen
                    console.log(`descargando imagen localmente...`)
                    const imagePath = await ImageService.downloadImages(url)
                    console.log('done!')
                    //girar 90 grados a la izquierda la imagen
                    console.log(`rotando imagen...`)
                    const correctedImage = await ImageService.rotateImage(imagePath, 270)
                    console.log('done!')
                    //subir imagen a strapi
                    console.log(`subiendo nueva imagen a strapi...`)
                    const {id, url: newUrl} = await ImageService.uploadImages(name,correctedImage, this.apiUrl, this.apiToken)
                    imagesIds.push(id)
                    console.log('done!')
                    //eliminar imagen antigua de strapi
                    console.log(`eliminando antigua imagen de strapi...`)
                    await ImageService.deleteImageFromStrapi(this.apiUrl, this.apiToken, idImage)
                    console.log('done!')
                    console.log('arreglando coordenadas de etiquetas')
                    labelsForImage.forEach(label => {
                        const fixedLabel = { 
                            ...label,
                            imageCharacteristics: {
                                ...label.imageCharacteristics,
                                x: label.imageCharacteristics.y,
                                y: label.imageCharacteristics.x,
                                url: newUrl
                            }
                        }
                        labelsFixed.push(fixedLabel)
                    })
                    console.log('done!')

                } else {
                    labelsForImage.forEach((label) => labelsFixed.push(label));
                    imagesIds.push(idImage)
                }
            }
            console.log(`subiendo cambios al reporte con id: ${idReport}`)
            const reportUpdated = {
                ...attributes,
                images: imagesIds,
                labels: labelsFixed
            }

            await DataService.updateData({
                url: this.apiUrl,
                token: this.apiToken,
                id: idReport,
                data:reportUpdated
            })
            console.log('done!\n')


        }



    }
}