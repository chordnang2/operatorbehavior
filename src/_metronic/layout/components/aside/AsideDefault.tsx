/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useLayout} from '../../core'
import {KTIcon} from '../../../helpers'
import {AsideMenu} from './AsideMenu'
import {AsideToolbar} from './AsideToolbar'

const AsideDefault: FC = () => {
  const {classes} = useLayout()

  return (
    <div
      id='kt_aside'
      className='aside bg-white shadow-sm'
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
    >
      {/* begin::Aside Toolbarl */}
      <div className='aside-toolbar flex-column-auto border-bottom' id='kt_aside_toolbar'>
        <AsideToolbar />
      </div>
      {/* end::Aside Toolbarl */}
      
      {/* begin::Aside menu */}
      <div className='aside-menu flex-column-fluid'>
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Aside menu */}

      {/* begin::Footer */}
      <div className='aside-footer flex-column-auto pt-5 pb-7 px-5' id='kt_aside_footer'>
        <div className='d-flex flex-stack'>
          <div className='text-dark fs-7'>
            <span className='fw-bold'>Operator Behavior</span>
            <span className='text-gray-700 fw-semibold ms-1'>v1.0</span>
          </div>
        </div>
      </div>
      {/* end::Footer */}
    </div>
  )
}

export {AsideDefault}
