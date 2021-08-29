import crypto from 'crypto';

export const objectId = () =>
  crypto.createHash('sha256').update(`${Math.random()}`).digest('hex').substring(0, 24);
