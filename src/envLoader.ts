export const envLoader = () => {
    return{
        port: process.env.PORT,
        database: {
            uri: process.env.DATABASE_URI,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD
        }
    }
}