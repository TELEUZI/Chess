import MongoStore from 'connect-mongo';

const sessionStore = MongoStore.create({
  mongoUrl: process.env.DEV_URL,
  ttl: 20000,
});

export const sessionOptions = {
  secret: process.env.SESSION_SECRET ?? 'secret',
  cookie: { maxAge: 20000, httpOnly: true, signed: true },
  saveUninitialized: true,
  resave: false,
  store: sessionStore,
};
