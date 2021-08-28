import React from 'react';
import * as antd from 'antd';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { MainPage } from '../components/MainPage';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';
import { getSession } from 'next-auth/client';

import { Notification } from '../components/Notification';
import { prisma } from '../database/db';
import { AppContext, server } from '../components/AppContext';
import { DangerButton } from '../components/DangerButton';
import { AddService } from '../modals/AddService';
import { EditServer } from '../modals/EditServer';

const Home = ({ services, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const appCtx = React.useContext(AppContext);
  const [dataSource, setDataSource] = React.useState<server[]>([]); //coulmns data

  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const pageSize = 10;
  const [activeKey, setActiveKey] = React.useState<string>('');

  const deleteServer = () => {
    appCtx.setDataSource((preState: server[]) => {
      return preState.filter((server) => server.name !== activeKey);
    });
  };

  const columns: ColumnsType<server> = [
    {
      title: 'Name',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: 'Domain',
      align: 'center',
      dataIndex: 'domain',
    },
    {
      title: 'Port',
      align: 'center',
      dataIndex: 'port',
    },
    {
      title: 'Edit',
      align: 'center',
      render: (item) => (
        <antd.Button
          onClick={() => {
            let cserver = appCtx.dataSource.filter((item) => item.name === activeKey);
            appCtx.setModal(<EditServer server={cserver[0]} />);
          }}
          type="primary"
        >
          Edit Server
        </antd.Button>
      ),
    },
    {
      align: 'center',
      render: (item) => <DangerButton title="刪除" message="確認刪除" onClick={deleteServer} />,
    },
  ];

  // React.useEffect(() => {

  //   const temp = [{ id: 0, name: 'Home' }].concat(services).map((service: Service) => {
  //     return {
  //       key: service.name,
  //       title: service.name,
  //     };
  //   });
  //   appCtx.setMenus(temp);
  //   console.log(services);
  //   appCtx.setDataSource(services);
  // }, [appCtx.dataSource]);

  // React.useEffect(() => {
  //   if (error) {
  //     Notification.add('error', error);
  //   }
  //   const temp = [{ id: 0, name: 'Home' }].concat(services).map((service: Service) => {
  //     return {
  //       key: service.name,
  //       title: service.name,
  //     };
  //   });
  //   appCtx.setMenus(temp);
  //   console.log('services');
  //   appCtx.setDataSource(services);
  // }, []);

  const content = (
    <>
      <div className="d-flex justify-content-end mb-2">
        <antd.Button
          type="primary"
          onClick={() => {
            appCtx.setModal(<AddService />);
          }}
        >
          新增
        </antd.Button>
      </div>
      <antd.Table dataSource={appCtx.dataSource} columns={columns} pagination={false} />
    </>
  );

  return <MainPage content={content} menuKey="Home" />;
};

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

    const services = await prisma.service.findMany({
      select: { id: true, name: true, domain: true, port: true },
    });
    return { props: { services } };
  } catch (error) {
    return { props: { error: error.message } };
  }
};

export default Home;
