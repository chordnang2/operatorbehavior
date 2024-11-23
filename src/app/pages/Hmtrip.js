import {useEffect, useState} from 'react'
import {PageTitle} from '../../_metronic/layout/core'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import axios from 'axios'
import {KTSVG} from '../../_metronic/helpers'
import FormData from 'form-data'
import Swal from 'sweetalert2'
import {API_ENDPOINTS} from '../../config/api'
// import fs from 'fs'

const PAYMENT_SELECTION_START_DATE = 1;
const PAYMENT_SELECTION_END_DATE = 15;

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

  const [loadingRowkomplain, setLoadingRowkomplain] = useState(false)
  const [rowKomplain, setRowKomplain] = useState([])

  const [isKomplainButtonDisabled, setKomplainButtonDisabled] = useState(false)

  const [paymentDetails, setPaymentDetails] = useState(null)

  console.log(rowKomplain)
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
        .post(API_ENDPOINTS.peringkat, requestBody)
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
        .post(API_ENDPOINTS.hmtrip, requestBody)
        .then((response) => {
          console.log('response_hmtripPRODUKTIFITAS', response.data.data.dataProduktifitas)
          setHmTrip(response.data.data.dataProduktifitas)
          setDateStart(response.data.data.dateStart)
          setDateEnd(response.data.data.dateEnd)
        })
        .catch((error) => {
          setHmTrip(<errorServer />)
          console.error('Error hmTrip:', error)
        })
      await axios
        .post(API_ENDPOINTS.table, requestBody)
        .then((response) => {
          console.log('response_tableOPTSENYIURMUARA PAHU', response)
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
        .post(API_ENDPOINTS.komplain, form, {
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
              setKomplainButtonDisabled(true)
              setTimeout(() => {
                setKomplainButtonDisabled(false)
              }, 5 * 60 * 1000)

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

  const handleCekkomplain = async () => {
    setLoadingRowkomplain(true)
    await axios
      .get(API_ENDPOINTS.getKomplain(localStorage.getItem('user')))
      .then((response) => {
        console.log('LIST KOMPLAIN', response.data.data.formattedData)
        // console.log(response)
        setRowKomplain(response.data.data.formattedData)
        setLoadingRowkomplain(false)
      })
      .catch((error) => {
        console.log(error)
        setLoadingRowkomplain(false)
      })
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

  // useEffect(() => {
  //   // Show welcome popup when component mounts
  //   Swal.fire({
  //     title: 'Selamat Datang!',
  //     text: 'Ini adalah halaman produktifitas',
  //     icon: 'info',
  //     confirmButtonText: 'OK'
  //   })
  // }, []) // Empty dependency array means this runs once when component mounts

  const handlePaymentSelection = async (paymentMethod) => {
    try {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = moment(currentDate).format('YYYY-MM');
      const userNik = localStorage.getItem('user');

      if (currentDay < PAYMENT_SELECTION_START_DATE || currentDay > PAYMENT_SELECTION_END_DATE) {
        Swal.fire({
          title: 'Tidak Dapat Memilih',
          text: `Pemilihan metode pembayaran hanya dapat dilakukan pada tanggal ${PAYMENT_SELECTION_START_DATE}-${PAYMENT_SELECTION_END_DATE}`,
          icon: 'warning'
        });
        return;
      }

      const response = await axios.get(`${API_ENDPOINTS.uang.getAll}?nik=${userNik}&bulan=${currentMonth}`);
      const existingRecord = response.data.data[0];

      const body = {
        nik: userNik,
        bulan: currentMonth,
        uang: paymentMethod
      };

      if (existingRecord) {
        await axios.patch(`${API_ENDPOINTS.uang.update(existingRecord.id)}`, body);
      } else {
        await axios.post(API_ENDPOINTS.uang.create, body);
      }
      
      // Langsung update state paymentDetails dengan data baru
      setPaymentDetails({
        ...existingRecord,
        uang: paymentMethod,
        bulan: currentMonth
      });

      Swal.fire({
        title: 'Terima Kasih!',
        text: `Anda memilih pembayaran secara ${paymentMethod}`,
        icon: 'success'
      });
    } catch (error) {
      console.error('Error saving payment selection:', error);
      Swal.fire({
        title: 'Error',
        text: 'Gagal menyimpan pilihan pembayaran',
        icon: 'error'
      });
    }
  }

  useEffect(() => {
    const showPaymentPopup = async () => {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = moment(currentDate).format('YYYY-MM');
      const userNik = localStorage.getItem('user');

      // Using constants for date range check
      if (currentDay >= PAYMENT_SELECTION_START_DATE && currentDay <= PAYMENT_SELECTION_END_DATE) {
        try {
          // Check if record exists
          const response = await axios.get(`${API_ENDPOINTS.uang.getAll}?nik=${userNik}&bulan=${currentMonth}`);
          const existingRecord = response.data.data.length > 0;
          
          if (!existingRecord) {
            Swal.fire({
              title: 'Pilih Metode Pembayaran',
              text: 'Silahkan pilih uang bulanan ini',
              icon: 'question',
              input: 'radio',
              inputOptions: {
                'cash': 'Cash',
                'transfer': 'Transfer'
              },
              inputValidator: (value) => {
                if (!value) {
                  return 'Anda harus memilih salah satu!'
                }
              },
              confirmButtonText: 'Pilih',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then((result) => {
              if (result.isConfirmed) {
                handlePaymentSelection(result.value);
              }
            });
          } else {
            // Add a button to allow updates during the valid period
            Swal.fire({
              title: 'Metode Pembayaran',
              text: 'Anda sudah memilih metode pembayaran. Ingin mengubah pilihan?',
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: 'Ya, ubah',
              cancelButtonText: 'Tidak'
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: 'Pilih Metode Pembayaran',
                  text: 'Silahkan pilih uang bulanan ini',
                  icon: 'question',
                  input: 'radio',
                  inputOptions: {
                    'cash': 'Cash',
                    'transfer': 'Transfer'
                  },
                  inputValidator: (value) => {
                    if (!value) {
                      return 'Anda harus memilih salah satu!'
                    }
                  },
                  confirmButtonText: 'Pilih'
                }).then((result) => {
                  if (result.isConfirmed) {
                    handlePaymentSelection(result.value);
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }
    };

    showPaymentPopup();
  }, []); // Empty dependency array means this runs once when component mounts

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const currentMonth = moment(selectedDate).format('YYYY-MM')
        const userNik = localStorage.getItem('user')
        const response = await axios.get(`${API_ENDPOINTS.uang.getAll}?nik=${userNik}&bulan=${currentMonth}`)
        
        if (response.data.data.length > 0) {
          setPaymentDetails(response.data.data[0])
        } else {
          setPaymentDetails(null)
        }
      } catch (error) {
        console.error('Error fetching payment details:', error)
        setPaymentDetails(null)
      }
    }

    fetchPaymentDetails()
  }, [selectedDate])

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
              <div className='p-2 align-self-center'>
                <b>
                  PERIODE {moment(dateStart).format('DD/MM/YY')} -{' '}
                  {moment(dateEnd).format('DD/MM/YY')}{' '}
                </b>
              </div>
              <div className='d-flex'>
                <div className='p-2 '>
                  <button
                    type='button'
                    className={`btn btn-sm ${
                      isKomplainButtonDisabled ? 'btn-secondary' : 'btn-warning'
                    }`}
                    data-bs-toggle='modal'
                    data-bs-target='#kt_modal_1'
                    id='closeModalKomplain'
                    disabled={isKomplainButtonDisabled}
                  >
                    Komplain
                    {isKomplainButtonDisabled && (
                      <span className='ms-2 text-muted' style={{fontSize: '0.8rem'}}>
                        Tunggu 5 menit lagi untuk komplain
                      </span>
                    )}
                  </button>
                </div>
                <div className='p-2 '>
                  <button
                    type='button'
                    className='btn btn-sm btn-primary'
                    data-bs-toggle='modal'
                    data-bs-target='#kt_modal_2'
                    id='closeModalCekkomplain'
                    onClick={handleCekkomplain}
                  >
                    Cek Komplain
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
              <h3 className='card-title'>Uang Bulanan</h3>
              <div className='card-toolbar'>
                {paymentDetails && (() => {
                  const currentDate = new Date();
                  const currentDay = currentDate.getDate();
                  return currentDay >= PAYMENT_SELECTION_START_DATE && 
                         currentDay <= PAYMENT_SELECTION_END_DATE ? (
                    <button 
                      type='button' 
                      className='btn btn-sm btn-primary'
                      onClick={() => {
                        Swal.fire({
                          title: 'Ubah Metode Pembayaran',
                          text: 'Silahkan pilih uang bulanan ini',
                          icon: 'question',
                          input: 'radio',
                          inputOptions: {
                            'cash': 'Cash',
                            'transfer': 'Transfer'
                          },
                          inputValidator: (value) => {
                            if (!value) {
                              return 'Anda harus memilih salah satu!'
                            }
                          },
                          confirmButtonText: 'Pilih'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handlePaymentSelection(result.value);
                          }
                        });
                      }}
                    >
                      Ubah Metode Pembayaran
                    </button>
                  ) : (
                    <button 
                      type='button' 
                      className='btn btn-sm btn-secondary' 
                      disabled
                      title='Perubahan hanya dapat dilakukan pada tanggal 1-23'
                    >
                      Ubah Metode Pembayaran
                    </button>
                  )
                })()}
              </div>
            </div>
            <div className='card-body py-5'>
              {paymentDetails ? (
                <div className='d-flex flex-column'>
                  <div className='d-flex justify-content-between mb-2'>
                    <span className='fw-bold'>Status Pembayaran:</span>
                    <span className={`badge badge-${paymentDetails.uang === 'cash' ? 'primary' : 'success'}`}>
                      {paymentDetails.uang === 'cash' ? 'Cash' : 'Transfer'}
                    </span>
                  </div>
                  <div className='d-flex justify-content-between mb-2'>
                    <span className='fw-bold'>Periode:</span>
                    <span>{moment(paymentDetails.bulan).format('MMMM YYYY')}</span>
                  </div>
                  <div className='alert alert-info d-flex align-items-center p-5 mb-2'>
                    <span className='svg-icon svg-icon-2hx svg-icon-info me-3'>
                      <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-2' />
                    </span>
                    <div className='d-flex flex-column'>
                      <span className='fw-bold'>Informasi Pembayaran</span>
                      <span>
                        Pembayaran sebesar Rp 1.000.000 akan dilakukan melalui {paymentDetails.uang === 'cash' ? 'Cash' : 'Transfer'} 
                  
                      </span>
                    </div>
                  </div>
                  <div className='alert alert-warning d-flex align-items-center p-5'>
                    <span className='svg-icon svg-icon-2hx svg-icon-warning me-3'>
                      <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-2' />
                    </span>
                    <div className='d-flex flex-column'>
                      <span>
                        Pemilihan metode pembayaran hanya dapat dilakukan pada tanggal {PAYMENT_SELECTION_START_DATE}-{PAYMENT_SELECTION_END_DATE} setiap bulannya
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='d-flex flex-column'>
                  <div className='text-center text-gray-600 mb-4'>
                    Belum ada pemilihan metode pembayaran untuk periode ini
                  </div>
                  <div className='alert alert-warning d-flex align-items-center p-5'>
                    <span className='svg-icon svg-icon-2hx svg-icon-warning me-3'>
                      <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-2' />
                    </span>
                    <div className='d-flex flex-column'>
                      <span>
                        Pemilihan metode pembayaran hanya dapat dilakukan pada tanggal {PAYMENT_SELECTION_START_DATE}-{PAYMENT_SELECTION_END_DATE} setiap bulannya
                      </span>
                    </div>
                  </div>
                </div>
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
                {hmTrip && hmTrip.length >= 1 ? (
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
                          <td>
                            {roundToTwoDecimalPlaces(
                              hmTrip[0].sumHm + (hmTrip[1] ? hmTrip[1].sumHm : 0)
                            )}
                          </td>
                        </tr>
                        <tr className='fw-bold fs-6 text-info border-bottom-2'>
                          <td>Total Ritasi</td>
                          <td>
                            {roundToTwoDecimalPlaces(
                              hmTrip[0].sumRit + (hmTrip[1] ? hmTrip[1].sumRit : 0)
                            )}
                          </td>
                        </tr>
                        <tr className='fw-bold fs-6 text-info border-bottom-2'>
                          <td>Total KM</td>
                          <td>
                            {roundToTwoDecimalPlaces(
                              hmTrip[0].sumKm + (hmTrip[1] ? hmTrip[1].sumKm : 0)
                            )}
                          </td>
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
                tableOptSenyiur.every((item) => item[0].hmDriver === 0) &&
                tableOptMuarapahu.length > 2 &&
                tableOptMuarapahu.every((item) => item[0].hmDriver === 0) ? (
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
          <div className='modal fade' tabIndex={-1} id='kt_modal_2'>
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>Cek List Komplain</h5>
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
                  {loadingRowkomplain ? (
                    <div className='spinner-border' role='status'>
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div class='table-responsive'>
                        <table className='table text-center'>
                          <thead>
                            <tr>
                              <th scope='col'>NO</th>
                              <th scope='col'>Tanggal</th>
                              <th scope='col'>Unit</th>
                              <th scope='col'>Shift</th>
                              <th scope='col'>Komplain</th>
                              <th scope='col'>Balasan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowKomplain.length === 0 ? (
                              <tr>
                                <td colSpan='5'>No data available</td>
                              </tr>
                            ) : (
                              rowKomplain.map((item, index) => (
                                <tr
                                  key={index}
                                  style={{
                                    backgroundColor: item.balasan === null ? '#ffcccc' : '#2ecc71',
                                    color: item.balasan === null ? 'black' : '', // Set text color to black
                                    marginBottom: '10px', // Adjust the value as needed
                                  }}
                                >
                                  <td>{index + 1}</td>
                                  <td>{item.NewFormatTanggalAnomali}</td>
                                  <td>{item.unit}</td>
                                  <td>{item.shift}</td>
                                  <td>{item.komplain}</td>
                                  <td>{item.balasan === null ? 'Belum Dibalas' : item.balasan}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
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
