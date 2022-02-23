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

export const feePayerAddress = '0xfc544ec68cdfb66bbff16ecca19e551f7b10c2c1';
export const feePayerPrivateKey = '0x01ca17f67d1574865a653e34d7cd786f6fd3db0e062203e2a3c845705586be87';
// export const nftContractAddress = '0x6e22a7676e85f2250ce2c7e8f78111a72a61d95f';
export const nftContractAddress = '0xb2E78b1Ca2D43F2F4C934A714C0d9E32069eccc5';
