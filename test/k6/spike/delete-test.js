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
  const resDelete = http.del(`${BASE_URL}/users/${5}`);
  check(resDelete, {
    'DELETE /users/:id status 200/204': (r) => r.status === 200 || r.status === 204,
  });

  sleep(1);
}