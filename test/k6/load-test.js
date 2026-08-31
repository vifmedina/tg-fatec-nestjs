import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // get
  const resGet = http.get('http://localhost:3000/users');
  check(resGet, {
    'get status 200': (r) => r.status === 200,
  });

  // post
  const url = 'http://localhost:3000/users';
  const payload = JSON.stringify({
    name: `User ${__VU}-${__ITER}`,
    age: 25,
    status: 'active',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resPost = http.post(url, payload, params);
  check(resPost, {
    'post status 201': (r) => r.status === 201,
  });

  sleep(1);
}