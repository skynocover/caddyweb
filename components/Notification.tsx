import * as antd from 'antd';

let notificationDisabled: boolean = false;

const Notification = {
  add: (type: 'success' | 'error', msg: string): void => {
    if (notificationDisabled) {
      return;
    }

    notificationDisabled = true;

    if (type === 'success') {
      antd.notification.success({
        message: '成功',
        description: msg,
        duration: 1.5,
      });
    } else if (type === 'error') {
      antd.notification.error({
        message: '錯誤',
        description: msg,
        duration: 1.5,
      });
    }

    setTimeout(() => {
      notificationDisabled = false;
    }, 2000);
  },
};

export { Notification };
