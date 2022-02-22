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

// TODO : Config Value TO .env File 
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
      value: '1001',
    },
  ],
};

export const axiosAPiHeaders = {
  'Authorization': 'Basic S0FTS0E5OEZONThWV1U3VTdMWkVKODFXOjJsXy1MVUxXcEg0THdqQkl3WExwLWhIZVQwaXBLbksxTTk1UDg1UmI=',
  'x-chain-id': '1001'
};

export const feePayerAddress = '0x1F22B0f2dc00bB3aefeb835594B0FAa51DF4Bc9A';
export const nftContractAddress = '0x6e22a7676e85f2250ce2c7e8f78111a72a61d95f';
