export const envLoader = () => {
    return{
        environment: process.env.NODE_ENV || 'dev',
        port: process.env.PORT,
        database: {
            uri: process.env.DATABASE_URI,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD
        }
    }
}