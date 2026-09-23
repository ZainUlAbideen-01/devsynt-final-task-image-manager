import mongoose from "mongoose"

export const ConnectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log('Database connected successfully ...')
    } catch (error) {
        console.log('Error while connecting to the database ...', error)
    }
}