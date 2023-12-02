/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import noUiSlider, {target} from 'nouislider'
import {useLayout} from '../../core'
import {KTIcon} from '../../../helpers'
import {DefaultTitle} from './page-title/DefaultTitle'
import {ThemeModeSwitcher} from '../../../partials'
import axios from 'axios'

const HeaderToolbar = () => {
  const {classes} = useLayout()
  const [status, setStatus] = useState<string>('1')
  const [namaOpt, setNamaOpt] = useState<string | undefined>(undefined)

  console.log(localStorage.getItem('user'))
  const userNama = localStorage.getItem('userNama')
  const nikOpt = localStorage.getItem('user')

  useEffect(() => {
    if (!userNama) {
      const getNama = async () => {
        await axios
          .post(`https://mandiriservices.biz.id/optbehav/user/${nikOpt}`)
          .then((response) => {
            // console.log(response.data.data[0].nama, 'getNama')
            setNamaOpt(response.data.data[0].nama)
            // userNama = response.data.data[0].nama
          })
      }
      getNama()
    } else {
      setNamaOpt(userNama)
    }

    const slider: target = document.querySelector('#kt_toolbar_slider') as target
    const rangeSliderValueElement: Element | null = document.querySelector(
      '#kt_toolbar_slider_value'
    )

    if (!slider) {
      return
    }

    slider.innerHTML = ''

    noUiSlider.create(slider, {
      start: [5],
      connect: [true, false],
      step: 1,
      range: {
        min: [1],
        max: [10],
      },
    })

    slider.noUiSlider?.on('update', function (values: any, handle: any) {
      if (!rangeSliderValueElement) {
        return
      }

      rangeSliderValueElement.innerHTML = parseInt(values[handle]).toFixed(1)
    })
  }, [])

  return (
    <div className='toolbar d-flex align-items-stretch'>
      {/* begin::Toolbar container */}
      <div
        className={`${classes.headerContainer.join(
          ' '
        )} py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between`}
      >
        <DefaultTitle />
        <div className='d-flex align-items-stretch overflow-auto pt-3 pt-lg-0'>
          {/* begin::Action wrapper */}
          Hallo bapak &nbsp;<b>{namaOpt}</b>
        </div>
        {/* end::Toolbar container */}
      </div>
    </div>
  )
}

export {HeaderToolbar}
