import {FC} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTIcon, WithChildren} from '../../../helpers'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const AsideMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)

  return (
    <div className='menu-item'>
      <Link 
        className={clsx('menu-link without-sub py-3', {
          'active': isActive,
          'menu-hover-bg': !isActive
        })} 
        to={to}
      >
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
        {isActive && <span className='menu-arrow opacity-75'><i className='bi bi-chevron-right fs-6 text-white'></i></span>}
      </Link>
      {children}
    </div>
  )
}

export {AsideMenuItem}
