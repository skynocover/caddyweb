import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { AppContext, server, Handler } from '../components/AppContext';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DangerButton } from '../components/DangerButton';
import { MainPage } from '../components/MainPage';
import { Notification } from '../components/Notification';
import { getSession } from 'next-auth/client';
import { prisma } from '../database/db';
import { EditHandler } from '../modals/EditHandler';
import { AddHandler } from '../modals/AddHandler';

export default function Service({
  service,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();
  const [serviceName, setServiceName] = React.useState<string>('');
  const [handers, setHandler] = React.useState<Handler[]>([]);

  React.useEffect(() => {
    if (error) {
      Notification.add('error', error);
    }
    setServiceName(router.query.service as string);
  }, [router.query.service]);

  React.useEffect(() => {
    appCtx.dataSource.map((item) => {
      if (item.name === (router.query.service as string)) {
        if (item.Handlers) {
          setHandler([...item.Handlers]);
        }
      }
    });
  }, [appCtx.dataSource]);

  const deleteHandler = (handler: Handler) => {
    appCtx.setDataSource((preState: server[]) => {
      preState.map((server) => {
        if (server.Handlers && server.Handlers.length > 0) {
          server.Handlers = server.Handlers.filter((itemH) => itemH.id !== handler.id);
        }
        return { ...server };
      });

      return [...preState];
    });
  };

  const putServers = async () => {
    try {
      let data = await appCtx.fetch('put', '/api/servers', { servers: appCtx.dataSource });
      if (data) {
        // initialize();
      }
    } catch (error) {
      Notification.add('error', error.message);
    }
  };

  const columns: ColumnsType<Handler> = [
    {
      title: 'id',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: '類型',
      align: 'center',
      render: (item) => (
        <antd.Tag color={item.type === 'proxy' ? 'green' : 'geekblue'}>{item.type}</antd.Tag>
      ),
    },
    {
      title: 'routes',
      align: 'center',
      dataIndex: 'routes',
    },
    {
      title: 'target',
      align: 'center',
      dataIndex: 'target',
    },
    {
      title: '',
      align: 'center',
      render: (item) => (
        <antd.Button
          onClick={() => {
            appCtx.setModal(<EditHandler Handler={item} />);
          }}
          type="primary"
        >
          Edit Handler
        </antd.Button>
      ),
    },
    {
      title: '',
      align: 'center',
      render: (item) => (
        <DangerButton
          title={'Delete'}
          message={'Delete handler'}
          onClick={() => {
            deleteHandler(item);
          }}
        />
      ),
    },
  ];

  const content = (
    <>
      <antd.Descriptions bordered>
        <antd.Descriptions.Item label="Domain">{service?.domain}</antd.Descriptions.Item>
        <antd.Descriptions.Item label="Port">{service?.port}</antd.Descriptions.Item>
      </antd.Descriptions>
      <div className="d-flex my-2 justify-content-end ">
        <antd.Button
          onClick={() => {
            appCtx.setModal(<AddHandler serviceName={serviceName} />);
          }}
          type="primary"
        >
          Add Handler
        </antd.Button>
      </div>
      <antd.Table dataSource={handers} columns={columns} pagination={false} />
    </>
  );
  return <MainPage content={content} menuKey={router.query.service as string} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }

    const service = await prisma.service.findFirst({
      where: { name: query.service as string },
      select: { id: true, domain: true, port: true, Handlers: true },
    });

    if (!service) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }

    console.log(service);

    return { props: { service } };
  } catch (error) {
    return { props: { error: error.message } };
  }
};
