import React, {useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
// import MyHandsontableComponent from './MyHandsontableComponent'
import 'flatpickr/dist/themes/material_green.css'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {handson_excel} from '../../redux/action'
import MyhandsontablereactComponent from './MyhandsontablereactComponent'

export default function Excel() {
  const usersBreadcrumbs = [
    {
      title: 'Upload Excel',
      path: '',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  const [dateState, setDateState] = useState({
    date1: new Date(),
  })
  const dispatch = useDispatch()
  dispatch(handson_excel({dateHandson: moment(dateState.date1).format('YYYY-MM-DD')}))

  const totalDataHanson = useSelector((state) => state.totalDataHanson)
  console.log(totalDataHanson,'totalDataHanson')
  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Upload Excel</PageTitle>
      <div className='card mb-10'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold text-dark'>DATA EXCEL HM TRIP OPERATOR </span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              Tanggal {moment(dateState.date1).format('YYYY-MM-DD')}
            </span>
          </h3>
        </div>
        <div className='card-header border-0 pt-2'>
          <div className=' d-flex'>
            <div className='p-2 align-self-center'>Pilih Tanggal</div>
            <div className='p-2'>
              <Flatpickr
                value={dateState.date1}
                onChange={([date1]) => {
                  setDateState({date1})
                }}
                className='form-control'
                placeholder='Pick date'
              />
            </div>
          </div>
        </div>
        {/* <div className='card-body d-flex align-items-center py-8'> */}
        {/* <MyHandsontableComponent /> */}
        {/* </div> */}
        <div className='card-body align-items-center w-100 py-8'>
                    <MyhandsontablereactComponent />
        </div>
      </div>
    </>
  )
}
