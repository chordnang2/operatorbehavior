import {useEffect, useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import axios from 'axios'

export default function Cek() {
  const usersBreadcrumbs = [
    {
      title: 'Cek',
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
  const [rowNik, setRowNik] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedNik, setSelectedNik] = useState(1234)
  const [namaOpt, setNamaOpt] = useState()

  const [loading, setLoading] = useState(false)
  const [totalPeringkat, setTotalPeringkat] = useState()
  const [dateStart, setDateStart] = useState()
  const [dateEnd, setDateEnd] = useState()
  const [peringkat, setPeringkat] = useState()
  const [hmTrip, setHmTrip] = useState()
  const [tableOptSenyiur, setTableOptSenyiur] = useState([])
  const [tableOptMuarapahu, setTableOptMuarapahu] = useState([])

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }
  console.log(moment(selectedDate).format('DD-MM-YYYY'))
  console.log(selectedNik)

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

    const corePage = async () => {
      const requestBody = {
        bulan: `${moment(selectedDate).format('YYYY-MM-DD')}`,
        nik: `${selectedNik}`,
      }
      // console.log(moment(selectedDate).format('YYYY-MM-DD'), localStorage.getItem('user'))
      setLoading(true)
      await axios
        .post(`https://mandiriservices.biz.id/optbehav/peringkat`, requestBody)
        .then((response) => {
          // console.log('response_peringkat', response)
          setTotalPeringkat(response.data.data.dataTotalPeringkat)
          setPeringkat(response.data.data.result.ranking)
        })
        .catch((error) => {
          // console.error('Error peringkat:', error)
          setTotalPeringkat(<errorServer />)
          setPeringkat(<errorServer />)
        })

      await axios
        .post(`https://mandiriservices.biz.id/optbehav/hmtrip`, requestBody)
        .then((response) => {
          // console.log('response_hmtrip', response)
          setHmTrip(response.data.data.dataProduktifitas)
          setDateStart(response.data.data.dateStart)
          setDateEnd(response.data.data.dateEnd)
        })
        .catch((error) => {
          setHmTrip(<errorServer />)
          console.error('Error hmTrip:', error)
        })
      await axios
        .post(`https://mandiriservices.biz.id/optbehav/table`, requestBody)
        .then((response) => {
          console.log('response_table', response)
          // console.log(response)

          setTableOptSenyiur(response.data.data.hmTripSenyiur)
          setTableOptMuarapahu(response.data.data.hmTripMp)

          console.log(tableOptMuarapahu, 'MUARA PAHU')
          // setTableOptLokasi(response.data.data.hmTripMp)
          setLoading(false)
        })
        .catch((error) => {
          console.log(error)
          setTableOptSenyiur(<errorServer />)
          setTableOptMuarapahu(<errorServer />)
          setLoading(false)
        })
      // if (totalPeringkat && hmTrip && tableOptSenyiur) {
      //   setLoading(false)
      // }
    }
    corePage(selectedDate, selectedNik)

    const getNama = async () => {
      await axios
        .post(`https://mandiriservices.biz.id/optbehav/user/${selectedNik}`)
        .then((response) => {
          // console.log(response.data.data[0].nama, 'getNama')
          setNamaOpt(response.data.data[0].nama)
        })
    }
    getNama(selectedNik)
  }, [selectedDate, selectedNik])

  function Kosong() {
    return <span className='badge badge-danger'>Kosong</span>
  }
  function roundToTwoDecimalPlaces(number) {
    return Number(number.toFixed(2))
  }
  return (
    <div>
      {loading ? (
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      ) : (
        <>
          <PageTitle breadcrumbs={usersBreadcrumbs}>Hm Trip KM</PageTitle>

          <div className='card mb-10'>
            <h3 className='p-2'>Cek Operator {namaOpt}</h3>
            <p></p>
            <div className='d-flex p-2'>
              <div className='p-2 align-self-center '>Pilih Bulan</div>
              <div className='p-2 me-10'>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat='MM/yyyy'
                  showMonthYearPicker
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
                    Pilih NIK
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
            {selectedNik !== 1234 && (
              <>
                <div className='p-2 align-self-left'>
                  <b>
                    PERIODE {moment(dateStart).format('DD/MM/YY')} -{' '}
                    {moment(dateEnd).format('DD/MM/YY')}{' '}
                  </b>
                </div>
                <div className='card card-custom card-flush mb-5'>
                  <div className='card-header'>
                    <h3 className='card-title'>Peringkat</h3>
                    <div className='card-toolbar'>
                      <button type='button' className='btn btn-sm btn-light'>
                        Action
                      </button>
                    </div>
                  </div>
                  <div className='card-body py-5'>
                    {' '}
                    Peringat ke
                    <h1>
                      <b>{peringkat ? peringkat : <Kosong />}</b>
                    </h1>
                    <br></br>
                    Total jumlah orang :{' '}
                    {totalPeringkat && totalPeringkat.length >= 0 ? (
                      totalPeringkat[0].totalOrang + ' Orang'
                    ) : (
                      <Kosong />
                    )}
                  </div>
                </div>
                <div className='card card-custom card-flush mb-5'>
                  <div className='card-header'>
                    <h3 className='card-title'>Total HM</h3>
                    <div className='card-toolbar'>
                      <button type='button' className='btn btn-sm btn-light'>
                        Action
                      </button>
                    </div>
                  </div>
                  {/* <div className='card-body py-5'> </div> */}
                  <div className='card-body py-5'>
                    <div className='table-responsive'>
                      {hmTrip && hmTrip.length >= 2 ? (
                        <>
                          <table className='table table-light table-striped'>
                            <thead>
                              <tr className='fw-bold'>
                                <th>Lokasi</th>
                                <th>Total HM</th>
                                <th>Total Rit</th>
                                <th>Total KM</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hmTrip.map((item, index) => (
                                <tr
                                  key={index}
                                  className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'
                                >
                                  <td>{item.lokasi}</td>
                                  <td className={item.sumHm === 0 ? 'text-danger' : ''}>
                                    {roundToTwoDecimalPlaces(item.sumHm)}
                                  </td>
                                  <td className={item.sumRit === 0 ? 'text-danger' : ''}>
                                    {roundToTwoDecimalPlaces(item.sumRit)}
                                  </td>
                                  <td className={item.sumKm === 0 ? 'text-danger' : ''}>
                                    {roundToTwoDecimalPlaces(item.sumKm)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <table className='table table-light table-striped'>
                            <tbody>
                              <tr className='fw-bold fs-6 text-info border-bottom-2'>
                                <td>Total HM</td>
                                <td>{roundToTwoDecimalPlaces(hmTrip[0].sumHm + hmTrip[1].sumHm)}</td>
                              </tr>
                              <tr className='fw-bold fs-6 text-info border-bottom-2'>
                                <td>Total Ritasi</td>
                                <td>{roundToTwoDecimalPlaces(hmTrip[0].sumRit + hmTrip[1].sumRit)}</td>
                              </tr>
                              <tr className='fw-bold fs-6 text-info border-bottom-2'>
                                <td>Total KM</td>
                                <td>{roundToTwoDecimalPlaces(hmTrip[0].sumKm + hmTrip[1].sumKm)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <Kosong />
                      )}
                    </div>
                  </div>
                </div>
                <div className='card card-custom card-flush mb-5'>
                  <div className='card-header'>
                    <h3 className='card-title'>Periode HM TRIP KM</h3>
                    <div className='card-toolbar'>
                      <button type='button' className='btn btn-sm btn-light'>
                        Action
                      </button>
                    </div>
                  </div>
                  <div className='card-body align-items-center w-100 py-8'>
                    <div className='table-responsive'>
                      {tableOptSenyiur &&
                      tableOptSenyiur.length > 2 &&
                      tableOptSenyiur.every((item) => item[0].hmDriver === 0) ? (
                        <Kosong />
                      ) : (
                        <table className='table table-light table-striped'>
                          <thead>
                            <tr>
                              <th>Tanggal</th>
                              <th>Lokasi</th>
                              <th>HM</th>
                              <th>Trip</th>
                              <th>KM</th>
                            </tr>
                          </thead>

                          <tbody>
                            {tableOptSenyiur.map((item, index) => (
                              <tr
                                key={index}
                                className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'
                              >
                                <td>
                                  <div className='p-2'>
                                    {moment(item[0].datePayroll).format('DD/MM/YYYY')}
                                  </div>
                                </td>
                                <td>
                                  <div className='p-1'>Senyiur</div>
                                  <div className='p-1'>Muarapahu</div>
                                  <hr></hr>
                                  <div className='p-1'>Total</div>
                                </td>
                                <td>
                                  <div
                                    className={item[0].hmDriver === 0 ? 'text-danger p-1' : 'p-1'}
                                  >
                                    {' '}
                                    {roundToTwoDecimalPlaces(item[0].hmDriver)}
                                  </div>
                                  <div
                                    className={
                                      tableOptMuarapahu[index][0].hmDriver === 0
                                        ? 'text-danger p-1'
                                        : 'p-1'
                                    }
                                  >
                                    {roundToTwoDecimalPlaces(tableOptMuarapahu[index][0].hmDriver)}
                                  </div>
                                  <hr></hr>
                                  <div
                                    className={
                                      item[0].hmDriver + tableOptMuarapahu[index][0].hmDriver === 0
                                        ? 'text-danger p-1'
                                        : 'p-1'
                                    }
                                  >
                                    {roundToTwoDecimalPlaces(
                                      item[0].hmDriver + tableOptMuarapahu[index][0].hmDriver
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className={item[0].akumRit === 0 ? 'text-danger p-1' : 'p-1'}
                                  >
                                    {roundToTwoDecimalPlaces(item[0].akumRit)}
                                  </div>
                                  <div
                                    className={
                                      tableOptMuarapahu[index][0].akumRit === 0
                                        ? 'text-danger p-1'
                                        : 'p-1'
                                    }
                                  >
                                    {roundToTwoDecimalPlaces(tableOptMuarapahu[index][0].akumRit)}
                                  </div>
                                  <hr></hr>
                                  <div
                                    className={
                                      item[0].akumRit + tableOptMuarapahu[index][0].akumRit === 0
                                        ? 'text-danger p-1'
                                        : 'p-1'
                                    }
                                  >
                                    {roundToTwoDecimalPlaces(
                                      item[0].akumRit + tableOptMuarapahu[index][0].akumRit
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className={item[0].kmDriver === 0 ? 'text-danger p-1' : 'p-1'}
                                  >
                                    {roundToTwoDecimalPlaces(item[0].kmDriver)}
                                  </div>
                                  <div
                                    className={
                                      tableOptMuarapahu[index][0].kmDriver === 0
                                        ? 'text-danger p-1'
                                        : 'p-1'
                                    }
                                  >
                                    {roundToTwoDecimalPlaces(tableOptMuarapahu[index][0].kmDriver)}
                                  </div>
                                  <hr></hr>
                                  <div
                                    className={
                                      item[0].kmDriver + tableOptMuarapahu[index][0].kmDriver === 0
                                        ? 'text-danger p-1'
                                        : 'p-1'
                                    }
                                  >
                                    {roundToTwoDecimalPlaces(
                                      item[0].kmDriver + tableOptMuarapahu[index][0].kmDriver
                                    )}
                                  </div>
                                </td>

                                {/* Add more td elements for other properties as needed */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
