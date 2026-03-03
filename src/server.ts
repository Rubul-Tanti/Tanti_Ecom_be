import {app} from './app'
import http from 'http'
import { env } from './config/env_config'
import logger from './utils/logger'
const server =http.createServer(app)
server.listen(env.port,()=>{logger.info(`Server is running on port ${env.port}`)})