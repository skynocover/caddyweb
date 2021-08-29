import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getSession } from 'next-auth/client';
import { Prisma } from '.prisma/client';
import { prisma } from '../../database/db';
import { Resp, Tresp } from '../../resp/resp';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'PUT':
      return await putSerivce();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function putSerivce() {
    try {
      const session = await getSession({ req });
      if (!session) {
        res.json(Resp.backendCheckSessionFail);
        return;
      }
      let { services } = req.body;
      if (!services) {
        res.json(Resp.paramInputEmpty);
        return;
      }
      let caddyFile = '';
      let serviceIDs: string[] = []; //要被刪除的serviceID
      let handlerIDs: string[] = []; //要被刪除的handlerID
      for (const service of services) {
        const instance = {
          name: service.name,
          domain: service.domain,
          port: service.port,
        };
        const srv = await prisma.service.upsert({
          where: { id: service.id },
          update: instance,
          create: instance,
        });
        serviceIDs.push(srv.id);

        caddyFile += `${service.domain ? service.domain : ''}:${service.port} {\n`;

        for (const handler of service.Handlers) {
          const instance = {
            type: handler.type,
            routes: handler.routes,
            target: handler.target,
          };
          const h = await prisma.handler.upsert({
            where: { id: handler.id },
            update: instance,
            create: { ...instance, Service: { connect: { id: srv.id } } },
          });
          handlerIDs.push(h.id);

          caddyFile += `${handler.type === 'proxy' ? 'reverse_proxy ' : 'root '}${
            handler.routes ? handler.routes + ' ' : ''
          }${handler.target}\n`;
          if (handler.type === 'file_server') {
            caddyFile += `file_server\n`;
          }
        }
        caddyFile += `}\n`;
      }
      await prisma.handler.deleteMany({ where: { id: { notIn: handlerIDs } } });
      await prisma.service.deleteMany({ where: { id: { notIn: serviceIDs } } });

      caddyFile += `${process.env.NEXTAUTH_URL} {\n`;
      caddyFile += `reverse_proxy localhost:${process.env.PORT}\n`;
      caddyFile += `}\n`;

      console.log('caddyFile');
      console.log(caddyFile);

      let result = await axios.post('http://localhost:2019/load', caddyFile, {
        headers: { 'Content-Type': 'text/caddyfile' },
      });

      res.json(Resp.success);
    } catch (error) {
      console.log(error.message);
      res.json({ error: error.message, ...Resp.sqlExecFail });
    }
  }
};
