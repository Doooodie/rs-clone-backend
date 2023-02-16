import ApiError from '../error/api-error.js';

export default (err, _, res) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'unknown error' });
};
