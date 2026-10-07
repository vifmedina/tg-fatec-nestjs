import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
}

const BASE_URL = 'http://localhost';

export default function () {
  const resGetById = http.get(`${BASE_URL}/users/${5}`);
  check(resGetById, {
    'GET /users/:id status 200': (r) => r.status === 200,
    'GET /users/:id return correct name': (r) => r.json('id') === 5,
  });

  sleep(1);
}