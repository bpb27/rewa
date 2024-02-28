import * as trpcNext from '@trpc/server/adapters/next';
import fs from 'fs';
import path from 'path';
import { appRouter } from '~/trpc/router';

// needed so vercel includes sqlite file in the lambas
const _files = fs.readdirSync(path.join(process.cwd(), 'prisma'));

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
