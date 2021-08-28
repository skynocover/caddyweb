import React from 'react';
import * as antd from 'antd';
import { useRouter } from 'next/router';

import { AppContext } from '../components/AppContext';
import { Notification } from '../components/Notification';

interface DB {
  containerName: string;
  dbUser: string;
  path: string;
  count: number;
  DBName: string;
  DBtype: string;
}

interface SetDBProps {
  serviceName: string;
  DB?: DB;
}

export const SetDB = ({ serviceName, DB }: SetDBProps) => {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();
  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);

    const data = await appCtx.fetch('put', `/api/db`, {
      serviceName,
      containerName: values.containerName,
      dbUser: values.dbUser,
      dbPW: values.dbPW,
      path: values.path,
      count: values.count,
      DBName: values.DBName,
      DBtype: values.DBtype,
    });

    if (data) {
      router.push('/' + serviceName);
      Notification.add('success', 'Success Add');
    }
  };

  return (
    <antd.Form onFinish={onFinish} initialValues={DB ? DB : { DBtype: 'postgres', count: 30 }}>
      <h5 className="font-weight-bold mb-4">Set {serviceName} DB</h5>
      <antd.Form.Item
        name="containerName"
        label="contaner名稱"
        rules={[{ required: true, message: 'Input Container Name' }]}
      >
        <antd.Input
          prefix={<i className="fa fa-desktop" />}
          placeholder="Please Input Container AppName"
        />
      </antd.Form.Item>
      <antd.Form.Item
        name="dbUser"
        label="DB User 名稱"
        rules={[{ required: true, message: 'Input DB User Name' }]}
      >
        <antd.Input
          prefix={<i className="fa fa-desktop" />}
          placeholder="Please Input DB User Name"
        />
      </antd.Form.Item>
      <antd.Form.Item
        name="dbPW"
        label="DB 密碼"
        rules={[{ required: true, message: 'Input DB Password' }]}
      >
        <antd.Input.Password
          prefix={<i className="fa fa-desktop" />}
          placeholder="Please Input DB Password"
        />
      </antd.Form.Item>
      <antd.Form.Item
        name="path"
        label="DB 備份儲存路徑"
        rules={[{ required: true, message: 'Input DB backup path' }]}
      >
        <antd.Input
          prefix={<i className="fa fa-desktop" />}
          placeholder="Please Input DB backup path"
        />
      </antd.Form.Item>
      <antd.Form.Item
        name="count"
        label="DB 備份數量上限"
        rules={[{ required: true, message: 'Input DB backup count' }]}
      >
        <antd.InputNumber min={1} />
      </antd.Form.Item>
      <antd.Form.Item
        name="DBName"
        label="DB名稱"
        rules={[{ required: true, message: 'Input DB name' }]}
      >
        <antd.Input prefix={<i className="fa fa-desktop" />} placeholder="Please Input DB name" />
      </antd.Form.Item>
      <antd.Form.Item name="DBtype" label="DB類型">
        <antd.Select style={{ width: 120 }}>
          <antd.Select.Option value="postgres">Postgres</antd.Select.Option>
          <antd.Select.Option value="mongo">mongo</antd.Select.Option>
          {/* <antd.Select.Option value="mysql">MySQL</antd.Select.Option> */}
        </antd.Select>
      </antd.Form.Item>
      <antd.Form.Item className="text-center">
        <antd.Button type="primary" htmlType="submit">
          新增
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
