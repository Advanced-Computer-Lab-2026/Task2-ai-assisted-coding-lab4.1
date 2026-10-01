# Task 4.1: Training Session Evaluation API

You are building the backend for a training session evaluation service, using Express and MongoDB (Mongoose) only, with no frontend. Anyone can browse and submit session evaluations, and there is no login for this resource.

## What's already done for you

- `server/src/index.js`, `server/src/app.js`, `server/src/config/db.js` —
  app bootstrap and DB connection. The `/api/evaluations` router is already
  mounted in `app.js`.
- `server/src/models/User.js` — a plain user schema (`name`, `email`,
  `password`). It's not tied to any login flow here; it exists so
  `Evaluation.evaluatedBy` has something to reference.
- `server/src/controllers/userController.js` + `server/src/routes/users.js`
  — full CRUD over users, already wired, as a worked example of what your
  `evaluationController.js` should look like structurally (validation → DB
  call → response, one function per route).

## Run locally

```
cd server
npm install
# create server/.env (see "Database connection" below)
npm run dev
npm test
```

`npm test` uses the same `MONGO_URI` from your `.env`. Each test run creates
its own temporary database on that cluster and deletes it when it finishes,
so it never touches the data you use with `npm run dev`.

## Database connection

There is no `.env` provided. Create `server/.env` yourself (it's
git-ignored) with:

```
PORT=4000
MONGO_URI=mongodb://tasks:pass1234@ac-j3acrgb-shard-00-00.lueesfz.mongodb.net:27017,ac-j3acrgb-shard-00-01.lueesfz.mongodb.net:27017,ac-j3acrgb-shard-00-02.lueesfz.mongodb.net:27017/?ssl=true&replicaSet=atlas-6to6iy-shard-0&authSource=admin&appName=Cluster0
```

## What you need to build

All of your work goes in three files: `server/src/models/Evaluation.js`,
`server/src/controllers/evaluationController.js` and
`server/src/routes/evaluations.js`.

### 1. The `Evaluation` model — `server/src/models/Evaluation.js`

| field | type | rules |
|---|---|---|
| `sessionCode` | String | required (e.g. `"SS101"`) |
| `score` | NumberAll of your work goes in three files: `server/src/models/Evaluation.js`,
`server/src/controllers/evaluationController.js` and
`server/src/routes/evaluations.js`.

### 1. The `Evaluation` model — `server/src/models/Evaluation.js`

| field | type | rules |
|---|---|---|
| `sessionCode` | String | required (e.g. `"SS101"`) |
| `score` | Number | required, `min: 1`, `max: 5` |
| `comment` | String | optional |
| `evaluatedBy` | ObjectId ref `User` | optional |

Keep `{ timestamps: true }` and add a **compound unique index** on
`{ sessionCode: 1, evaluatedBy: 1 }`.
 | required, `min: 1`, `max: 5` |
| `comment` | String | optional |
| `evaluatedBy` | ObjectId ref `User` | optional |

Keep `{ timestamps: true }` and add a **compound unique index** on
`{ sessionCode: 1, evaluatedBy: 1 }`.

### 2. Controller + routes

Implement these three controller functions and wire them in
`server/src/routes/evaluations.js`:

| method | path | function | success response |
|---|---|---|---|
| POST | `/api/evaluations` | `createEvaluation` | `201` `{ evaluation: <document> }` |
| GET | `/api/evaluations` | `getAllEvaluations` | `200` `{ evaluations: [...] }` |
| GET | `/api/evaluations/:id` | `getEvaluation` | `200` `{ evaluation: <document> }` |

- For `GET /api/evaluations/:id` on a valid id that does not exist, respond
  `404` with `{ message: 'Evaluation not found' }`.
- Pass unexpected errors to `next(err)`, as the User controller does.

### 3. The summary endpoint

Implement `getEvaluationSummary` and wire it as
`GET /api/evaluations/summary?sessionCode=SS101`. It returns:

```
{ "sessionCode": "SS101", "averageScore": <number>, "evaluationCount": <integer> }
```

- Compute it with `Evaluation.aggregate()`: `$match` on `sessionCode`, then
  `$group` with `$avg` of `score` and `$sum: 1`. Loading documents
  with `find()` and averaging in JavaScript does not count.
- If nothing matches, return the requested `sessionCode` with
  `averageScore: 0` and `evaluationCount: 0`.
- If the `sessionCode` query parameter is missing, respond `400` with
  `{ message: 'sessionCode is required' }`.
- `/summary` must be reachable and must not be handled by `/:id`.

## Submission

1. Fork this repository and do all of your work in your fork.
2. Commit and push to your fork.
3. Open a pull request from your fork to `main` of this repository.
4. Fill in the pull request description using the provided template: the
   submission line must be your identifier in the format `XX-XXXXX TXX`.

## AI use

You're expected to use AI tools while building this. You remain
responsible for all of the code you submit.
