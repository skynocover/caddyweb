import React from 'react';
import axios from 'axios';
import * as antd from 'antd';

import { Notification } from '../components/Notification';

export interface service {
  id: string;
  domain: string;
  name: string;
  port: string;
  Handlers: Handler[];
}

export interface Handler {
  id: string;
  type: string;
  routes: string | null;
  target: string;
}

interface Menu {
  key: string;
  title: string;
}

interface AppContextProps {
  setModal: (modal: any) => void;

  account: string;
  setAccount: (value: string) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;

  fetch: (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => Promise<any>;

  // menus: Menu[];
  // setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  dataSource: service[];
  setDataSource: React.Dispatch<React.SetStateAction<service[]>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [modal, setModal] = React.useState<any>(null);

  const [account, setAccount] = React.useState('admin');
  const [isAdmin, setIsAdmin] = React.useState(false);

  const [menus, setMenus] = React.useState<Menu[]>([]);
  const [dataSource, setDataSource] = React.useState<service[]>([]); //coulmns data
  /////////////////////////////////////////////////////

  React.useEffect(() => {
    axios.defaults.baseURL = '';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }, []);

  const fetch = async (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => {
    let data: any = null;
    try {
      const response = await axios({
        method,
        url,
        data: param,
      });
      console.log('response', response.data);

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error: any) {
      Notification.add('error', error.message);
    }
    return data;
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        setModal: (modal: any) => setModal(modal),

        account,
        setAccount,
        isAdmin,
        setIsAdmin,

        fetch,

        // menus,
        // setMenus,
        dataSource,
        setDataSource,
      }}
    >
      {modal && (
        <antd.Modal
          visible={modal !== null}
          onOk={() => setModal(null)}
          onCancel={() => setModal(null)}
          footer={null}
          closable={false}
        >
          {modal}
        </antd.Modal>
      )}

      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
