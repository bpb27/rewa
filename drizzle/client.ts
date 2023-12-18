import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: 'libsql://rewa-test-1-bpb27.turso.io',
  authToken:
    'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEyLTE4VDA2OjM1OjExLjkyNDU1MTY2NVoiLCJpZCI6IjZhNjU1YTVlLTlkNmEtMTFlZS1iNTk2LTEyYWIwZGY3MGIxZiJ9.KpC_ATR5V9e96YLWlgPaZet2IPlJWG5JpAWXX6zZjt8fLNe3ZFS644-jMQIYA6VV1vXUb2Ll-tE-akmIO4ybBA',
});
export const db = drizzle(client, { schema });
