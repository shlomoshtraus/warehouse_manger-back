import "reflect-metadata"
import {DataSource} from "typeorm"
import {Product} from "./entity/product"
import {User} from "./entity/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    extra: {
        ssl:{
            rejectUnauthorized:false
        }
    },
    entities: [Product,User],
    migrations: [],
    subscribers: [],

})
export const productRepository = AppDataSource.getRepository(Product);
export const usersRepository = AppDataSource.getRepository(User);
