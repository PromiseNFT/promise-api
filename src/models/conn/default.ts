export const defaultConn = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'team5',
    database: 'team5',
    entities: [
        `${__dirname}/../default/*.js`,
        `${__dirname}/../default/*.ts`,
    ],
    synchronize: false,
}
