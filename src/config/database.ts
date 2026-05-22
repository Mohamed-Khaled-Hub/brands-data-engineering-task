import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in .env')
    }

    try {
        await mongoose.connect(mongoUri)
        console.log('MongoDB connected successfully.')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect()
        console.log('MongoDB disconnected successfully.')
    } catch (error) {
        console.error('Error while disconnecting from MongoDB:', error)
    }
}
