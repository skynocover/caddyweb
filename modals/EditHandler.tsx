import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import * as antd from 'antd';

import { AppContext, service, Handler } from '../components/AppContext';
import { Notification } from '../components/Notification';

interface EditHandlerProps {
  Handler: Handler;
}

export const EditHandler = ({ Handler }: EditHandlerProps) => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);

    appCtx.setDataSource((preState: service[]) => {
      preState.map((server) => {
        if (server.Handlers) {
          server.Handlers = server.Handlers?.map((item) => {
            if (item.id === Handler.id) {
              return {
                id: item.id,
                type: values.type,
                routes: values.routes,
                target: values.target,
              };
            }
            return item;
          });
        }

        return { ...server };
      });

      return [...preState];
    });

    Notification.add('success', 'Edit handler success');
  };

  return (
    <antd.Form
      onFinish={onFinish}
      initialValues={{ type: Handler.type, routes: Handler.routes, target: Handler.target }}
    >
      <h5 className="font-weight-bold mb-4">Edit Handler</h5>

      <antd.Form.Item name="type" label="Type">
        <antd.Select>
          <antd.Select.Option value={'proxy'}>{'proxy'}</antd.Select.Option>
          <antd.Select.Option value={'file_server'}>{'file_server'}</antd.Select.Option>
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
          Edit
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
