import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // POST
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

  const userId = resPost.json('id');

  // GET ALL
  const resGetList = http.get(`${BASE_URL}/users`);
  check(resGetList, {
    'GET /users status 200': (r) => r.status === 200,
  });

  // GET BY ID
  const resGetById = http.get(`${BASE_URL}/users/${userId}`);
  check(resGetById, {
    'GET /users/:id status 200': (r) => r.status === 200,
    'GET /users/:id return correct name': (r) => r.json('id') === userId,
  });

  // PATCH
  const updatePayload = JSON.stringify({
    status: false,
  });
  const resPatch = http.patch(`${BASE_URL}/users/${userId}`, updatePayload, params);
  check(resPatch, {
    'PATCH /users/:id status 200': (r) => r.status === 200,
  });

  // DELETE
  const resDelete = http.del(`${BASE_URL}/users/${userId}`);
  check(resDelete, {
    'DELETE /users/:id status 200/204': (r) => r.status === 200 || r.status === 204,
  });

  sleep(1);
}