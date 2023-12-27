import { connect } from 'mongoose';

const { DEV_URL } = process.env;

export function connectToMongo(): Promise<void> {
  return new Promise((resolve, reject) => {
    connect(DEV_URL ?? 'mongodb://localhost:27017', {
      dbName: 'chess',
    })
      .then((db) => {
        console.log('Mongo connected', db.connection.readyState, db.connection.name);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}
