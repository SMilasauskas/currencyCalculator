import {request} from './request';

const getRate = data =>
  request({
    method: 'GET',
    url: `/fx-rates?from=${data.assetFrom}&to=${data.assetTo}&amount=${data.amountFrom}`,
  });

export const RateServices = {
  getRate,
};
