import { CreateMenu } from 'components/Menu/styles';
import React, { FC } from 'react';

const Menu: FC = ({ children }) => {
  return (
    <CreateMenu>
      <div>menu</div>
      {children}
    </CreateMenu>
  );
};

export default Menu;
