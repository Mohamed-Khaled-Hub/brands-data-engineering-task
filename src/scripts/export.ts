import fs from 'fs'
import path from 'path'
import { Brand } from '../models/brand.model'

export const exportCollection = async () => {
    console.log('\nStep 4: Export Complete Collection')

    const allBrands = await Brand.find({}).lean()
    if (allBrands.length === 0) {
        console.log('No documents found to export.')
        return
    }

    const dataDir = path.join(__dirname, '../../data')
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }

    const exportFile = path.join(dataDir, 'transformed-brands.json')
    fs.writeFileSync(exportFile, JSON.stringify(allBrands, null, 2), 'utf-8')

    console.log(
        `Complete collection exported to: ${exportFile} (Total: ${allBrands.length})`
    )
}
