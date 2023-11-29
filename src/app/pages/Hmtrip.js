import {useEffect, useState} from 'react'
import {PageTitle} from '../../_metronic/layout/core'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import axios from 'axios'
import {KTSVG} from '../../_metronic/helpers'
import FormData from 'form-data'
import Swal from 'sweetalert2'
// import fs from 'fs'

function Hmtrip() {
  const usersBreadcrumbs = [
    {
      title: 'HM Trip',
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
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalPeringkat, setTotalPeringkat] = useState()
  const [dateStart, setDateStart] = useState()
  const [dateEnd, setDateEnd] = useState()
  const [peringkat, setPeringkat] = useState()
  const [hmTrip, setHmTrip] = useState()
  const [tableOptSenyiur, setTableOptSenyiur] = useState([])
  const [tableOptMuarapahu, setTableOptMuarapahu] = useState([])

  const [komplainDate, setKomplainDate] = useState('')
  const [komplainText, setKomplainText] = useState('')
  const [komplainUnit, setKomplainUnit] = useState('')
  const [komplainShift, setKomplainShift] = useState('')
  const [komplainFoto, setKomplainFoto] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)

  // const form = new FormData();
  // const [tableOptLokasi, setTableOptLokasi] = useState()
  // console.log(tableOptSenyiur)
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }
  function Kosong() {
    return <span className='badge badge-danger'>Kosong</span>
  }

  function errorServer() {
    return <span className='badge badge-danger'>Error Server!</span>
  }

  useEffect(() => {
    const corePage = async () => {
      const requestBody = {
        bulan: `${moment(selectedDate).format('YYYY-MM-DD')}`,
        nik: `${localStorage.getItem('user')}`,
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
          // console.log('response_table', response)
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
    corePage(selectedDate)
  }, [selectedDate])

  const [uploadedImage, setUploadedImage] = useState(null)
  // console.log(peringkat, 'peringkat')

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setKomplainFoto(file)
    console.log(file)
    // Check if the file is an image
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      // Display an error message or handle the case where a non-image file is selected
      console.error('Invalid file format. Please select an image file.')
    }
    console.log(komplainFoto)
  }

  const handleKomplainSubmit = async () => {
    console.log('komplainDate:', komplainDate)
    console.log('komplainText:', komplainText)
    console.log('komplainUnit:', komplainUnit)
    console.log('komplainShift:', komplainShift)

    if (!komplainDate || !komplainText || !komplainUnit || komplainShift === 'Pilih shift') {
      // Display an error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Pastikan kolom yang ditandai * diisi !.',
      })
      // document.getElementById('closeModalKomplain').click()
    } else {
      // Create a FormData object
      var form = new FormData()
      // Append the text data to the FormData object
      form.append('timestamp_komplain', moment().format('YYYY-MM-DD HH:mm:ss'))
      form.append('nik_komplain', localStorage.getItem('user'))
      form.append('nama_komplain', localStorage.getItem('userNama'))
      form.append('komplain', komplainText)
      form.append('unit', komplainUnit)
      form.append('shift', komplainShift)
      form.append('tanggalAnomali', komplainDate.toString())

      // Append the image file to the FormData object
      form.append('foto', komplainFoto)

      console.log(form)
      // Make the POST request with axios
      // Make the POST request with axios
      setLoadingModal(true)
      await axios
        .post('https://mandiriservices.biz.id/optbehav/komplain/opt', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('Komplain submitted successfully', response)
          setLoadingModal(false)
          setKomplainDate([])
          setKomplainText([])
          setKomplainUnit([])
          setKomplainShift([])
          setKomplainFoto([])
          setUploadedImage(null)

          // Display a success message using SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Komplain submitted successfully.',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              document.getElementById('closeModalKomplain').click()
            }
          })

          // Hide the modal after submitting
        })
        .catch((error) => {
          console.error('Error submitting komplain:', error)

          // Display an error message using SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while submitting the komplain. Please try again later.',
          })
          setLoadingModal(false)
          // document.getElementById('closeModalKomplain').click()
        })
    }

    // Hide the modal after submitting
  }
  const handleDeleteImage = async () => {
    setUploadedImage(null)
    const fileInput = document.getElementById('formFile')
    if (fileInput) {
      fileInput.value = null // Clear the file input value
    }
  }
  function roundToTwoDecimalPlaces(number) {
    return Number(number.toFixed(2))
  }
  return (
    <>
      {loading ? (
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      ) : (
        <>
          <PageTitle breadcrumbs={usersBreadcrumbs}>PRODUKTIFITAS OPERATOR</PageTitle>
          <div className='card mb-5'>
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold text-dark'>PRODUKTIFITAS OPERATOR </span>
                <br></br>
              </h3>
            </div>
            <div className='card-header border-0 pt-2'>
              <div className='d-flex'>
                <div className='p-2 align-self-center'>Pilih Bulan</div>
                <div className='p-2'>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat='MM/yyyy'
                    showMonthYearPicker
                    className='form-control'
                  />
                </div>
              </div>
              <div className='d-flex'>
                <div className='p-2 align-self-center'>
                  <b>
                    PERIODE {moment(dateStart).format('DD/MM/YY')} -{' '}
                    {moment(dateEnd).format('DD/MM/YY')}{' '}
                  </b>
                </div>
                <div className='p-2 '>
                  <button
                    type='button'
                    className='btn btn-sm btn-warning'
                    data-bs-toggle='modal'
                    data-bs-target='#kt_modal_1'
                    id='closeModalKomplain'
                  >
                    Komplain
                  </button>
                </div>
              </div>
            </div>
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
                            <div className={item[0].hmDriver === 0 ? 'text-danger p-1' : 'p-1'}>
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
                            <div className={item[0].akumRit === 0 ? 'text-danger p-1' : 'p-1'}>
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
                            <div className={item[0].kmDriver === 0 ? 'text-danger p-1' : 'p-1'}>
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
          <div className='modal fade' tabIndex={-1} id='kt_modal_1'>
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>Form Komplain Operator</h5>
                  <div
                    className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  >
                    <KTSVG
                      path='/media/icons/duotune/arrows/arr061.svg'
                      className='svg-icon svg-icon-2x'
                    />
                  </div>
                </div>
                <div className='modal-body'>
                  {loadingModal ? (
                    <div className='text-center'>
                      <div className='spinner-border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='mb-3'>
                        <label className='form-label required'>
                          Komplain untuk Rit Tanggal berapa?
                        </label>
                        <input
                          type='date'
                          className='form-control'
                          value={komplainDate}
                          onChange={(e) => setKomplainDate(e.target.value)}
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label required'>Komplain</label>
                        <textarea
                          className='form-control'
                          rows={3}
                          value={komplainText}
                          onChange={(e) => setKomplainText(e.target.value)}
                        ></textarea>
                      </div>
                      <div className='mb-3'>
                        <label className='form-label required'>Unit</label>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Masukkan no unit, contoh = 909'
                          value={komplainUnit}
                          onChange={(e) => setKomplainUnit(e.target.value)}
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label required'>Shift</label>
                        <select
                          className='form-select'
                          aria-label='Default select example'
                          value={komplainShift}
                          onChange={(e) => setKomplainShift(e.target.value)}
                        >
                          <option defaultValue='Pilih shift'>Pilih shift</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                        </select>
                      </div>
                      <div className='mb-3'>
                        <div class='d-flex'>
                          <div class='p-2 flex-grow-1'>
                            {' '}
                            <label className='form-label'>Evident Timesheet</label>
                          </div>
                          {/* <div class=''> */}
                          <button
                            className='p-2 align-self-center btn btn-danger btn-sm'
                            onClick={handleDeleteImage}
                          >
                            Delete
                          </button>
                          {/* </div> */}
                        </div>

                        <div class='p-2 w-100'>
                          <input
                            className='form-control'
                            type='file'
                            id='formFile'
                            accept='image/*' // Restrict file types to images
                            onChange={handleImageChange}
                          />
                        </div>
                        {uploadedImage && (
                          <div className='mt-2'>
                            <p>Uploaded Image:</p>
                            <img src={uploadedImage} alt='Uploaded' style={{maxWidth: '100%'}} />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-primary' onClick={handleKomplainSubmit}>
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Hmtrip
