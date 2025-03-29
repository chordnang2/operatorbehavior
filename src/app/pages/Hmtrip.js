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

// Custom CSS styles for enhanced UI
const styles = {
  cardGradient: {
    background: 'linear-gradient(135deg, #f6f8ff 0%, #f1f5ff 100%)',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
    border: 'none',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
  },
  dataHighlight: {
    color: '#009ef7',
    fontWeight: 'bold',
    fontSize: '2.2rem',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #009ef7, #00c3f7)',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    display: 'inline-block',
  },
  motivationalHeader: {
    background: 'linear-gradient(90deg, #1E1E2D, #181C32), url(/media/misc/coal-hauling-bg.jpg)',
    backgroundBlendMode: 'overlay',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    color: 'white',
    padding: '15px 20px',
    marginBottom: '20px',
  },
  haulingIconBg: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    padding: '12px',
  },
  mobileTable: {
    width: '100%',
    overflowX: 'visible',
  },
  mobileCard: {
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #e4e6ef',
    backgroundColor: '#fff',
  },
  mobileCardHeader: {
    padding: '10px 15px',
    borderBottom: '1px solid #e4e6ef',
    backgroundColor: '#f5f8fa',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileCardBody: {
    padding: '15px',
  },
  mobileCardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dashed #e4e6ef',
    padding: '8px 0',
  },
  mobileCardLabel: {
    fontWeight: '500',
    color: '#5e6278',
  },
  mobileCardValue: {
    fontWeight: '600',
    color: '#181c32',
    textAlign: 'right',
  }
}

const PAYMENT_SELECTION_START_DATE = 1;
const PAYMENT_SELECTION_END_DATE = 15;

const safetyMessages = [
  {
    title: "Patuhi Aturan Kecepatan dan Rambu Lalu Lintas di Jalur Hauling",
    points: [
      "Selalu berkendara sesuai batas kecepatan yang ditentukan di area tambang.",
      "Perhatikan dan patuhi semua rambu-rambu di jalur hauling batubara.",
      "Jaga jarak aman minimal 50 meter dengan unit hauling lain di depan."
    ]
  },
  {
    title: "Periksa Kendaraan Hauling Sebelum Beroperasi (Pre-Start Check)",
    points: [
      "Pastikan rem, lampu, klakson, dan sistem hidrolik dump truck berfungsi dengan baik.",
      "Periksa tekanan ban dan ketebalan tapak untuk mencegah risiko tergelincir saat mengangkut beban.",
      "Laporkan jika ada kerusakan atau potensi bahaya pada unit hauling sebelum mengoperasikan."
    ]
  },
  {
    title: "Hindari Distraksi Saat Mengemudi Unit Hauling",
    points: [
      "Jangan menggunakan ponsel atau perangkat lain saat mengoperasikan dump truck.",
      "Fokus penuh pada kondisi jalan tambang dan lingkungan sekitar.",
      "Gunakan komunikasi radio hanya untuk keperluan operasional hauling yang mendesak."
    ]
  },
  {
    title: "Waspada terhadap Kondisi Jalan Hauling",
    points: [
      "Perhatikan jalan berlubang, area licin setelah hujan, dan tanjakan/turunan curam di jalur hauling.",
      "Jangan berkendara terlalu dekat dengan tepi jalan tambang yang rawan longsor.",
      "Sesuaikan kecepatan dengan kondisi cuaca dan beban batubara yang diangkut."
    ]
  },
  {
    title: "Gunakan Alat Pelindung Diri (APD) Operator Hauling yang Lengkap",
    points: [
      "Wajib menggunakan helm safety, sepatu safety, rompi reflektif, dan kacamata pelindung.",
      "Pastikan APD dalam kondisi baik dan sesuai standar keselamatan tambang."
    ]
  },
  {
    title: "Hindari Mengemudi Unit Hauling dalam Keadaan Tidak Fit",
    points: [
      "Jangan mengoperasikan unit hauling jika kelelahan atau dalam pengaruh obat-obatan yang menyebabkan kantuk.",
      "Laporkan ke supervisor tambang jika merasa tidak fit untuk mengoperasikan dump truck."
    ]
  },
  {
    title: "Berkomunikasi dan Berkoordinasi dengan Tim Hauling",
    points: [
      "Gunakan radio komunikasi dengan baik untuk koordinasi dengan excavator, dispatcher, dan operator hauling lainnya.",
      "Beri tahu lokasi dan kondisi kendaraan jika terjadi kendala di jalur hauling."
    ]
  },
  {
    title: "Patuhi Prosedur Loading dan Dumping yang Aman",
    points: [
      "Pastikan posisi unit hauling sudah tepat saat proses loading batubara dari excavator.",
      "Jaga kestabilan unit saat dumping batubara dan perhatikan area sekitar titik dumping."
    ]
  },
  {
    title: "Perhatikan Distribusi Beban Batubara",
    points: [
      "Pastikan beban batubara terdistribusi merata pada bak dump truck.",
      "Jangan melebihi kapasitas maksimum angkut unit untuk mencegah kecelakaan dan kerusakan jalan hauling."
    ]
  },
  {
    title: "Waspada Kondisi Ekstrem pada Jalur Hauling",
    points: [
      "Kurangi kecepatan saat melintasi area berdebu tinggi dan gunakan lampu hazard.",
      "Perhatikan stabilitas tanah terutama setelah hujan deras di area tambang."
    ]
  }
]

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

  const showPaymentPopup = async () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = moment(currentDate).format('YYYY-MM');
    const userNik = localStorage.getItem('user');

    // Show safety message first
    const randomSafetyMessage = safetyMessages[Math.floor(Math.random() * safetyMessages.length)];
    
    await Swal.fire({
      title: '<span class="safety-title">🚨 Pesan Keselamatan Kerja 🚨</span>',
      html: `
        <div class="safety-message">
          <div class="safety-header mb-3">
            <div class="safety-icon-wrapper mb-2">
              <i class="bi bi-shield-check"></i>
            </div>
            <h5 class="text-danger fw-bolder mb-2">${randomSafetyMessage.title}</h5>
            <div class="safety-divider"></div>
          </div>
          <div class="safety-points">
            ${randomSafetyMessage.points.map(point => `
              <div class="safety-point">
                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                ${formatSafetyPoint(point)}
              </div>
            `).join('')}
          </div>
          <div class="safety-footer mt-3">
            <div class="alert alert-warning d-flex align-items-center py-2" role="alert">
              <i class="bi bi-lightbulb-fill text-warning me-2"></i>
              <small><strong>Ingat:</strong> Keselamatan Anda adalah prioritas utama kami!</small>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: '<i class="bi bi-check-circle me-2"></i>Saya Mengerti dan Akan Mematuhi',
      confirmButtonColor: '#009ef7',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      width: '600px',
      customClass: {
        container: 'safety-modal',
        popup: 'safety-popup',
        content: 'safety-content',
        confirmButton: 'btn btn-primary'
      },
      allowOutsideClick: false,
      backdrop: `
        rgba(0,0,0,0.4)
        url("/media/misc/safety-pattern.png")
        left top
        repeat
      `
    });

    // Add custom styles to document head
    const style = document.createElement('style');
    style.textContent = `
      .safety-title {
        color: #009ef7;
        font-size: 1.25rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-rendering: optimizeLegibility;
      }
      
      .safety-icon-wrapper {
        width: 60px;
        height: 60px;
        background: linear-gradient(45deg, #009ef7, #0095e8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .safety-icon-wrapper i {
        font-size: 30px;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
      }
      
      .safety-divider {
        height: 2px;
        background: linear-gradient(90deg, transparent, #009ef7, transparent);
        margin: 10px 0;
      }
      
      .safety-point {
        background-color: #f1faff;
        border-left: 4px solid #009ef7;
        margin-bottom: 8px;
        padding: 8px 12px;
        border-radius: 0 8px 8px 0;
        text-align: left;
        transition: transform 0.2s;
        font-size: 0.95rem;
        line-height: 1.5;
        color: #1e1e1e;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .safety-point:hover {
        transform: translateX(5px);
        background-color: #e1f0ff;
      }
      
      .safety-point strong {
        font-weight: 600;
        color: #000;
      }

      .safety-point strong.text-danger {
        color: #dc3545 !important;
      }

      .safety-point strong.text-success {
        color: #198754 !important;
      }
      
      .safety-footer {
        border-top: 1px dashed #e4e6ef;
        padding-top: 10px;
      }

      .safety-footer .alert {
        margin-bottom: 0;
        font-size: 0.9rem;
        font-weight: 400;
      }
      
      .animate__animated {
        animation-duration: 0.5s;
      }

      .swal2-popup {
        padding: 1rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }

      .swal2-title {
        padding: 0.5rem 0;
      }

      .swal2-html-container {
        margin: 0.5rem 0;
        text-align: left !important;
      }

      .swal2-actions {
        margin: 1rem 0 0;
      }

      .safety-message {
        max-height: calc(90vh - 200px);
      }

      .btn-primary {
        font-weight: 500;
      }

      .bi {
        display: inline-block;
        vertical-align: -0.125em;
      }
    `;
    document.head.appendChild(style);

    // Continue with payment selection logic
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

  useEffect(() => {
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

  // Helper function to format safety points with emphasis
  const formatSafetyPoint = (point) => {
    // Add bold to important words
    const emphasizedText = point
      .replace(/(wajib|penting|harus|jangan|pastikan|perhatikan|selalu|hindari)/gi, '<strong>$1</strong>')
      .replace(/(bahaya|warning|peringatan|emergency|darurat)/gi, '<strong class="text-danger">$1</strong>')
      .replace(/(selamat|aman|safety)/gi, '<strong class="text-success">$1</strong>');
    
    return emphasizedText;
  };

  // Add this function for mobile-responsive table rendering
  const MobileHmTripTable = ({tableData, muaraData}) => {
    if (!tableData || !muaraData || tableData.length === 0 || muaraData.length === 0) {
      return (
        <div className='text-center py-6'>
          <div className='mb-3'>
            <KTSVG path='/media/icons/duotune/files/fil024.svg' className='svg-icon-5x svg-icon-muted' />
          </div>
          <Kosong />
        </div>
      );
    }

    return (
      <div className="d-block d-lg-none">
        {tableData.map((item, index) => (
          <div style={styles.mobileCard} key={index}>
            <div style={styles.mobileCardHeader}>
              <div className="d-flex align-items-center">
                <div className='badge badge-light-primary fw-bolder fs-7 py-2 px-3 d-flex flex-column'>
                  <span className='fs-6 mb-1'>{moment(item[0].datePayroll).format('DD')}</span>
                  <span className='opacity-75'>{moment(item[0].datePayroll).format('MMM YYYY')}</span>
                </div>
              </div>
            </div>
            <div style={styles.mobileCardBody}>
              {/* Senyiur Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <div className='symbol symbol-30px me-3 bg-light-success rounded-circle'>
                    <span className='symbol-label text-success fw-bold'>S</span>
                  </div>
                  <span className="fw-bold fs-5">Senyiur</span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>HM</span>
                  <span style={styles.mobileCardValue}>
                    {item[0].hmDriver === 0 ? (
                      <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                    ) : (
                      <span className='badge badge-light-success fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(item[0].hmDriver)}</span>
                    )}
                  </span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>Trip</span>
                  <span style={styles.mobileCardValue}>
                    {item[0].akumRit === 0 ? (
                      <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                    ) : (
                      <span className='badge badge-light-success fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(item[0].akumRit)}</span>
                    )}
                  </span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>KM</span>
                  <span style={styles.mobileCardValue}>
                    {item[0].kmDriver === 0 ? (
                      <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                    ) : (
                      <span className='badge badge-light-success fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(item[0].kmDriver)}</span>
                    )}
                  </span>
                </div>
              </div>
              
              {/* Muarapahu Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <div className='symbol symbol-30px me-3 bg-light-primary rounded-circle'>
                    <span className='symbol-label text-primary fw-bold'>M</span>
                  </div>
                  <span className="fw-bold fs-5">Muarapahu</span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>HM</span>
                  <span style={styles.mobileCardValue}>
                    {muaraData[index][0].hmDriver === 0 ? (
                      <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                    ) : (
                      <span className='badge badge-light-primary fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(muaraData[index][0].hmDriver)}</span>
                    )}
                  </span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>Trip</span>
                  <span style={styles.mobileCardValue}>
                    {muaraData[index][0].akumRit === 0 ? (
                      <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                    ) : (
                      <span className='badge badge-light-primary fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(muaraData[index][0].akumRit)}</span>
                    )}
                  </span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>KM</span>
                  <span style={styles.mobileCardValue}>
                    {muaraData[index][0].kmDriver === 0 ? (
                      <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                    ) : (
                      <span className='badge badge-light-primary fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(muaraData[index][0].kmDriver)}</span>
                    )}
                  </span>
                </div>
              </div>
              
              {/* Total Section */}
              <div className="pt-3 border-top border-gray-300">
                <div className="d-flex align-items-center mb-2">
                  <div className='symbol symbol-30px me-3'>
                    <span className='symbol-label bg-dark text-white fw-bold'>T</span>
                  </div>
                  <span className="fw-bolder fs-5">Total</span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>HM</span>
                  <span style={styles.mobileCardValue}>
                    {item[0].hmDriver + muaraData[index][0].hmDriver === 0 ? (
                      <span className='badge badge-danger fw-bolder fs-6 px-4 py-2'>0.00</span>
                    ) : (
                      <span className='badge badge-primary fw-bolder fs-6 px-4 py-2'>
                        {roundToTwoDecimalPlaces(item[0].hmDriver + muaraData[index][0].hmDriver)}
                      </span>
                    )}
                  </span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>Trip</span>
                  <span style={styles.mobileCardValue}>
                    {item[0].akumRit + muaraData[index][0].akumRit === 0 ? (
                      <span className='badge badge-danger fw-bolder fs-6 px-4 py-2'>0.00</span>
                    ) : (
                      <span className='badge badge-primary fw-bolder fs-6 px-4 py-2'>
                        {roundToTwoDecimalPlaces(item[0].akumRit + muaraData[index][0].akumRit)}
                      </span>
                    )}
                  </span>
                </div>
                
                <div style={styles.mobileCardRow}>
                  <span style={styles.mobileCardLabel}>KM</span>
                  <span style={styles.mobileCardValue}>
                    {item[0].kmDriver + muaraData[index][0].kmDriver === 0 ? (
                      <span className='badge badge-danger fw-bolder fs-6 px-4 py-2'>0.00</span>
                    ) : (
                      <span className='badge badge-primary fw-bolder fs-6 px-4 py-2'>
                        {roundToTwoDecimalPlaces(item[0].kmDriver + muaraData[index][0].kmDriver)}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Also add a mobile version for the HM Total table
  const MobileTotalHmTable = ({hmTripData}) => {
    if (!hmTripData || hmTripData.length < 1) {
      return (
        <div className='text-center py-6'>
          <div className='mb-3'>
            <KTSVG path='/media/icons/duotune/files/fil024.svg' className='svg-icon-5x svg-icon-muted' />
          </div>
          <Kosong />
        </div>
      );
    }

    return (
      <div className="d-block d-lg-none">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-gray-700 fw-bold fs-6">Total HM</span>
            <span className="fs-2 fw-bolder text-primary">
              {roundToTwoDecimalPlaces(
                hmTripData[0].sumHm + (hmTripData[1] ? hmTripData[1].sumHm : 0)
              )}
            </span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-gray-700 fw-bold fs-6">Total Ritasi</span>
            <span className="fs-2 fw-bolder text-success">
              {roundToTwoDecimalPlaces(
                hmTripData[0].sumRit + (hmTripData[1] ? hmTripData[1].sumRit : 0)
              )}
            </span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-gray-700 fw-bold fs-6">Total KM</span>
            <span className="fs-2 fw-bolder text-warning">
              {roundToTwoDecimalPlaces(
                hmTripData[0].sumKm + (hmTripData[1] ? hmTripData[1].sumKm : 0)
              )}
            </span>
          </div>
        </div>
        
        {hmTripData.map((item, index) => (
          <div style={styles.mobileCard} key={index}>
            <div style={styles.mobileCardHeader}>
              <div className="d-flex align-items-center">
                <div className={`symbol symbol-30px me-3 bg-light-${index === 0 ? 'success' : 'primary'} rounded-circle`}>
                  <span className={`symbol-label text-${index === 0 ? 'success' : 'primary'} fw-bold`}>
                    {item.lokasi.charAt(0)}
                  </span>
                </div>
                <span className="fw-bold fs-5">{item.lokasi}</span>
              </div>
            </div>
            <div style={styles.mobileCardBody}>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileCardLabel}>Total HM</span>
                <span style={styles.mobileCardValue} className={item.sumHm === 0 ? 'text-danger fw-bolder' : 'text-dark fw-bolder'}>
                  {roundToTwoDecimalPlaces(item.sumHm)}
                </span>
              </div>
              
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileCardLabel}>Total Rit</span>
                <span style={styles.mobileCardValue} className={item.sumRit === 0 ? 'text-danger fw-bolder' : 'text-dark fw-bolder'}>
                  {roundToTwoDecimalPlaces(item.sumRit)}
                </span>
              </div>
              
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileCardLabel}>Total KM</span>
                <span style={styles.mobileCardValue} className={item.sumKm === 0 ? 'text-danger fw-bolder' : 'text-dark fw-bolder'}>
                  {roundToTwoDecimalPlaces(item.sumKm)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center min-vh-50'>
          <div className='spinner-border text-primary' style={{width: '3rem', height: '3rem'}} role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <PageTitle breadcrumbs={usersBreadcrumbs}>PRODUKTIFITAS OPERATOR HAULING</PageTitle>
          
          {/* Motivational Header Banner */}
          <div style={styles.motivationalHeader} className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex flex-column">
              <h2 className="fw-bolder mb-1 text-white">Selamat Datang, {localStorage.getItem('userNama')}</h2>
              <p className="text-white-50 mb-0">Semangat untuk performa hauling terbaik hari ini! 💪</p>
            </div>
            <div style={styles.haulingIconBg}>
              <KTSVG path='/media/icons/duotune/maps/map001.svg' className='svg-icon-3x svg-icon-white' />
            </div>
          </div>
          
          <div className='row g-3 g-xl-4'>
            <div className='col-xl-6'>
              <div className='card card-custom' style={styles.cardGradient}>
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-2 mb-1'>Peringkat</span>
                    <span className='text-muted fw-bold fs-7 mb-5'>Posisi Anda diantara semua operator</span>
                  </h3>
                  <div className='card-toolbar'>
                    <div className='btn btn-sm btn-icon btn-light-primary btn-active-primary'>
                      <KTSVG path='/media/icons/duotune/general/gen057.svg' className='svg-icon-2' />
                    </div>
                  </div>
                </div>
                <div className='card-body d-flex flex-column justify-content-center pt-0'>
                  <div className='text-center mb-5'>
                    <div className='position-relative d-inline-block'>
                      <div className='position-absolute' style={{
                        top: '-20px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #009ef7, #7239ea)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}>
                        <i className='bi bi-trophy-fill'></i>
                      </div>
                      <div className='position-relative border-8 border-primary border-opacity-50 rounded-circle' style={{
                        width: '150px', 
                        height: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        boxShadow: '0 0 30px rgba(0,158,247,0.2)'
                      }}>
                        <div style={{fontSize: '4rem', fontWeight: 'bold', color: '#009ef7', marginTop: '-10px'}}>
                          {peringkat ? peringkat : <Kosong />}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className='d-flex flex-column align-items-center'>
                    <div className='fs-5 fw-bold mb-2'>Total Operator: <span className='text-primary'>
                      {totalPeringkat && totalPeringkat.length >= 0 ? (
                        totalPeringkat[0].totalOrang + ' Orang'
                      ) : (
                        <Kosong />
                      )}
                    </span></div>
                    
                    {peringkat && peringkat !== <Kosong /> && (
                      <div className='w-100 bg-light rounded mt-3 mb-1' style={{height: '8px'}}>
                        <div 
                          className='bg-primary rounded' 
                          style={{
                            width: `${totalPeringkat && totalPeringkat.length >= 0 ? 
                              (100 - ((peringkat-1)/totalPeringkat[0].totalOrang)*100) : 0}%`, 
                            height: '100%'
                          }}
                        ></div>
                      </div>
                    )}
                    
                    <div className='text-center mt-6'>
                      {peringkat && peringkat <= 3 ? (
                        <div className='alert alert-success d-flex align-items-center p-5'>
                          <KTSVG path='/media/icons/duotune/general/gen048.svg' className='svg-icon-2hx svg-icon-success me-3' />
                          <div className='d-flex flex-column'>
                            <span className='fw-bold fs-5'>Luar Biasa!</span>
                            <span>Anda berada di posisi terbaik. Pertahankan kinerja Anda!</span>
                          </div>
                        </div>
                      ) : peringkat && peringkat <= 10 ? (
                        <div className='alert alert-primary d-flex align-items-center p-5'>
                          <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-2hx svg-icon-primary me-3' />
                          <div className='d-flex flex-column'>
                            <span className='fw-bold fs-5'>Kinerja Baik!</span>
                            <span>Anda hampir mencapai posisi terbaik. Tingkatkan sedikit lagi!</span>
                          </div>
                        </div>
                      ) : (
                        <div className='alert alert-warning d-flex align-items-center p-5'>
                          <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-2hx svg-icon-warning me-3' />
                          <div className='d-flex flex-column'>
                            <span className='fw-bold fs-5'>Ada Ruang Untuk Berkembang</span>
                            <span>Terus berusaha untuk meningkatkan kinerja Anda!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xl-6'>
              <div className='card mb-3' style={styles.cardGradient}>
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-2 mb-1 text-dark'>PRODUKTIFITAS OPERATOR </span>
                    <span className='text-muted fw-semibold fs-7'>Data kinerja dan statistik operasional Anda</span>
                  </h3>
                </div>
                <div className='card-header border-0 pt-2'>
                  <div className='d-flex flex-wrap align-items-center'>
                    <div className='d-flex align-items-center pe-4 mb-2'>
                      <span className='fw-bold me-2'>Pilih Bulan:</span>
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat='MM/yyyy'
                        showMonthYearPicker
                        className='form-control form-control-solid'
                        style={{width: '120px'}}
                      />
                    </div>
                    <div className='d-flex align-items-center border-start px-4 mb-2 border-gray-300'>
                      <KTSVG path='/media/icons/duotune/general/gen014.svg' className='svg-icon-3 text-primary me-2' />
                      <span className='fw-bold fs-6'>
                        PERIODE {moment(dateStart).format('DD/MM/YY')} - {moment(dateEnd).format('DD/MM/YY')}
                      </span>
                    </div>
                  </div>
                  
                  <div className='d-flex flex-wrap mt-4'>
                    <button
                      type='button'
                      className={`btn ${
                        isKomplainButtonDisabled ? 'btn-light-warning' : 'btn-warning'
                      } me-3 mb-2 d-flex align-items-center`}
                      data-bs-toggle='modal'
                      data-bs-target='#kt_modal_1'
                      id='closeModalKomplain'
                      disabled={isKomplainButtonDisabled}
                    >
                      <KTSVG path='/media/icons/duotune/communication/com012.svg' className='svg-icon-3 me-2' />
                      Komplain
                      {isKomplainButtonDisabled && (
                        <span className='ms-2 text-muted' style={{fontSize: '0.8rem'}}>
                          Tunggu 5 menit lagi
                        </span>
                      )}
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary mb-2 d-flex align-items-center'
                      data-bs-toggle='modal'
                      data-bs-target='#kt_modal_2'
                      id='closeModalCekkomplain'
                      onClick={handleCekkomplain}
                    >
                      <KTSVG path='/media/icons/duotune/general/gen028.svg' className='svg-icon-3 me-2' />
                      Cek Komplain
                    </button>
                  </div>
                </div>
              </div>
              <div className='card card-custom mt-3' style={styles.cardGradient}>
                <div className='card-header border-0 pt-4'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-2 mb-1'>Uang Bulanan</span>
                    <span className='text-muted fw-bold fs-7'>Metode pembayaran bulanan Anda</span>
                  </h3>
                  <div className='card-toolbar'>
                    {paymentDetails && (() => {
                      const currentDate = new Date();
                      const currentDay = currentDate.getDate();
                      return currentDay >= PAYMENT_SELECTION_START_DATE && 
                             currentDay <= PAYMENT_SELECTION_END_DATE ? (
                        <button 
                          type='button' 
                          className='btn btn-sm btn-primary d-flex align-items-center'
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
                          <KTSVG path='/media/icons/duotune/general/gen035.svg' className='svg-icon-3 me-2' />
                          Ubah Metode
                        </button>
                      ) : (
                        <button 
                          type='button' 
                          className='btn btn-sm btn-secondary d-flex align-items-center' 
                          disabled
                          title='Perubahan hanya dapat dilakukan pada tanggal 1-15'
                        >
                          <KTSVG path='/media/icons/duotune/general/gen035.svg' className='svg-icon-3 me-2' />
                          Ubah Metode
                        </button>
                      )
                    })()}
                  </div>
                </div>
                <div className='card-body py-2'>
                  {paymentDetails ? (
                    <div className='d-flex flex-column'>
                      <div className='position-relative mt-3 mb-3'>
                        <div className='position-absolute h-100 w-4px bg-light rounded top-0 start-0'></div>
                        
                        <div className='fw-bold fs-2 mb-1 ms-8'>
                          Status Pembayaran: {' '}
                          <span className={`badge ${paymentDetails.uang === 'cash' ? 'badge-light-primary' : 'badge-light-success'} fs-7 fw-bold`}
                              style={{ 
                                padding: '0.5rem 1rem', 
                                borderRadius: '0.475rem',
                                border: `1px solid ${paymentDetails.uang === 'cash' ? '#009ef7' : '#50cd89'}`
                              }}>
                            {paymentDetails.uang === 'cash' ? (
                              <><i className='bi bi-cash-coin me-2'></i>Cash</>
                            ) : (
                              <><i className='bi bi-credit-card me-2'></i>Transfer</>
                            )}
                          </span>
                        </div>
                        
                        <div className='d-flex flex-stack fw-semibold text-gray-600 ms-8 mt-1'>
                          <div className='fw-bold'>Periode: {moment(paymentDetails.bulan).format('MMMM YYYY')}</div>
                        </div>
                      </div>
                      
                      <div className='card bg-light mb-2'>
                        <div className='card-body p-3'>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='symbol symbol-35px me-3'>
                              <div className={`symbol-label bg-light-${paymentDetails.uang === 'cash' ? 'primary' : 'success'}`}>
                                <KTSVG path={paymentDetails.uang === 'cash' 
                                  ? '/media/icons/duotune/finance/fin010.svg' 
                                  : '/media/icons/duotune/finance/fin002.svg'} className='svg-icon-1 svg-icon-primary' />
                              </div>
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark fw-bolder fs-6'>Informasi Pembayaran</span>
                              <span className='text-muted fw-bold fs-7'>Metode yang Anda pilih untuk bulan ini</span>
                            </div>
                          </div>
                          <p className='fs-6 fw-bold text-gray-800 mb-0'>
                            Pembayaran sebesar <span className='text-dark fw-bolder'>Rp 1.000.000</span> akan dilakukan melalui {' '}
                            <span className={`text-${paymentDetails.uang === 'cash' ? 'primary' : 'success'} fw-bolder`}>
                              {paymentDetails.uang === 'cash' ? 'Cash' : 'Transfer Bank'}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className='alert alert-warning d-flex align-items-center py-2 px-3 mb-1'>
                        <span className='svg-icon svg-icon-2 svg-icon-warning me-2'>
                          <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-1' />
                        </span>
                        <div className='d-flex flex-column'>
                          <span className='fs-7'>
                            Pemilihan metode pembayaran hanya dapat dilakukan pada tanggal {PAYMENT_SELECTION_START_DATE}-{PAYMENT_SELECTION_END_DATE} setiap bulannya
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='d-flex flex-column h-100 justify-content-center align-items-center py-4'>
                      <div className='symbol symbol-60px mb-2'>
                        <div className='symbol-label bg-light-warning'>
                          <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-2x svg-icon-warning' />
                        </div>
                      </div>
                      <div className='text-center mb-2'>
                        <h3 className='fs-2 fw-bolder text-dark mb-1'>Belum Ada Pilihan</h3>
                        <p className='text-gray-600 fw-bold fs-6'>
                          Belum ada pemilihan metode pembayaran untuk periode ini
                        </p>
                      </div>
                      <div className='alert alert-warning d-flex align-items-center py-2 px-3 mb-0'>
                        <span className='svg-icon svg-icon-2 svg-icon-warning me-2'>
                          <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-1' />
                        </span>
                        <div className='d-flex flex-column'>
                          <span className='fs-7'>
                            Pemilihan metode pembayaran hanya dapat dilakukan pada tanggal {PAYMENT_SELECTION_START_DATE}-{PAYMENT_SELECTION_END_DATE} setiap bulannya
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='card card-custom card-flush mb-3 mt-2' style={styles.cardGradient}>
                <div className='card-header ribbon ribbon-top ribbon-vertical'>
                  <div className='ribbon-label bg-primary'>
                    <KTSVG path='/media/icons/duotune/general/gen032.svg' className='svg-icon-2x svg-icon-white' />
                  </div>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-2 mb-1'>Total HM</span>
                    <span className='text-muted fw-bold fs-7'>Statistik produktivitas Anda</span>
                  </h3>
                  <div className='card-toolbar'>
                    <button type='button' className='btn btn-sm btn-icon btn-light-primary btn-active-primary'>
                      <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
                    </button>
                  </div>
                </div>
                <div className='card-body py-3'>
                  <div className='table-responsive'>
                    {hmTrip && hmTrip.length >= 1 ? (
                      <>
                        {/* Desktop View */}
                        <div className='d-none d-lg-block'>
                          <div className='row g-3 g-xl-4 mb-3'>
                            <div className='col-xl-4'>
                              <div className='d-flex h-100 align-items-center card shadow-sm' 
                                style={{
                                  borderRadius: '8px', 
                                  overflow: 'hidden', 
                                  border: '1px solid #e4e6ef',
                                  background: 'white'
                                }}>
                                <div className='card-body d-flex flex-column align-items-center py-4'>
                                  <div className='symbol symbol-50px mb-3'>
                                    <span className='symbol-label bg-light-primary'>
                                      <KTSVG path='/media/icons/duotune/abstract/abs027.svg' className='svg-icon-2x svg-icon-primary' />
                                    </span>
                                  </div>
                                  <div className='text-center'>
                                    <div className='fs-5 text-gray-500 fw-semibold mb-1'>Total HM</div>
                                    <div className='fs-2 fw-bolder' style={{color: '#009ef7'}}>
                                      {hmTrip ? roundToTwoDecimalPlaces(
                                        hmTrip[0].sumHm + (hmTrip[1] ? hmTrip[1].sumHm : 0)
                                      ) : 0}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-xl-4'>
                              <div className='d-flex h-100 align-items-center card shadow-sm' 
                                style={{
                                  borderRadius: '8px', 
                                  overflow: 'hidden', 
                                  border: '1px solid #e4e6ef',
                                  background: 'white'
                                }}>
                                <div className='card-body d-flex flex-column align-items-center py-4'>
                                  <div className='symbol symbol-50px mb-3'>
                                    <span className='symbol-label bg-light-success'>
                                      <KTSVG path='/media/icons/duotune/graphs/gra008.svg' className='svg-icon-2x svg-icon-success' />
                                    </span>
                                  </div>
                                  <div className='text-center'>
                                    <div className='fs-5 text-gray-500 fw-semibold mb-1'>Total Ritasi</div>
                                    <div className='fs-2 fw-bolder' style={{color: '#50cd89'}}>
                                      {hmTrip ? roundToTwoDecimalPlaces(
                                        hmTrip[0].sumRit + (hmTrip[1] ? hmTrip[1].sumRit : 0)
                                      ) : 0}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-xl-4'>
                              <div className='d-flex h-100 align-items-center card shadow-sm' 
                                style={{
                                  borderRadius: '8px', 
                                  overflow: 'hidden', 
                                  border: '1px solid #e4e6ef',
                                  background: 'white'
                                }}>
                                <div className='card-body d-flex flex-column align-items-center py-4'>
                                  <div className='symbol symbol-50px mb-3'>
                                    <span className='symbol-label bg-light-warning'>
                                      <KTSVG path='/media/icons/duotune/maps/map001.svg' className='svg-icon-2x svg-icon-warning' />
                                    </span>
                                  </div>
                                  <div className='text-center'>
                                    <div className='fs-5 text-gray-500 fw-semibold mb-1'>Total KM</div>
                                    <div className='fs-2 fw-bolder' style={{color: '#FFC700'}}>
                                      {hmTrip ? roundToTwoDecimalPlaces(
                                        hmTrip[0].sumKm + (hmTrip[1] ? hmTrip[1].sumKm : 0)
                                      ) : 0}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className='table-rounded table-striped border border-gray-300'>
                            <table className='table align-middle table-row-bordered table-row-dashed gy-3 gs-5 text-center'>
                              <thead className='bg-light'>
                                <tr className='fw-bold fs-6 text-gray-800 border-bottom border-gray-300'>
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
                                    className='fw-bold fs-6 text-gray-800'
                                  >
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div className={`symbol symbol-30px me-3 bg-light-${index === 0 ? 'success' : 'primary'} rounded-circle`}>
                                          <span className={`symbol-label text-${index === 0 ? 'success' : 'primary'} fw-bold`}>
                                            {item.lokasi.charAt(0)}
                                          </span>
                                        </div>
                                        <span className='fw-bold'>{item.lokasi}</span>
                                      </div>
                                    </td>
                                    <td className={item.sumHm === 0 ? 'text-danger fw-bolder' : 'text-dark fw-bolder'}>
                                      {roundToTwoDecimalPlaces(item.sumHm)}
                                    </td>
                                    <td className={item.sumRit === 0 ? 'text-danger fw-bolder' : 'text-dark fw-bolder'}>
                                      {roundToTwoDecimalPlaces(item.sumRit)}
                                    </td>
                                    <td className={item.sumKm === 0 ? 'text-danger fw-bolder' : 'text-dark fw-bolder'}>
                                      {roundToTwoDecimalPlaces(item.sumKm)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {/* Mobile View */}
                        <MobileTotalHmTable hmTripData={hmTrip} />
                      </>
                    ) : (
                      <div className='text-center py-6'>
                        <div className='mb-3'>
                          <KTSVG path='/media/icons/duotune/files/fil024.svg' className='svg-icon-5x svg-icon-muted' />
                        </div>
                        <Kosong />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='card card-custom card-flush mb-3' style={styles.cardGradient}>
                <div className='card-header'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-2 mb-1'>Periode HM TRIP KM</span>
                    <span className='text-muted fw-bold fs-7'>Data produktivitas harian Anda</span>
                  </h3>
                  <div className='card-toolbar'>
                    <button type='button' className='btn btn-sm btn-icon btn-light-primary'>
                      <KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2' />
                    </button>
                  </div>
                </div>
                <div className='card-body align-items-center w-100 py-4'>
                  <div className='table-responsive'>
                    {tableOptSenyiur &&
                    tableOptSenyiur.length > 2 &&
                    tableOptSenyiur.every((item) => item[0].hmDriver === 0) &&
                    tableOptMuarapahu.length > 2 &&
                    tableOptMuarapahu.every((item) => item[0].hmDriver === 0) ? (
                      <div className='text-center py-6'>
                        <div className='mb-3'>
                          <KTSVG path='/media/icons/duotune/files/fil024.svg' className='svg-icon-5x svg-icon-muted' />
                        </div>
                        <Kosong />
                      </div>
                    ) : (
                      <>
                        {/* Desktop View */}
                        <div className='d-none d-lg-block'>
                          <table className='table table-rounded table-striped border border-gray-300 table-row-bordered table-row-gray-300 gy-4 gs-5'>
                            <thead>
                              <tr className='fw-bold fs-6 text-gray-800 border-bottom border-gray-300 bg-light'>
                                <th>Tanggal</th>
                                <th>Lokasi</th>
                                <th style={{minWidth: '80px'}}>HM</th>
                                <th style={{minWidth: '80px'}}>Trip</th>
                                <th style={{minWidth: '80px'}}>KM</th>
                              </tr>
                            </thead>

                            <tbody>
                              {tableOptSenyiur.map((item, index) => (
                                <tr
                                  key={index}
                                  className='fw-bold fs-6 text-gray-800'
                                >
                                  <td className='text-center'>
                                    <div className='badge badge-light-primary fw-bolder fs-7 py-3 px-4 d-flex flex-column'>
                                      <span className='fs-6 mb-1'>{moment(item[0].datePayroll).format('DD')}</span>
                                      <span className='opacity-75'>{moment(item[0].datePayroll).format('MMM YYYY')}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center py-2'>
                                      <div className='symbol symbol-30px me-3 bg-light-success rounded-circle'>
                                        <span className='symbol-label text-success fw-bold'>S</span>
                                      </div>
                                      <span>Senyiur</span>
                                    </div>
                                    <div className='d-flex align-items-center py-2'>
                                      <div className='symbol symbol-30px me-3 bg-light-primary rounded-circle'>
                                        <span className='symbol-label text-primary fw-bold'>M</span>
                                      </div>
                                      <span>Muarapahu</span>
                                    </div>
                                    <div className='d-flex align-items-center mt-2 pt-2 border-top border-gray-300'>
                                      <div className='symbol symbol-30px me-3'>
                                        <span className='symbol-label bg-dark text-white fw-bold'>T</span>
                                      </div>
                                      <span className='fw-bolder'>Total</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`d-flex align-items-center py-2 ${item[0].hmDriver === 0 ? 'text-danger' : 'text-gray-800'}`}>
                                      {item[0].hmDriver === 0 ? (
                                        <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                                      ) : (
                                        <span className='badge badge-light-success fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(item[0].hmDriver)}</span>
                                      )}
                                    </div>
                                    <div className={`d-flex align-items-center py-2 ${tableOptMuarapahu[index][0].hmDriver === 0 ? 'text-danger' : 'text-gray-800'}`}>
                                      {tableOptMuarapahu[index][0].hmDriver === 0 ? (
                                        <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                                      ) : (
                                        <span className='badge badge-light-primary fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(tableOptMuarapahu[index][0].hmDriver)}</span>
                                      )}
                                    </div>
                                    <div className='d-flex align-items-center mt-2 pt-2 border-top border-gray-300'>
                                      {item[0].hmDriver + tableOptMuarapahu[index][0].hmDriver === 0 ? (
                                        <span className='badge badge-danger fw-bolder fs-6 px-4 py-2'>0.00</span>
                                      ) : (
                                        <span className='badge badge-primary fw-bolder fs-6 px-4 py-2'>
                                          {roundToTwoDecimalPlaces(item[0].hmDriver + tableOptMuarapahu[index][0].hmDriver)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`d-flex align-items-center py-2 ${item[0].akumRit === 0 ? 'text-danger' : 'text-gray-800'}`}>
                                      {item[0].akumRit === 0 ? (
                                        <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                                      ) : (
                                        <span className='badge badge-light-success fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(item[0].akumRit)}</span>
                                      )}
                                    </div>
                                    <div className={`d-flex align-items-center py-2 ${tableOptMuarapahu[index][0].akumRit === 0 ? 'text-danger' : 'text-gray-800'}`}>
                                      {tableOptMuarapahu[index][0].akumRit === 0 ? (
                                        <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                                      ) : (
                                        <span className='badge badge-light-primary fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(tableOptMuarapahu[index][0].akumRit)}</span>
                                      )}
                                    </div>
                                    <div className='d-flex align-items-center mt-2 pt-2 border-top border-gray-300'>
                                      {item[0].akumRit + tableOptMuarapahu[index][0].akumRit === 0 ? (
                                        <span className='badge badge-danger fw-bolder fs-6 px-4 py-2'>0.00</span>
                                      ) : (
                                        <span className='badge badge-primary fw-bolder fs-6 px-4 py-2'>
                                          {roundToTwoDecimalPlaces(item[0].akumRit + tableOptMuarapahu[index][0].akumRit)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`d-flex align-items-center py-2 ${item[0].kmDriver === 0 ? 'text-danger' : 'text-gray-800'}`}>
                                      {item[0].kmDriver === 0 ? (
                                        <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                                      ) : (
                                        <span className='badge badge-light-success fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(item[0].kmDriver)}</span>
                                      )}
                                    </div>
                                    <div className={`d-flex align-items-center py-2 ${tableOptMuarapahu[index][0].kmDriver === 0 ? 'text-danger' : 'text-gray-800'}`}>
                                      {tableOptMuarapahu[index][0].kmDriver === 0 ? (
                                        <span className='badge badge-light-danger fw-bold fs-7 px-4'>0.00</span>
                                      ) : (
                                        <span className='badge badge-light-primary fw-bold fs-7 px-4'>{roundToTwoDecimalPlaces(tableOptMuarapahu[index][0].kmDriver)}</span>
                                      )}
                                    </div>
                                    <div className='d-flex align-items-center mt-2 pt-2 border-top border-gray-300'>
                                      {item[0].kmDriver + tableOptMuarapahu[index][0].kmDriver === 0 ? (
                                        <span className='badge badge-danger fw-bolder fs-6 px-4 py-2'>0.00</span>
                                      ) : (
                                        <span className='badge badge-primary fw-bolder fs-6 px-4 py-2'>
                                          {roundToTwoDecimalPlaces(item[0].kmDriver + tableOptMuarapahu[index][0].kmDriver)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Mobile View */}
                        <MobileHmTripTable tableData={tableOptSenyiur} muaraData={tableOptMuarapahu} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal fade' tabIndex={-1} id='kt_modal_1'>
            <div className='modal-dialog modal-dialog-centered'>
              <div className='modal-content' style={{borderRadius: '12px', overflow: 'hidden'}}>
                <div className='modal-header bg-light'>
                  <h5 className='modal-title'>
                    <KTSVG path='/media/icons/duotune/communication/com012.svg' className='svg-icon-3 me-2 text-primary' />
                    Form Komplain Operator
                  </h5>
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
                    <div className='text-center p-10'>
                      <div className='spinner-border text-primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                      <div className='mt-3 text-gray-600'>Memproses komplain Anda...</div>
                    </div>
                  ) : (
                    <>
                      <div className='mb-8'>
                        <h4 className='fs-6 fw-bold text-gray-800 mb-3'>Silakan isi form komplain dengan lengkap</h4>
                        <div className='text-gray-600 fw-semibold fs-7 mb-5'>
                          Form ini akan dikirimkan ke admin untuk ditindaklanjuti. Pastikan data yang dimasukkan sudah benar.
                        </div>
                      </div>
                      <div className='mb-5'>
                        <label className='form-label fw-semibold required'>
                          Komplain untuk Rit Tanggal
                        </label>
                        <input
                          type='date'
                          className='form-control form-control-solid'
                          value={komplainDate}
                          onChange={(e) => setKomplainDate(e.target.value)}
                        />
                      </div>
                      <div className='mb-5'>
                        <label className='form-label fw-semibold required'>Komplain</label>
                        <textarea
                          className='form-control form-control-solid'
                          rows={4}
                          placeholder='Jelaskan keluhan atau komplain Anda secara detail...'
                          value={komplainText}
                          onChange={(e) => setKomplainText(e.target.value)}
                        ></textarea>
                      </div>
                      <div className='row g-5 mb-5'>
                        <div className='col-md-6'>
                          <label className='form-label fw-semibold required'>Unit</label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <KTSVG path='/media/icons/duotune/general/gen029.svg' className='svg-icon-1 svg-icon-primary' />
                            </span>
                            <input
                              type='text'
                              className='form-control form-control-solid'
                              placeholder='Contoh: 909'
                              value={komplainUnit}
                              onChange={(e) => setKomplainUnit(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <label className='form-label fw-semibold required'>Shift</label>
                          <select
                            className='form-select form-select-solid'
                            value={komplainShift}
                            onChange={(e) => setKomplainShift(e.target.value)}
                          >
                            <option value='Pilih shift'>Pilih shift</option>
                            <option value='1'>Shift 1</option>
                            <option value='2'>Shift 2</option>
                          </select>
                        </div>
                      </div>
                      <div className='mb-5'>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                          <label className='form-label fw-semibold m-0'>Foto Bukti (Timesheet)</label>
                          {uploadedImage && (
                            <button
                              className='btn btn-sm btn-light-danger'
                              onClick={handleDeleteImage}
                            >
                              <KTSVG path='/media/icons/duotune/general/gen040.svg' className='svg-icon-2 me-0' />
                              Hapus
                            </button>
                          )}
                        </div>
                        <div className='card bg-light border border-dashed border-gray-400 py-3 px-4'>
                          {!uploadedImage ? (
                            <div className='text-center py-5'>
                              <KTSVG path='/media/icons/duotune/files/fil010.svg' className='svg-icon-4x svg-icon-muted mb-5' />
                              <div className='text-gray-600 mb-2'>Drag & drop foto di sini atau</div>
                              <label htmlFor='formFile' className='btn btn-sm btn-primary px-4 me-2'>
                                <KTSVG path='/media/icons/duotune/files/fil018.svg' className='svg-icon-3 me-2' />
                                Pilih Foto
                              </label>
                              <input
                                className='form-control d-none'
                                type='file'
                                id='formFile'
                                accept='image/*'
                                onChange={handleImageChange}
                              />
                            </div>
                          ) : (
                            <div className='text-center py-3'>
                              <div className='image-preview mb-5 mt-3' style={{maxHeight: '200px', overflow: 'hidden'}}>
                                <img src={uploadedImage} alt='Uploaded' style={{maxWidth: '100%', borderRadius: '8px'}} />
                              </div>
                              <label htmlFor='formFile' className='btn btn-sm btn-light-primary px-4'>
                                <KTSVG path='/media/icons/duotune/files/fil018.svg' className='svg-icon-3 me-2' />
                                Ganti Foto
                              </label>
                              <input
                                className='form-control d-none'
                                type='file'
                                id='formFile'
                                accept='image/*'
                                onChange={handleImageChange}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className='modal-footer'>
                  <button 
                    type='button' 
                    className='btn btn-light' 
                    data-bs-dismiss='modal'
                    disabled={loadingModal}
                  >
                    Batal
                  </button>
                  <button 
                    type='button' 
                    className='btn btn-primary d-flex align-items-center' 
                    onClick={handleKomplainSubmit}
                    disabled={loadingModal}
                  >
                    {loadingModal ? (
                      <>
                        <span className='spinner-border spinner-border-sm me-2' role='status'></span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-3 me-2' />
                        Kirim Komplain
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className='modal fade' tabIndex={-1} id='kt_modal_2'>
            <div className='modal-dialog modal-dialog-centered modal-lg'>
              <div className='modal-content' style={{borderRadius: '12px', overflow: 'hidden'}}>
                <div className='modal-header bg-light'>
                  <h5 className='modal-title'>
                    <KTSVG path='/media/icons/duotune/general/gen028.svg' className='svg-icon-3 me-2 text-primary' />
                    Daftar Komplain Anda
                  </h5>
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
                <div className='modal-body p-0'>
                  {loadingRowkomplain ? (
                    <div className='text-center p-10'>
                      <div className='spinner-border text-primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                      <div className='mt-3 text-gray-600'>Memuat data komplain...</div>
                    </div>
                  ) : (
                    <>
                      {rowKomplain.length === 0 ? (
                        <div className='text-center py-10'>
                          <KTSVG path='/media/icons/duotune/general/gen044.svg' className='svg-icon-5x svg-icon-muted mb-5' />
                          <div className='text-gray-600 mb-1'>Belum ada komplain</div>
                          <div className='fs-6 text-muted'>Anda belum pernah mengajukan komplain</div>
                        </div>
                      ) : (
                        <div className='table-responsive'>
                          <table className='table table-rounded table-row-bordered table-row-gray-300 align-middle gs-0 gy-4 mb-0'>
                            <thead>
                              <tr className='fw-bold text-muted bg-light'>
                                <th className='min-w-50px text-center'>NO</th>
                                <th className='min-w-120px'>Tanggal</th>
                                <th className='min-w-80px'>Unit</th>
                                <th className='min-w-80px'>Shift</th>
                                <th className='min-w-200px'>Komplain</th>
                                <th className='min-w-150px'>Balasan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowKomplain.map((item, index) => (
                                <tr key={index}>
                                  <td className='text-center'>
                                    <span className='badge badge-circle badge-primary'>{index + 1}</span>
                                  </td>
                                  <td>{item.NewFormatTanggalAnomali}</td>
                                  <td>
                                    <span className='badge badge-light-dark fw-semibold'>{item.unit}</span>
                                  </td>
                                  <td>
                                    <span className='badge badge-light-info fw-semibold'>Shift {item.shift}</span>
                                  </td>
                                  <td className='text-start'>{item.komplain}</td>
                                  <td>
                                    {item.balasan === null ? (
                                      <div className='d-flex align-items-center'>
                                        <span className='bullet bullet-dot bg-danger me-2'></span>
                                        <span className='text-danger fw-semibold'>Belum Dibalas</span>
                                      </div>
                                    ) : (
                                      <div className='d-flex align-items-center'>
                                        <span className='bullet bullet-dot bg-success me-2'></span>
                                        <span className='text-success fw-semibold'>{item.balasan}</span>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-light' data-bs-dismiss='modal'>
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Motivational Quote */}
          <div className='card mb-3' style={{
            background: 'url(/media/patterns/coal-mining-bg.jpg) no-repeat center center',
            backgroundSize: 'cover',
            borderRadius: '12px',
            border: 'none'
          }}>
            <div className='card-body py-6 px-6' style={{backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '12px'}}>
              <div className='d-flex flex-column align-items-center text-center text-white'>
                <KTSVG path='/media/icons/duotune/maps/map001.svg' className='svg-icon-3x svg-icon-white mb-4' />
                <h2 className='fs-2 fw-bolder mb-2'>"Keselamatan dan efisiensi adalah kunci kesuksesan operator hauling batubara."</h2>
                <p className='fs-5 opacity-75'>Tingkatkan produktivitas hauling Anda hari ini untuk performa tambang yang lebih baik!</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Hmtrip
