import { connectDB, disconnectDB } from './config/database'
import { importData } from './scripts/import'
import { transformData } from './scripts/transform'
import { seedDataAndLogCases } from './scripts/seed'
import { exportCollection } from './scripts/export'

const runPipeline = async () => {
    try {
        await connectDB()

        await importData()
        await transformData()
        await seedDataAndLogCases()
        await exportCollection()

        console.log('\nScript finished successfully.')
    } catch (error) {
        console.error('\nError while running script:', error)
    } finally {
        await disconnectDB()
    }
}

runPipeline().then()
