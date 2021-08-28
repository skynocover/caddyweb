import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
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
      let { services } = req.body;
      let caddyFile = '';
      let serviceIDs: string[] = []; //要被刪除的serviceID
      let handlerIDs: string[] = []; //要被刪除的handlerID
      for (const service of services) {
        const find = await prisma.service.findFirst({ where: { id: service.id } });
        let id: string;
        if (!find) {
          const record = await prisma.service.create({
            data: {
              name: service.name,
              domain: service.domain,
              port: service.port,
            },
          });
          id = record.id;
        } else {
          await prisma.service.update({
            data: {
              name: service.name,
              domain: service.domain,
              port: service.port,
            },
            where: { id: service.id },
          });
          id = service.id;
        }
        serviceIDs.push(id);

        caddyFile += `${service.domain ? service.domain : ''}:${service.port} {\n`;

        for (const handler of service.Handlers) {
          const find = await prisma.handler.findFirst({ where: { id: handler.id } });
          if (!find) {
            const record = await prisma.handler.create({
              data: {
                type: handler.type,
                routes: handler.routes,
                target: handler.target,
                Service: { connect: { id } },
              },
            });
            handlerIDs.push(record.id);
          } else {
            await prisma.handler.update({
              data: {
                type: handler.type,
                routes: handler.routes,
                target: handler.target,
              },
              where: { id: handler.id },
            });
            handlerIDs.push(handler.id);
          }

          caddyFile += `${handler.type === 'proxy' ? 'reverse_proxy ' : 'root '}${
            handler.routes ? handler.routes + ' ' : ''
          }${handler.target}\n`;
          if (handler.type === 'file_server') {
            caddyFile += `file_server\n`;
          }
        }
        caddyFile += `}\n`;
      }

      caddyFile += `${process.env.DOMAIN}:80 {\n`;
      caddyFile += `reverse_proxy localhost:${process.env.PORT}\n`;
      caddyFile += `}\n`;

      // let result = await axios.post('http://localhost:2019/load', caddyFile, {
      //   headers: { 'Content-Type': 'text/caddyfile' },
      // });

      await prisma.handler.deleteMany({ where: { id: { notIn: handlerIDs } } });

      await prisma.service.deleteMany({ where: { id: { notIn: serviceIDs } } });

      console.log(caddyFile);

      res.json(Resp.success);
    } catch (error) {
      console.log(error.message);
      res.json({ error: error.message, ...Resp.sqlExecFail });
    }
  }
};
