import React from 'react'
import { MenuContainer, MenuItem } from 'src/components/Menu'

const Settings: React.FC = () => {
  return (
    <MenuContainer>
      <MenuItem icon='settings' title='设置' navigateTo='Screen-Me-Settings' />
    </MenuContainer>
  )
}

export default Settings