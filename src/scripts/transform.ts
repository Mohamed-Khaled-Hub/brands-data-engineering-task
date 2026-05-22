import { Brand } from '../models/brand.model'

export const transformData = async () => {
    console.log('\nStep 2: Data Transformation & Validation')
    const documents = await Brand.find({})

    if (documents.length === 0) {
        console.log('No documents found to transform.')
        return
    }

    let updatedCount = 0

    for (const doc of documents) {
        const rawDoc = doc.toObject() as any

        let finalName = rawDoc.brandName
        if (
            !finalName &&
            rawDoc.brand &&
            typeof rawDoc.brand === 'object' &&
            rawDoc.brand.name
        ) {
            finalName = rawDoc.brand.name
        }
        doc.brandName = finalName ? String(finalName).trim() : 'Unknown Brand'

        const rawYear =
            rawDoc.yearFounded ?? rawDoc.yearCreated ?? rawDoc.yearsFounded
        let parsedYear = NaN
        if (rawYear !== undefined && rawYear !== null) {
            parsedYear = Number(rawYear)
        }
        if (!isNaN(parsedYear) && parsedYear <= new Date().getFullYear()) {
            doc.yearFounded = parsedYear >= 1600 ? parsedYear : 1600
        } else {
            doc.yearFounded = 1600
        }

        const finalHQ = rawDoc.headquarters ?? rawDoc.hqAddress
        doc.headquarters = finalHQ
            ? String(finalHQ).trim()
            : 'Unknown Headquarters'

        let parsedLocations = NaN
        if (
            rawDoc.numberOfLocations !== undefined &&
            rawDoc.numberOfLocations !== null
        ) {
            parsedLocations = Number(rawDoc.numberOfLocations)
        }
        if (!isNaN(parsedLocations) && parsedLocations >= 1) {
            doc.numberOfLocations = parsedLocations
        } else {
            doc.numberOfLocations = 1
        }

        try {
            await doc.save()
            await Brand.updateOne(
                { _id: doc._id },
                {
                    $unset: {
                        yearCreated: 1,
                        yearsFounded: 1,
                        hqAddress: 1,
                        brand: 1,
                    },
                }
            )
            updatedCount++
        } catch (err) {
            console.error(`Validation failed for ID ${doc._id}:`, err)
        }
    }

    console.log(
        `Transformed and validated ${updatedCount}/${documents.length} brands.`
    )
}
