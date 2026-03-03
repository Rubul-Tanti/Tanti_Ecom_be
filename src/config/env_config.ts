import dotenv from 'dotenv'
dotenv.config()

export const env={
    port:process.env.PORT,
    mongo_uri:process.env.MONGO_URI,
    node_env:process.env.NODE_ENV,
    smtp_host:process.env.SMTP_HOST,
    smtp_port:process.env.SMTP_PORT,
    email:process.env.EMAIL,
    emailPass:process.env.EMAIlPASS
    ,jwt_access_secret:process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret:process.env.JWT_ACCESS_SECRET
}