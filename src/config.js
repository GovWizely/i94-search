import 'babel-polyfill';

const config = Object.assign({
  development: {
    api: {
      i94: {
        host: 'https://api.govwizely.com/v1/i94_monthly_data/search',
        apiKey: 'Z48wSr3E3nNN4itDUvE4Clje',
      },
    },
  },
  production: {
    api: {
      i94: {
        host: 'https://api.govwizely.com/v1/i94_monthly_data/search',
        apiKey: 'hQ4L7ylI9POH3QuqxOY_l2UC',
      },
    },
  },
});

export default config[process.env.NODE_ENV];