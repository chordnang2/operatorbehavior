import React, {useEffect, useState} from 'react'
import 'handsontable/dist/handsontable.full.css' // Import the CSS
import Handsontable from 'handsontable'
import axios from 'axios'
import moment from 'moment'
import {useSelector} from 'react-redux'
import {API_ENDPOINTS} from '../../../config/api'

function MyHandsontableComponent() {
  const container = React.createRef()
  const [tableData, setTableData] = useState([])
  const dateHandson = useSelector((state) => state.dateHandson)
  console.log(dateHandson, 'dateHandson handson')
  // useEffect(() => {
  //   console.log(dateHandson, 'dateHandson')
  // }, [dateHandson])

  useEffect(() => {
    // Fetch data from the API endpoint using Axios
    axios
      .get(API_ENDPOINTS.excel(moment(dateHandson).valueOf()))
      // .get(`http://localhost:4001/optbehav/excel/${moment(dateHandson).valueOf()}`)
      .then((response) => {
        const formattedData = response.data.data.map((row) => ({
          ...row,
          datePayroll: moment(parseInt(row.datePayroll)).format('YYYY-MM-DD'),
        }))
        setTableData(formattedData)
        console.log(formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [dateHandson])
  // Initialize Handsontable inside your component
  useEffect(() => {
    // Initialize Handsontable inside your component when the data is available
    if (tableData.length > 0) {
      const hot = new Handsontable(container.current, {
        data: tableData,
        colHeaders: [
          'Tanggal Payroll',
          'NIK',
          'Nama Driver',
          'Lokasi',
          'HM Driver',
          'Akumulasi Ritasi',
          'KM Driver',
        ],
        height: '200',
        width: '500',
        columnHeaderHeight: '20',
        autoColumnSize: true,
        colWidths: '100',
        startRows: 5,
        startCols: 5,
        minSpareRows: 1,
        licenseKey: 'non-commercial-and-evaluation',
      })

      return () => {
        hot.destroy() // Cleanup when the component unmounts
      }
    }
  }, [tableData])

  return (
    <>
      <div className='table' ref={container}></div>
      {/* <div>AAAAAAAAAAAAAAAA</div> */}
    </>
  )
}

export default MyHandsontableComponent
