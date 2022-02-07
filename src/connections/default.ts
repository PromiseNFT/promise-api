export const defaultConn = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'team5',
    database: 'team5',
    entities: [
        `${__dirname}/../**/entities/*.js`,
        `${__dirname}/../**/entities/*.ts`,
    ],
    synchronize: false,
}
