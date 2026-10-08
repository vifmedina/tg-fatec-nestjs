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
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const resDelete = http.del(`${BASE_URL}/users/${5}`);
  check(resDelete, {
    'DELETE /users/:id status 200/204': (r) => r.status === 200 || r.status === 204,
  });

  sleep(1);
}