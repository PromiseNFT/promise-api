export const defaultDBConn = {
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
};

export const caverAPIConn = {
  // kasAccessKeyId: 'KASKA98FN58VWU7U7LZEJ81W',
  // kasSecretAccessKey: '2l_-LULWpH4LwjBIwXLp-hHeT0ipKnK1M95P85Rb',
  // kasAuthorization: 'Basic S0FTS0E5OEZONThWV1U3VTdMWkVKODFXOjJsXy1MVUxXcEg0THdqQkl3WExwLWhIZVQwaXBLbksxTTk1UDg1UmI='
  // x-chain-id: 1001, 8217 is Main Netwokr, 1001 is Baobab Test Network
  headers: [
    {
      name: 'Authorization',
      value:
        'Basic S0FTS0E5OEZONThWV1U3VTdMWkVKODFXOjJsXy1MVUxXcEg0THdqQkl3WExwLWhIZVQwaXBLbksxTTk1UDg1UmI=',
    },
    {
      name: 'x-chain-id',
      value: 1001,
    },
  ],
};

export const FeePayerAddress = '';
