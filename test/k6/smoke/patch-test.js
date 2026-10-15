import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
}

const BASE_URL = 'http://localhost/api';

export default function () {
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const updatePayload = JSON.stringify({
    name: `Updated User ${__VU}-${__ITER}`,
    age: Math.floor(Math.random() * 40) + 18,
    isActive: false,
  });
  const resPatch = http.patch(`${BASE_URL}/users/${5}`, updatePayload, params);
  check(resPatch, {
    'PATCH /users/:id status 200': (r) => r.status === 200,
  });

  sleep(1);
}