import ApiError from '../error/api-error.js';

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'unknown error' });
};
