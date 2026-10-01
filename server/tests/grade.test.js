import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { Review } from '../src/models/Review.js';
import { graded, printReport } from './rubric.js';

const BASE = '/api/reviews';
const REQUEST_TIMEOUT_MS = 5000;

// Each run uses its own throwaway database on the MONGO_URI cluster, so parallel
// runs never touch each other's data. The shared account is not allowed to drop
// a database, so cleanup drops the run's collections instead: a MongoDB
// database with no collections no longer exists. A run that dies before its
// cleanup leaves its database behind, so every run first sweeps grade_
// databases older than STALE_AFTER_MS, dated by the timestamp in their name.
const RUN_DB = `grade_${process.env.GITHUB_RUN_ID || 'local'}_${Date.now()}_${randomBytes(3).toString('hex')}`;
const GRADE_DB = /^grade_[^_]+_(\d{13})_[0-9a-f]{6}$/;
const STALE_AFTER_MS = 60 * 60 * 1000;

async function dropAllCollections(db) {
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  for (const { name } of collections) {
    await db.dropCollection(name).catch(() => {});
  }
}

async function sweepStaleRunDatabases() {
  const client = mongoose.connection.getClient();
  const { databases } = await client.db().admin().listDatabases({ nameOnly: true });
  const cutoff = Date.now() - STALE_AFTER_MS;
  for (const { name } of databases) {
    const match = GRADE_DB.exec(name);
    if (match && Number(match[1]) < cutoff) await dropAllCollections(client.db(name));
  }
}

beforeAll(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set (see README "Database connection")');
  await mongoose.connect(process.env.MONGO_URI, { dbName: RUN_DB, autoIndex: true, maxPoolSize: 2 });
  await sweepStaleRunDatabases().catch((err) => console.warn('Stale grade_ database sweep skipped:', err.message));
  await Review.init();
}, 60000);

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  printReport();
  if (mongoose.connection.readyState === 1) {
    await dropAllCollections(mongoose.connection.db).catch(() => {});
  }
  await mongoose.disconnect();
});

// ---------- helpers ----------

const api = {
  get: (path) => request(app).get(path).timeout(REQUEST_TIMEOUT_MS),
  post: (path, body) => request(app).post(path).send(body).timeout(REQUEST_TIMEOUT_MS)
};

const newId = () => new mongoose.Types.ObjectId().toString();
const idOf = (doc) => String(doc?._id ?? doc?.id);

function seed(overrides = {}) {
  return Review.create({
    facilityCode: 'FC101',
    rating: 4,
    comment: 'Seeded entry',
    reviewedBy: newId(),
    ...overrides
  });
}

function numericOption(path, key) {
  const value = path?.options?.[key];
  return Array.isArray(value) ? value[0] : value;
}

// ---------- graded checks ----------

graded('model_fields', async () => {
  const schema = Review.schema;
  const own = Object.keys(schema.paths)
    .filter((p) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(p))
    .sort();
  expect(own).toEqual(['facilityCode', 'rating', 'comment', 'reviewedBy'].sort());
  expect(schema.path('facilityCode').instance).toBe('String');
  expect(schema.path('rating').instance).toBe('Number');
  expect(schema.path('comment').instance).toBe('String');
  expect(schema.path('reviewedBy').instance).toBe('ObjectId');
  expect(schema.path('reviewedBy').options.ref).toBe('User');
});

graded('model_rules', async () => {
  const schema = Review.schema;
  expect(schema.path('facilityCode')?.isRequired).toBe(true);

  const rating = schema.path('rating');
  expect(rating?.isRequired).toBe(true);
  expect(numericOption(rating, 'min')).toBe(1);
  expect(numericOption(rating, 'max')).toBe(5);

  expect(Boolean(schema.path('comment')?.isRequired)).toBe(false);
  expect(Boolean(schema.path('reviewedBy')?.isRequired)).toBe(false);
});

graded('unique_index', async () => {
  const schema = Review.schema;
  expect(schema.path('createdAt')).toBeDefined();
  expect(schema.path('updatedAt')).toBeDefined();

  const compoundUnique = schema
    .indexes()
    .filter(([fields, options]) => Object.keys(fields).length > 1 && options?.unique === true);
  expect(compoundUnique).toHaveLength(1);
  expect(compoundUnique[0][0]).toEqual({ facilityCode: 1, reviewedBy: 1 });
});

graded('create', async () => {
  const payload = {
    facilityCode: 'FC101',
    rating: 4,
    comment: 'Clear and useful',
    reviewedBy: newId()
  };
  const res = await api.post(BASE, payload);
  expect(res.status).toBe(201);
  expect(res.body.review).toBeDefined();
  expect(res.body.review.facilityCode).toBe('FC101');
  expect(res.body.review.rating).toBe(4);

  const stored = await Review.findById(idOf(res.body.review)).lean();
  expect(stored).not.toBeNull();
  expect(stored.facilityCode).toBe('FC101');
  expect(stored.rating).toBe(4);
  expect(stored.comment).toBe('Clear and useful');
  expect(String(stored.reviewedBy)).toBe(payload.reviewedBy);
});

graded('list', async () => {
  const a = await seed({ rating: 5 });
  const b = await seed({ facilityCode: 'FC202', rating: 2 });

  const res = await api.get(BASE);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.reviews)).toBe(true);
  expect(res.body.reviews).toHaveLength(2);
  const ids = res.body.reviews.map(idOf).sort();
  expect(ids).toEqual([a._id.toString(), b._id.toString()].sort());
});

graded('get_one', async () => {
  const doc = await seed();

  const res = await api.get(`${BASE}/${doc._id}`);
  expect(res.status).toBe(200);
  expect(idOf(res.body.review)).toBe(doc._id.toString());
  expect(res.body.review.facilityCode).toBe('FC101');

  const missing = await api.get(`${BASE}/${newId()}`);
  expect(missing.status).toBe(404);
  expect(missing.body).toEqual({ message: 'Review not found' });
});

graded('summary', async () => {
  await seed({ rating: 5 });
  await seed({ rating: 4 });
  await seed({ rating: 3 });
  await seed({ facilityCode: 'FC202', rating: 1 });

  const spy = jest.spyOn(Review, 'aggregate');
  try {
    const res = await api.get(`${BASE}/summary?facilityCode=FC101`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ facilityCode: 'FC101', averageRating: 4, reviewCount: 3 });
    expect(spy).toHaveBeenCalled();

    const empty = await api.get(`${BASE}/summary?facilityCode=FC999`);
    expect(empty.status).toBe(200);
    expect(empty.body).toEqual({ facilityCode: 'FC999', averageRating: 0, reviewCount: 0 });
  } finally {
    spy.mockRestore();
  }
});

graded('summary_query', async () => {
  await seed();

  // /summary must be its own route, not swallowed by /:id.
  const summary = await api.get(`${BASE}/summary?facilityCode=FC101`);
  expect(summary.status).toBe(200);
  expect(summary.body.facilityCode).toBe('FC101');

  const noQuery = await api.get(`${BASE}/summary`);
  expect(noQuery.status).toBe(400);
  expect(noQuery.body).toEqual({ message: 'facilityCode is required' });
});
