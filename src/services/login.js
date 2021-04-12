import fetch from 'node-fetch';

export default async function sendLogin(email, password, otp) {
  return fetch(
    process.env.REACT_APP_ENDPOINT_LOGIN, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        otp
      })
  });
}