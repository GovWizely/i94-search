import 'babel-polyfill';

const config = Object.assign({
  development: {
    api: {
      i94: {
        host: 'http://127.0.0.1:3000/v1/i94_monthly_data/search',
        apiKey: 'devkey',
      },
    },
  },
  production: {
    api: {
      i94: {
        host: 'https://api.trade.gov/v1/i94_monthly_data/search',
        apiKey: 'O6fmOIPtrvDlqoDe2_6UbKJc',
      },
    },
  },
});

export default config[process.env.NODE_ENV];