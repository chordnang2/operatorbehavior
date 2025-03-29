import React from 'react'
import clsx from 'clsx'
import {useLocation} from 'react-router'
import {checkIsActive, KTIcon, WithChildren} from '../../../helpers'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const AsideMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)

  return (
    <div
      className={clsx('menu-item mb-1', {'here show': isActive}, 'menu-accordion')}
      data-kt-menu-trigger='click'
    >
      <span className={clsx('menu-link py-3', {'active': isActive})}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && (
          <span className={clsx('menu-icon', {'text-white': isActive, 'text-dark': !isActive})}>
            <KTIcon iconName={icon} className={clsx('fs-2', {'text-white': isActive, 'text-dark': !isActive})} />
          </span>
        )}
        {fontIcon && (
          <span className='menu-icon me-0'>
            <i className={clsx('bi fs-3 me-2', fontIcon, {'text-white': isActive, 'text-dark': !isActive})}></i>
          </span>
        )}
        <span className={clsx('menu-title fw-semibold', {'text-white': isActive, 'text-dark': !isActive})}>{title}</span>
        <span className={clsx('menu-arrow', {'text-white': isActive, 'text-dark': !isActive})}></span>
      </span>
      <div className={clsx('menu-sub menu-sub-accordion ps-2', {'menu-active-bg': isActive})}>
        {children}
      </div>
    </div>
  )
}

export {AsideMenuItemWithSub}
