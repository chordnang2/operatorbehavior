import {useEffect, useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import './Optmaincek.css'

export default function Optmaincek() {
  const usersBreadcrumbs = [
    {
      title: 'Operator Main Cek',
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

  const [selectedNik, setSelectedNik] = useState(1234)
  const [rowNik, setRowNik] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [rowTahunan, setRowTahunan] = useState([])

  const [rowDetail, setRowDetail] = useState([])
  useEffect(() => {
    const getOperator = async () => {
      await axios
        .get('https://mandiriservices.biz.id/optbehav/cek')
        .then((response) => {
          //   console.log(response.data.data)
          setRowNik(response.data.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getOperator()

    const dataYearly = async () => {
      console.log(moment(selectedDate).format('YYYY'))
      const requestBody = {
        tahun: `${moment(selectedDate).format('YYYY')}`,
        nik: `${selectedNik}`,
      }
      await axios
        .post(`https://mandiriservices.biz.id/optbehav/cek/opt`, requestBody)
        .then((response) => {
          // console.log(response.data.data, 'DATA MONTHLY')
          setRowTahunan(response.data.data)
        })
    }
    dataYearly()
  }, [selectedNik, selectedDate])

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const detailModal = async (index, rowData) => {
    console.log(rowData, 'a')
    const requestBody = {
      bulan: `${rowData.bulan}`,
      nik: `${rowData.nik}`,
    }
    console.log(requestBody, 'requestBody')
    await axios
      .post('https://mandiriservices.biz.id/optbehav/cek/dino', requestBody)
      .then((response) => {
        // console.log(response, 'response')
        setRowDetail(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <div>
      <>
        <PageTitle breadcrumbs={usersBreadcrumbs}>Operator Main Cek</PageTitle>
        <div className='card mb-10'>
          <h3 className='p-2'>Cek Data Operator Main</h3>
        </div>
        <div class='container  row'>
          {/* <div class='row'> */}
          <div className='card card-custom card-flush mb-5 mx-2 col'>
            <div className='card-body py-5'>
              <div className='d-flex'>
                <div className='p-2 align-self-center'>Pilih Tahun</div>
                <div className='p-2 me-10'>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat='yyy'
                    showYearPicker
                    className='form-control'
                  />
                </div>
                <div className='p-2 align-self-center'>Pilih NIK</div>
                <div className='p-2 align-self-center'>
                  <select
                    className='form-select form-control'
                    id='floatingSelect'
                    aria-label='Floating label select example'
                    onChange={(e) => setSelectedNik(e.target.value)}
                    value={selectedNik}
                  >
                    <option value='10' defaultValue>
                      Pilih
                    </option>
                    {rowNik ? (
                      rowNik.map((item, index) => (
                        <option key={index} value={item.nik}>
                          {item.nik}
                        </option>
                      ))
                    ) : (
                      <option value='kosong'>Empty</option>
                    )}
                  </select>
                </div>
              </div>
              <hr></hr>
              {rowTahunan[0] ? (
                <h4>
                  <p className='p-2'>Nama : {rowTahunan[0][0].driver}</p>
                </h4>
              ) : (
                'Kosong'
              )}
              <table className='table text-center table-row-dashed table-row-gray-300 gy-7'>
                <thead>
                  <tr className='fw-bolder fs-6 text-gray-800'>
                    <th>Bulan</th>
                    <th>Total HM</th>
                    <th>Total RIT</th>
                    <th>Total KM</th>
                    <th>Menu</th>
                  </tr>
                </thead>
                <tbody>
                  {rowTahunan.map((item, index) => {
                    const rowData = item[0]
                    function roundToTwoDecimalPlaces(number) {
                      return Number(number.toFixed(2))
                    }
                    // Check if any value is null in the row data
                    if (
                      rowData &&
                      rowData.bulan !== null &&
                      rowData.totalHm !== null &&
                      rowData.totalRit !== null &&
                      rowData.totalKm !== null
                    ) {
                      return (
                        <tr key={index}>
                          <td>{moment(rowData.bulan).format('MMM YYYY')}</td>
                          <td id='accordionExample' title={`Bilangan asli: ${rowData.totalHm}`}>
                            <a
                              class='btn-primary btn-sm'
                              type='button'
                              data-bs-toggle='collapse'
                              data-bs-target={`#hm${index}`}
                            >
                              {roundToTwoDecimalPlaces(rowData.totalHm)}
                            </a>
                            <div
                              id={`hm${index}`}
                              class='accordion-collapse collapse'
                              data-bs-parent='#accordionExample'
                            >
                              <div class='accordion-body'>
                                Senyiur : {roundToTwoDecimalPlaces(rowData.sumHmSenyiur)}, MuaraPahu
                                : {roundToTwoDecimalPlaces(rowData.sumHmMuaraPahu)}
                              </div>
                            </div>
                          </td>
                          <td id='accordionExample' title={`Bilangan asli: ${rowData.totalRit}`}>
                            <a
                              class='btn-primary btn-sm'
                              type='button'
                              data-bs-toggle='collapse'
                              data-bs-target={`#rit${index}`}
                            >
                              {roundToTwoDecimalPlaces(rowData.totalRit)}
                            </a>
                            <div
                              id={`rit${index}`}
                              class='accordion-collapse collapse'
                              data-bs-parent='#accordionExample'
                            >
                              <div class='accordion-body'>
                                Senyiur : {roundToTwoDecimalPlaces(rowData.sumRitSenyiur)},
                                MuaraPahu : {roundToTwoDecimalPlaces(rowData.sumRitMuaraPahu)}
                              </div>
                            </div>
                          </td>
                          <td id='accordionExample' title={`Bilangan asli: ${rowData.totalKm}`}>
                            <a
                              class='btn-primary btn-sm'
                              type='button'
                              data-bs-toggle='collapse'
                              data-bs-target={`#km${index}`}
                            >
                              {roundToTwoDecimalPlaces(rowData.totalKm)}
                            </a>
                            <div
                              id={`km${index}`}
                              class='accordion-collapse collapse'
                              data-bs-parent='#accordionExample'
                            >
                              <div class='accordion-body'>
                                Senyiur : {roundToTwoDecimalPlaces(rowData.sumKmSenyiur)}, MuaraPahu
                                : {roundToTwoDecimalPlaces(rowData.sumKmMuaraPahu)}
                              </div>
                            </div>
                          </td>
                          <td>
                            <a
                              type='button'
                              data-bs-toggle='modal'
                              data-bs-target={`#exampleModal${index}`}
                              onClick={() => detailModal(index, rowData)}
                            >
                              Detail
                            </a>
                            <div
                              class='modal fade'
                              id={`exampleModal${index}`}
                              tabindex='-1'
                              aria-labelledby='exampleModalLabel'
                              aria-hidden='true'
                            >
                              <div class='modal-dialog'>
                                <div class='modal-content'>
                                  <div class='modal-body'>
                                    <table class='table'>
                                      <thead>
                                        <tr className='fw-bolder fs-6 text-gray-800'>
                                          <th scope='col'>Tanggal</th>
                                          <th scope='col'>Lokasi</th>
                                          <th scope='col'>HM</th>
                                          <th scope='col'>Rit</th>
                                          <th scope='col'>KM</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rowDetail.map((item, index) => (
                                          <tr>
                                            <td>
                                              <div className='align-self-center'>
                                                {moment(item.hari).format('DD/MM/Y')}
                                              </div>
                                            </td>
                                            <td>
                                              <div className='p-1'>Senyiur</div>
                                              <div className='p-1'>Muarapahu</div>
                                              <hr></hr>
                                              <div className='p-1'>Total</div>
                                            </td>
                                            <td>
                                              <div className='p-1'>{item.hmSenyiur}</div>
                                              <div className='p-1'>{item.hmMuarapahu}</div>
                                              <hr></hr>
                                              <div className='p-1'>
                                                {item.hmSenyiur + item.hmMuarapahu}
                                              </div>
                                            </td>
                                            <td>
                                              <div className='p-1'>
                                                {roundToTwoDecimalPlaces(item.ritSenyiur)}
                                              </div>
                                              <div className='p-1'>
                                                {roundToTwoDecimalPlaces(item.ritMuarapahu)}
                                              </div>
                                              <hr></hr>
                                              <div className='p-1'>
                                                {roundToTwoDecimalPlaces(
                                                  item.ritSenyiur + item.ritMuarapahu
                                                )}
                                              </div>
                                            </td>
                                            <td>
                                              <div className='p-1'>
                                                {roundToTwoDecimalPlaces(item.kmSenyiur)}
                                              </div>
                                              <div className='p-1'>
                                                {roundToTwoDecimalPlaces(item.kmMuarapahu)}
                                              </div>
                                              <hr></hr>
                                              <div className='p-1'>
                                                {roundToTwoDecimalPlaces(
                                                  item.kmSenyiur + item.kmMuarapahu
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    } else {
                      // Return null for rows with null values
                      return null
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* <div className='card card-custom card-flush mb-5 mx-2 col'>
            <div className='card-body py-5'>test</div>
          </div> */}
          {/* </div> */}
        </div>
      </>
    </div>
  )
}
