import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../database/db';
import { Resp, Tresp } from '../../resp/resp';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  async function postSerivce() {
    try {
      const { name, domain, port } = req.body;

      console.log(JSON.stringify({ name, domain, port }));

      await prisma.service.create({
        data: {
          name,
          domain,
          port: +port,
        },
      });
      res.json(Resp.success);
    } catch (error) {
      console.log(error.message);
      res.json({ error: error.message, ...Resp.sqlExecFail });
    }
  }

  async function deleteService() {
    try {
      const id = +req.query.id;
      if (isNaN(id)) {
        res.json(Resp.paramInputFormateError);
        return;
      }

      res.json(Resp.success);
    } catch (error) {
      console.log(error.message);
      res.json({ error: error.message, ...Resp.sqlExecFail });
    }
  }

  switch (req.method) {
    case 'POST':
      return await postSerivce();
    case 'DELETE':
      return await deleteService();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
