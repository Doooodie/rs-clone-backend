import jwt from 'jsonwebtoken';

const SECRET_KEY = 'badoone';

// function parseJwt(token) {
//   return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
// }

export default (req, res, next) => {
  if (
    req.method !== 'GET' &&
    req.method !== 'POST' &&
    req.method !== 'PUT' &&
    req.method !== 'DELETE'
  ) {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    // process.stdout.write(`${token} \n`);

    if (!token) {
      res.status(401).json({ message: 'User not authorized' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    // const a = parseJwt(token);
    // process.stdout.write(`\ntoken.payload = { id=${a.id}, name=${a.name}, email=${a.email} }\n`);

    req.user = decoded;

    next();
  } catch (e) {
    res.status(401).json({ message: 'User not authorized' });
  }

  return null;
};
