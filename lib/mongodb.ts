import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable');
}

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client =
  global._mongoClientPromise ??
  new MongoClient(uri, options).connect();

if (process.env.NODE_ENV !== 'production') {
  global._mongoClientPromise = client;
}

export default client;