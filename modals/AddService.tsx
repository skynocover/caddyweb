import React from 'react';
import * as antd from 'antd';
import { useRouter } from 'next/router';
import cuid from 'cuid';

import { AppContext, server } from '../components/AppContext';
import { Notification } from '../components/Notification';

export const AddService = () => {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();
  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);

    appCtx.setDataSource((preState: server[]) => {
      preState = [
        ...preState,
        {
          id: cuid(),
          name: values.name,
          domain: values.domain,
          port: values.port,
          Handlers: [],
        },
      ];

      return [...preState];
    });
  };

  return (
    <antd.Form onFinish={onFinish} initialValues={{ port: '80' }}>
      <h5 className="font-weight-bold mb-4">Add Service</h5>
      <antd.Form.Item
        name="name"
        label="service name"
        rules={[{ required: true, message: 'Input Service Name' }]}
      >
        <antd.Input
          prefix={<i className="fa fa-desktop" />}
          placeholder="Please Input Service AppName"
        />
      </antd.Form.Item>
      <antd.Form.Item
        name="domain"
        label="Domain"
        rules={[{ required: true, message: 'Input Domain' }]}
      >
        <antd.Input prefix={<i className="fa fa-desktop" />} placeholder="Please Input Domain" />
      </antd.Form.Item>
      <antd.Form.Item name="port" label="Port" rules={[{ required: true, message: 'Input Port' }]}>
        <antd.Input prefix={<i className="fa fa-desktop" />} placeholder="Please Input Port" />
      </antd.Form.Item>
      <antd.Form.Item className="text-center">
        <antd.Button type="primary" htmlType="submit">
          新增
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
