import fetch from 'node-fetch';

export default async function fetchInsightsData(tokens) {
  return fetch(
    process.env.REACT_APP_ENDPOINT_INSIGHTS, {
      method: "POST",
      body: JSON.stringify(tokens)
  });
}