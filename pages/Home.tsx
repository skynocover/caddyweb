import React from 'react';
import * as antd from 'antd';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { MainPage } from '../components/MainPage';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';
import { getSession } from 'next-auth/client';

import { Notification } from '../components/Notification';
import { prisma } from '../database/db';
import { AppContext, service, Handler } from '../components/AppContext';
import { DangerButton } from '../components/DangerButton';
import { AddService } from '../modals/AddService';
import { EditService } from '../modals/EditService';

const Home = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const appCtx = React.useContext(AppContext);

  const DeleteService = (id: string) => {
    appCtx.setDataSource((preState: service[]) => preState.filter((service) => service.id !== id));
  };

  const EditSerivce = (id: string) => {
    const cserver = appCtx.dataSource.filter((service) => service.id === id);
    appCtx.setModal(<EditService service={cserver[0]} />);
  };

  const filterDup = (array: Array<string>) =>
    array.filter((item, index) => array.indexOf(item) === index);

  const columns: ColumnsType<service> = [
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
      title: 'Target',
      align: 'center',
      render: (item) => (
        <>
          {filterDup(
            item.Handlers.map((handler: Handler) => handler.target.replaceAll('localhost:', '')),
          ).join(' ')}
        </>
      ),
    },
    {
      title: 'Edit',
      align: 'center',
      render: (item) => (
        <antd.Button type="primary" onClick={() => EditSerivce(item.id)}>
          Edit
        </antd.Button>
      ),
    },
    {
      align: 'center',
      render: (item) => (
        <DangerButton title="Delete" message="確認刪除" onClick={() => DeleteService(item.id)} />
      ),
    },
  ];

  const content = (
    <>
      <div className="d-flex justify-content-end mb-2">
        <antd.Button type="primary" onClick={() => appCtx.setModal(<AddService />)}>
          Add Service
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

    return { props: {} };
  } catch (error: any) {
    return { props: { error: error.message } };
  }
};

export default Home;
