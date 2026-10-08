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
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const createPayload = JSON.stringify({
    name: `User ${__VU}-${__ITER}`,
    age: Math.floor(Math.random() * 40) + 18,
    status: true,
  });

  const resPost = http.post(`${BASE_URL}/users`, createPayload, params);
  const postSuccess = check(resPost, {
    'POST /users status 201': (r) => r.status === 201,
  });

  if (!postSuccess) {
    return;
  }

  sleep(1);
}