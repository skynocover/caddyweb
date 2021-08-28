import React from 'react';
import * as antd from 'antd';
import cuid from 'cuid';

import { AppContext, server, Handler } from '../components/AppContext';
import { Notification } from '../components/Notification';

interface AddHandlerProps {
  serviceName: string;
}

export const AddHandler = ({ serviceName }: AddHandlerProps) => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {
    console.log(appCtx.dataSource);
  }, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);

    let newDataSource = [...appCtx.dataSource];
    newDataSource.map((server) => {
      if (server.name === serviceName) {
        if (!server.Handlers) server.Handlers = [];
        server.Handlers.push({
          id: cuid(),
          type: values.type,
          routes: values.routes,
          target: values.target,
        });
      }
    });

    appCtx.setDataSource([...newDataSource]);
    Notification.add('success', 'Add new handler success');
  };

  return (
    <antd.Form
      onFinish={onFinish}
      initialValues={{ type: 'proxy', routes: '*', target: 'localhost:8080' }}
    >
      <h5 className="font-weight-bold mb-4">Add New Handler</h5>

      <antd.Form.Item name="type" label="Type">
        <antd.Select>
          <antd.Select.Option value="proxy">proxy</antd.Select.Option>
          <antd.Select.Option value="file_server">file_server</antd.Select.Option>
        </antd.Select>
      </antd.Form.Item>

      <antd.Form.Item name="routes">
        <antd.Input prefix={<i className="fa fa-exchange" />} placeholder="Please input routes" />
      </antd.Form.Item>

      <antd.Form.Item
        name="target"
        rules={[{ required: true, message: 'Target should not empty!' }]}
      >
        <antd.Input
          prefix={<i className="fa fa-space-shuttle" />}
          placeholder="Please input target"
        />
      </antd.Form.Item>

      <antd.Form.Item className="text-center">
        <antd.Button type="primary" htmlType="submit">
          Add
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
