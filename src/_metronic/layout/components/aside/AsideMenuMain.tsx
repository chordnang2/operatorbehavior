/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import Swal from 'sweetalert2'
import {useEffect, useState} from 'react'

export function AsideMenuMain() {
  const intl = useIntl()
  // const handleLogout = () => {
  //   Swal.fire({
  //     title: 'Logout',
  //     text: 'Are you sure you want to logout?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, logout',
  //     cancelButtonText: 'Cancel',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Handle the logout action here (e.g., call an API to log the user out).
  //       // You can use your preferred method to handle actual logout.
  //       // For this example, we'll simply display a success message.
  //       Swal.fire('Logged out!', 'You have been successfully logged out.', 'success')
  //     }
  //   })
  // }
  // const [userLocal, setUserLocal] = useState<string | null>(null)
  // useEffect(() => {
  //   ;(() => {
  //     setUserLocal(user)
  //   })()
  // }, [])
  
  // console.log(userLocal)
  const menuUser = () => {
    const user = localStorage.getItem('user')
    if (user === 'admin') {
      return (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Behavior</span>
            </div>
          </div>
          <AsideMenuItem to='/behavior/excel' icon='switch' title='Excel Upload' />
          <AsideMenuItem to='/behavior/komplain' icon='switch' title='Komplain' />
        </>
      )
    } else {
      return (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Menu</span>
            </div>
          </div>

          <AsideMenuItem to='/behavior/hmtrip' icon='switch' title='HM TRIP' />
          {/* <AsideMenuItem to='/behavior/komplainopt' icon='switch' title='Komplainopt'  /> */}
        </>
      )
    }
  }
  // const handleNone = () => {}
  return (
    <>
      {/* <AsideMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
      />
      <AsideMenuItem to='/builder' icon='switch' title='Layout Builder' /> */}
      {/* SHEAP */}
      {menuUser()}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Akun</span>
        </div>
      </div>
      <AsideMenuItem to='logout' icon='user' title='Logout' />
      {/* SHEAP */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div> */}
      {/* <AsideMenuItemWithSub to='/crafted/pages' title='Pages' icon='gift'>
        <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <AsideMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <AsideMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub> */}
      {/* <AsideMenuItemWithSub to='/crafted/accounts' title='Accounts' icon='profile-circle'>
        <AsideMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/error' title='Errors' icon='cross-circle'>
        <AsideMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <AsideMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/crafted/widgets' title='Widgets' icon='element-plus'>
        <AsideMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      <AsideMenuItemWithSub to='/apps/chat' title='Chat' icon='message-text-2'>
        <AsideMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItem to='/apps/user-management/users' icon='shield-tick' title='User management' /> */}
      {/* <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='document' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {process.env.REACT_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}
