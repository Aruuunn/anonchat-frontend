export const isValidJwt = (token: any): boolean => {
  const exp = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  return typeof token === 'string' && exp.test(token);
};
