import React from 'react';
import * as antd from 'antd';

interface DangerButtonProps {
  title: string;
  message: string;
  onClick?: () => void;
  disabled?: boolean;
}

const DangerButton = ({ title, message, onClick, disabled }: DangerButtonProps) => {
  const showDialog = () => {
    antd.Modal.confirm({
      title: '確認',
      icon: <i />,
      content: message,
      okText: '確認',
      cancelText: '取消',
      onOk: onClick,
    });
  };

  return (
    <antd.Button type="primary" danger disabled={disabled} onClick={showDialog}>
      {title}
    </antd.Button>
  );
};

export { DangerButton };
