import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
}

const BASE_URL = 'http://localhost';

export default function () {
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const updatePayload = JSON.stringify({
    status: false,
  });
  const resPatch = http.patch(`${BASE_URL}/users/${5}`, updatePayload, params);
  check(resPatch, {
    'PATCH /users/:id status 200': (r) => r.status === 200,
  });

  sleep(1);
}