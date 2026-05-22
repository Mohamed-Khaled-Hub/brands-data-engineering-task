import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'

export const importData = async () => {
    console.log('\nStep 1: Raw Data Import')
    const filePath = path.join(__dirname, '../../data/brands.json')

    if (!fs.existsSync(filePath)) {
        throw new Error(`Raw data file not found at path: ${filePath}`)
    }

    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    if (!Array.isArray(rawData)) {
        throw new Error(
            'Data inside brands.json must be an array of documents.'
        )
    }

    const db = mongoose.connection.db
    if (!db) throw new Error('Database connection instance not found.')
    const rawCollection = db.collection('brands')

    await rawCollection.deleteMany({})

    const documentsToInsert = rawData.map((doc: any) => {
        if (doc._id && doc._id.$oid) {
            return {
                ...doc,
                _id: new mongoose.Types.ObjectId(doc._id.$oid),
            }
        }
        return doc
    })

    const result = await rawCollection.insertMany(documentsToInsert)
    console.log(`Successfully imported ${result.insertedCount} raw documents!`)
}
