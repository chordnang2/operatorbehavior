import {FC, lazy, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
// import Inspeksi from '../pages/sheap/inspeksi/Inspeksi'
import Excel from '../pages/excel/Excel'
import Komplain from '../pages/komplain/Komplain'
import {Login} from '../modules/auth/components/Login'
import Hmtrip from '../pages/Hmtrip'
import Komplainopt from '../pages/Komplainopt'
import Cek from '../pages/cek/Cek'
import Optmaincek from '../pages/cek/Optmaincek'
import Uang from '../pages/Uang'
import Pelanggaran from '../pages/pelanggaran/Pelanggaran'
import Sp from '../pages/pelanggaran/Sp'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      {/* <Route path='login' element={<Login />} /> */}
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route
          path='builder'
          element={
            <SuspensedView>
              <BuilderPageWrapper />
            </SuspensedView>
          }
        />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}

        {/* OPT BEHAV START*/}
        <Route
          path='behavior/excel/*'
          element={
            <SuspensedView>
              <Excel />
            </SuspensedView>
          }
        />
        <Route
          path='behavior/komplain/*'
          element={
            <SuspensedView>
              <Komplain />
            </SuspensedView>
          }
        />
        <Route
          path='behavior/cek/*'
          element={
            <SuspensedView>
              <Cek />
            </SuspensedView>
          }
        />
        <Route
          path='behavior/optmaincek/*'
          element={
            <SuspensedView>
              <Optmaincek />
            </SuspensedView>
          }
        />

        <Route
          path='behavior/hmtrip/*'
          element={
            <SuspensedView>
              <Hmtrip />
            </SuspensedView>
          }
        />
        <Route
          path='behavior/komplainopt/*'
          element={
            <SuspensedView>
              <Komplainopt />
            </SuspensedView>
          }
        />
        <Route
          path='uang/*'
          element={
            <SuspensedView>
              <Uang />
            </SuspensedView>
          }
        />
        <Route
          path='pelanggaran/*'
          element={
            <SuspensedView>
              <Pelanggaran />
            </SuspensedView>
          }
        />
        <Route
          path='sp/*'
          element={
            <SuspensedView>
              <Sp />
            </SuspensedView>
          }
        />
        {/* OPT BEHAV END*/}
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
