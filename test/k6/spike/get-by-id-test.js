import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 1000 },
    { duration: '1m', target: 0 },
  ],
};

const BASE_URL = 'http://localhost';

export default function () {
  const resGetById = http.get(`${BASE_URL}/users/${5}`);
  check(resGetById, {
    'GET /users/:id status 200': (r) => r.status === 200,
    'GET /users/:id return correct name': (r) => r.json('id') === userId,
  });

  sleep(1);
}