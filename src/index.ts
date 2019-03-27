require('dotenv').config()
import { createExpressServer } from 'routing-controllers'

import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import connectionOptions from './connectionOptions'
const PORT = process.env.PORT || 8989

createConnection(connectionOptions).then(async connection => {

    const app = createExpressServer({
        cors: true,
        controllers: [__dirname + '/controller/*'],
        middlewares: [__dirname + '/middleware/*']
    })
    app.listen(PORT)
    console.log(`Running on port ${PORT}`)

}).catch(error => console.log(error));
