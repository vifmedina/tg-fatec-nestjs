import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '1m', target: 700 },
    { duration: '1m', target: 1100 },
    { duration: '30s', target: 0 },
  ],
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