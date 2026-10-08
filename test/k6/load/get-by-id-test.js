import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 300 },
    { duration: '1m', target: 300 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

const BASE_URL = 'http://localhost';

export default function () {
  const resGetById = http.get(`${BASE_URL}/users/${5}`);
  check(resGetById, {
    'GET /users/:id status 200': (r) => r.status === 200,
  });

  sleep(1);
}