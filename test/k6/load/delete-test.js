import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '1m', target: 500 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

const BASE_URL = 'http://localhost';

export default function () {
  const resDelete = http.del(`${BASE_URL}/users/${1}`);
  check(resDelete, {
    'DELETE /users/:id status 200/204': (r) => r.status === 200 || r.status === 204,
  });

  sleep(1);
}