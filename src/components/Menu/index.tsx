import { CreateMenu } from 'components/Menu/styles';
import React, { CSSProperties, FC, PropsWithChildren } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<PropsWithChildren<Props>> = ({ children, style, show, onCloseModal }) => {
  return (
    <CreateMenu>
      <div>menu</div>
      {children}
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
