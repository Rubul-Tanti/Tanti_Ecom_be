import dotenv from 'dotenv'
dotenv.config()

export const env={
    port:process.env.PORT,
    mongo_uri:process.env.MONGO_URI,
    node_env:process.env.NODE_ENV

}