import React from 'react';
import * as antd from 'antd';

import { AppContext, server, Handler } from '../components/AppContext';
import { Notification } from '../components/Notification';

interface EditServerProps {
  server: server;
}

export const EditServer = ({ server }: EditServerProps) => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {
    console.log('server: ', JSON.stringify(server));
  }, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);

    for (const item of appCtx.dataSource) {
      if (item.name === values.name && item.id !== server.id) {
        Notification.add('error', '服務名稱重複');
        return;
      }
    }

    appCtx.setDataSource((preState: server[]) => {
      let temp = preState.map((item) => {
        if (item.id === server.id) {
          item = {
            id: server.id,
            domain: values.domain,
            name: values.name,
            port: values.port,
            Handlers: server.Handlers,
          };
        }
        return { ...item };
      });

      return [...temp];
    });

    Notification.add('success', '修改成功');
  };

  return (
    <div>
      <h5 className="font-weight-bold mb-4">Edit Server</h5>

      <antd.Form onFinish={onFinish} initialValues={server}>
        <antd.Form.Item name="name" rules={[{ required: true, message: 'Server名稱不可以空白!' }]}>
          <antd.Input prefix={<i className="fa fa-comment" />} placeholder="請輸入Server名稱" />
        </antd.Form.Item>

        <antd.Form.Item name="domain">
          <antd.Input prefix={<i className="fa fa-at" />} placeholder="請輸入Domain" />
        </antd.Form.Item>

        <antd.Form.Item name="port" rules={[{ required: true, message: 'Port不可以空白!' }]}>
          <antd.Input prefix={<i className="fa fa-code-fork" />} placeholder="請輸入Port" />
        </antd.Form.Item>

        <antd.Form.Item className="text-center">
          <antd.Button type="primary" htmlType="submit">
            Edit
          </antd.Button>
        </antd.Form.Item>
      </antd.Form>
    </div>
  );
};
