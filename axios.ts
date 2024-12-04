import oriAxios from "axios";

const axios = oriAxios;

axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
};

axios.defaults.withCredentials = true;

export default axios;
