import {HotTable} from '@handsontable/react'
import {registerAllModules} from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.min.css'
import {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import moment from 'moment'
import {useSelector} from 'react-redux'
import './MyhandsontablereactComponent.css'

// register Handsontable's modules
registerAllModules()

const MyhandsontablereactComponent = () => {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false) // State to track loading
  const [lastDate, setLastDate] = useState()

  const dateHandson = useSelector((state) => state.dateHandson)
  // const dateHandson = '2023-10-26'
  const hotRef = useRef(null)
  //   const [countTableData, setCountTableData] = useState()

  const [saveSukses, setSaveSukses] = useState(false)
  const [saveGagal, setSaveGagal] = useState(false)
  let sumTableData = 0

  // Iterate through the array and sum the values in the hmDriver property
  for (let i = 0; i < tableData.length; i++) {
    if (tableData[i].hmDriver !== null) {
      sumTableData += Number(tableData[i].hmDriver)
    }
  }
  useEffect(() => {
    setLoading(true) // Set loading to true when data fetching starts

    // Fetch data from the API endpoint using Axios
    axios
      .get(`https://mandiriservices.biz.id/optbehav/excel/${dateHandson.toString()}`)
      .then((response) => {
        const formattedData = response.data.data.map((row) => ({
          ...row,
        }))
        setTableData(formattedData)
        // setCountTableData(formattedData.length)
        // console.log(
        //   moment(response.data.lastDate[0].datePayroll).format('YYYY-MM-DD'),
        //   'datePayroll'
        // )
        setLastDate(moment(response.data.lastDate[0].datePayroll).format('DD/MM/YYYY'))
        setLoading(false) // Set loading to false when data fetching is complete
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoading(false) // Set loading to false in case of an error
      })
  }, [dateHandson])

  const saveClickCallback = () => {
    const hot = hotRef.current.hotInstance
    const data = {data: hot.getData()}

    axios
      .post(
        `https://mandiriservices.biz.id/optbehav/excel/create/${dateHandson.toString()}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        setSaveSukses(true)
        setTimeout(() => {
          setSaveSukses(false)
        }, 3000)
        // Handle the response here
      })
      .catch((error) => {
        console.error('An error occurred:', error)
        setSaveGagal(true)
        setTimeout(() => {
          setSaveGagal(false)
        }, 3000)
      })
    setSaveSukses(false)
    setSaveGagal(false)
  }
  const handleButtonClick = () => {
    const element = document.getElementById('bottom')
    if (element) {
      element.scrollIntoView({behavior: 'smooth'}) // Scroll to the element smoothly
    }
  }
  const handleButtonUpClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Scroll smoothly
    })
  }
  console.log(dateHandson)
  return (
    <>
      {loading ? ( // Render a spinner when loading is true
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading Data...</span>
        </div>
      ) : (
        <>
          <div>
            <p className='text-danger'>Update Terakhir tanggal {lastDate}</p>
          </div>
          <div className='d-flex'>
            <div className='p-2 align-self-center'>Total Data : {tableData.length}</div>
            <div className='p-2 align-self-center'>Total HM : {sumTableData}</div>
            <div className='p-2 align-self-center'>
              <button onClick={handleButtonClick} className='btn btn-sm btn-info align-self-center'>
                <i class='fa fa-arrow-down' aria-hidden='true'></i>
              </button>
            </div>
          </div>
          <HotTable
            editable={true}
            ref={hotRef}
            data={tableData ?? []}
            dataSchema={{
              nik: null,
              driver: null,
              lokasi: null,
              hmDriver: null,
              akumRit: null,
              kmDriver: null,
            }}
            startRows={5}
            startCols={5}
            height='auto'
            width='auto'
            colHeaders={[
              'NIK',
              'Nama Driver',
              'Lokasi',
              'HM Driver',
              'Akumulasi Ritasi',
              'KM Driver',
            ]}
            minSpareRows={2}
            licenseKey='non-commercial-and-evaluation'
            className='custom-table pb-2'
            contextMenu='true'
          />
          <div className='d-flex' id='bottom'>
            <div className='p-2 align-self-center'>
              <button
                onClick={handleButtonUpClick}
                className='btn btn-sm btn-info align-self-center'
              >
                <i class='fa fa-arrow-up' aria-hidden='true'></i>
              </button>
            </div>
            <div className='p-2 align-self-center'>
              <div className='controls'>
                <button id='save' className='btn btn-success btn-sm' onClick={saveClickCallback}>
                  Save data
                </button>
              </div>
            </div>
            <div
              className={`p-2 align-self-center success-message ${
                saveSukses ? 'fade-in' : 'fade-out'
              }`}
            >
              Berhasil save!
            </div>
            <div
              className={`p-2 align-self-center align-self-center error-message ${
                saveGagal ? 'fade-in' : 'fade-out'
              }`}
            >
              Save Gagal!
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MyhandsontablereactComponent
