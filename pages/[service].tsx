import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { AppContext, service, Handler } from '../components/AppContext';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DangerButton } from '../components/DangerButton';
import { MainPage } from '../components/MainPage';
import { Notification } from '../components/Notification';
import { getSession } from 'next-auth/client';
import { prisma } from '../database/db';
import { EditHandler } from '../modals/EditHandler';
import { AddHandler } from '../modals/AddHandler';

export default function Service({ error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();
  const [service, setService] = React.useState<service>({
    id: '',
    name: '',
    domain: '',
    port: '',
    Handlers: [],
  });
  const [handlers, setHandlers] = React.useState<Handler[]>([]);

  React.useEffect(() => {
    if (error) {
      Notification.add('error', error);
    }
    appCtx.dataSource.map((item) => {
      if (item.name === (router.query.service as string)) {
        setService({ ...item });
        setHandlers([...item.Handlers]);
      }
    });
  }, [router.query.service, appCtx.dataSource]);

  const deleteHandler = (handler: Handler) => {
    let newDataSource = [...appCtx.dataSource];
    newDataSource.map((item) => {
      if (item.id === service.id) {
        let newHandlers = item.Handlers.filter((item) => item.id !== handler.id);
        item.Handlers = [...newHandlers];
      }
      return { ...item };
    });

    appCtx.setDataSource([...newDataSource]);
  };

  const columns: ColumnsType<Handler> = [
    {
      title: 'Type',
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
        <antd.Button onClick={() => appCtx.setModal(<EditHandler Handler={item} />)} type="primary">
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
          onClick={() => deleteHandler(item)}
        />
      ),
    },
  ];

  const Deploy = async () => {
    try {
      let data = await appCtx.fetch('put', '/api/service', { services: appCtx.dataSource });
      if (data) Notification.add('success', 'Deploy Services Success');
    } catch (error: any) {
      Notification.add('error', error.message);
    }
  };

  const content = (
    <>
      <antd.Descriptions bordered>
        <antd.Descriptions.Item label="Domain">{service.domain}</antd.Descriptions.Item>
        <antd.Descriptions.Item label="Port">{service.port}</antd.Descriptions.Item>
      </antd.Descriptions>
      <div className="d-flex my-2 justify-content-end ">
        <DangerButton title="Deploy All Services" message="Ready for deploy?" onClick={Deploy} />
        <div className="flex-fill" />
        <antd.Button
          onClick={() => appCtx.setModal(<AddHandler serviceName={service.name} />)}
          type="primary"
        >
          Add Handler
        </antd.Button>
      </div>
      <antd.Table dataSource={handlers} columns={columns} pagination={false} />
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

    return { props: {} };
  } catch (error: any) {
    return { props: { error: error.message } };
  }
};
