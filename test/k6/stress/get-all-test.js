import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 600 },
    { duration: '2m', target: 600 },
    { duration: '20s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost';

export default function () {
  const resGetList = http.get(`${BASE_URL}/users`);
  check(resGetList, {
    'GET /users status 200': (r) => r.status === 200,
  });

  sleep(1);
}