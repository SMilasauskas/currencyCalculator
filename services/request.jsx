import axios, {AxiosRequestConfig, AxiosError, Method} from 'axios';

export const request = async ({
  method = 'POST',
  url = '',
  data = null,
  contentType = 'application/json',
  baseURL = 'https://my.transfergo.com/api',
}) => {
  const options = {
    method,
    baseURL,
    url,
    headers: {
      'content-type': contentType,
    },
    timeout: 20000,
  };

  if (data && method === 'GET') {
    options.params = data;
  } else if (data) {
    options.data = data;
  }

  const errorHandler = axiosError => {
    const error = {
      status: 0,
      message: '',
      data: null,
      code: '',
      codeMessage: '',
    };
    if (axiosError.response) {
      error.data = axiosError.response.data || null;
      error.status = axiosError.response.status;
    } else {
      error.status = 600;
    }
    return error;
  };
  return new Promise((resolve, reject) => {
    axios(options)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(errorHandler(error));
      });
  });
};
