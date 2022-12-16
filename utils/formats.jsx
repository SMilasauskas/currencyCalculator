export const getBalanceString = (value, minF = 2, maxF = 2) => {
  return !value || isNaN(value)
    ? '0'
    : // : value.toLocaleString('en-US', {
      //     minimumFractionDigits: minF,
      //     maximumFractionDigits: minF > maxF ? minF : maxF,
      //   });
      value.toLocaleString();
};

export const localeStringToNumber = value => {
  if (!value) {
    return 0;
  }
  return Number(value.replace(/,/g, ''));
};
