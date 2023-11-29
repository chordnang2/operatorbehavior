import {Suspense, useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {ThemeModeProvider} from '../_metronic/partials'
// import {Plugins} from '@capacitor/core'
// import {CapacitorUpdater} from '@capgo/capacitor-updater'
// CapacitorUpdater.notifyAppReady()

const App = () => {
  
  // const {Device, Modals} = Plugins
  // const [state, setState] = useState(null);

  // async function showDeviceInfo() {
  //   try {
  //     let info = await Device.getInfo()
  //     await Modals.alert({
  //       title: 'Info',
  //       message: `UUID: ${info.uuid}; Model: ${info.model}`,
  //     })
  //   } catch (error) {
  //     console.error('Error fetching device info:', error)
  //   }
  // }
  // useEffect(() => {
  //   showDeviceInfo()
  // }, [])

  
  
  // constructor(props) {
  //   super(props);
  //  showDeviceInfo = showDeviceInfo();
  // }
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
