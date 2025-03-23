import axios from 'axios'
import {toAbsoluteUrl} from '../../_metronic/helpers'
import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

function Login() {
  const [nik, setNik] = useState('')
  const [password, setPassword] = useState('')
  const [nama, setNama] = useState('')
  const [safetyMessage, setSafetyMessage] = useState('')

  const navigate = useNavigate()
  const [backgroundImage, setBackgroundImage] = useState('')
  const loginButtonRef = useRef(null)

  const safetyMessages = [
    {
      title: "Kenali Tanda-tanda Kelelahan",
      points: [
        "Menguap berulang kali",
        "Sulit berkonsentrasi atau kehilangan fokus",
        "Reaksi lebih lambat dari biasanya",
        "Mengantuk atau mata terasa berat"
      ]
    },
    {
      title: "Pastikan Istirahat yang Cukup",
      points: [
        "Tidur minimal 7-9 jam sebelum bekerja",
        "Manfaatkan waktu istirahat dengan baik",
        "Hindari begadang sebelum giliran kerja"
      ]
    },
    {
      title: "Jaga Pola Makan dan Hidrasi",
      points: [
        "Konsumsi makanan sehat dan bergizi",
        "Hindari makanan berat dan berminyak sebelum berkendara",
        "Minum air yang cukup untuk tetap terhidrasi"
      ]
    },
    {
      title: "Gunakan Teknik Pencegahan Fatigue",
      points: [
        "Lakukan peregangan ringan sebelum mulai bekerja",
        "Gunakan teknik pernapasan dalam untuk menjaga kesadaran",
        "Berkomunikasi dengan rekan kerja jika merasa lelah"
      ]
    },
    {
      title: "Patuhi Aturan Keselamatan",
      points: [
        "Jangan memaksakan diri jika merasa sangat lelah",
        "Gunakan sistem rotasi shift secara efektif",
        "Laporkan ke atasan jika mengalami tanda-tanda fatigue"
      ]
    },
    {
      title: "Manfaatkan Sistem Pengawas Fatigue",
      points: [
        "Gunakan alat pemantau kelelahan jika tersedia",
        "Jangan abaikan peringatan dari sistem keselamatan"
      ]
    }
  ]

  useEffect(() => {
    // Get random safety message when component mounts
    const randomIndex = Math.floor(Math.random() * safetyMessages.length)
    setSafetyMessage(safetyMessages[randomIndex])
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Trigger the login button click when Enter key is pressed
      loginButtonRef.current.click()
    }
  }


  const handleGetNama = async () => {
    await axios
      .post(`https://produksi.mandiriservices.biz.id/optbehav/user/${nik}`)
      .then((response) => {
        console.log(response.data.data[0].nama, 'response sukses')
        if (response.data.data) {
          setNama(response.data.data[0].nama)
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error)
      })
  }

  const handleLogin = async () => {
    await handleGetNama()

    const body = {
      nik: nik,
      password: password,
    }
    await axios
      .post(`https://produksi.mandiriservices.biz.id/optbehav/login`, body)
      .then((response) => {
        // console.log(response.data.user)
        if (response.data.user && response.data.user === 'admin') {
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil',
            timer: 1500,
          }).then(() => {
            localStorage.setItem('user', response.data.user)
            localStorage.setItem('userNama', response.data.user)
            navigate('/behavior/excel') // Redirect to /login after the success message is closed
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil',
            timer: 1500,
          }).then(() => {
            localStorage.setItem('user', nik)
            localStorage.setItem('userNama', nama)
            navigate('/behavior/hmtrip')
          })
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error)
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'Cek nik dan password kembali',
        })
      })
  }

  useEffect(() => {
    const handleResize = () => {
      const newBackgroundImage =
        window.innerWidth >= 1200
          ? toAbsoluteUrl('/media/login/backgroundlogindesktop.png')
          : toAbsoluteUrl('/media/login/backgroundloginmobile.png')

      setBackgroundImage(newBackgroundImage)
    }

    // Set initial background image
    handleResize()

    // Add resize event listener to update background image on window resize
    window.addEventListener('resize', handleResize)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  // console.log(nik, 'nik')
  // console.log(password, 'password')
  return (
    <div
      className='d-flex flex-column flex-lg-row flex-column-fluid h-100'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
      }}
    >
      <div
        className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1 '
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          margin: 'auto',
          padding: '20px',
          maxWidth: '600px',
        }}
      >
        {/* Safety Message Box */}
        {safetyMessage && (
          <div className="safety-message-box mb-5" 
            style={{
              border: '1px solid #e4e6ef',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 0 20px rgba(0,0,0,0.05)',
            }}>
            <div className="d-flex align-items-center mb-3">
              <div className="safety-icon me-3"
                style={{
                  backgroundColor: '#009ef7',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <i className="bi bi-shield-check text-white fs-4"></i>
              </div>
              <h5 className="mb-0" style={{ color: '#009ef7' }}>
                {safetyMessage.title}
              </h5>
            </div>
            <div className="safety-points"
              style={{
                backgroundColor: '#f1faff',
                borderRadius: '6px',
                padding: '15px 20px',
              }}>
              {safetyMessage.points.map((point, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <i className="bi bi-check2-circle me-2" style={{ color: '#009ef7' }}></i>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          <div className='w-lg-500px p-10'>
            <form
              className='form w-100'
              //   onSubmit={formik.handleSubmit}
              noValidate
              id='kt_login_signin_form'
            >
              <div className='text-center mb-11'>
                <h1 className='text-dark fw-bolder mb-3'>Login</h1>
              </div>
              <div className='row g-3 mb-9'>
                <div className='col-md-12'>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/login/logomha.png')}
                    className='me-3 w-100 '
                  />
                </div>
              </div>
              <div className='fv-row mb-8'>
                <label className='form-label fs-6 fw-bolder text-dark'>NIK</label>
                <input
                  autoFocus  
                  placeholder='Masukkan NIK'
                  className='form-control bg-transparent'
                  type='text'
                  name='nik'
                  autoComplete='on'
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className='fv-row mb-3'>
                <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                <input
                  type='password'
                  autoComplete='on'
                  placeholder='Masukkan 5 digit terakhir no KTP'
                  //   {...formik.getFieldProps('password')}
                  className='form-control bg-transparent'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {/* <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
                <div />
                <Link to='/auth/forgot-password' className='link-primary'>
                  Forgot Password ?
                </Link>
              </div> */}
              <div className='d-grid mb-10'>
                <button
                  ref={loginButtonRef}
                  type='button'
                  id='kt_sign_in_submit'
                  className='btn btn-primary'
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
              {/* <div className='text-gray-500 text-center fw-semibold fs-6'>
                Not a Member yet?{' '}
                <Link to='/auth/registration' className='link-primary'>
                  Sign up
                </Link>
              </div> */}
            </form>
          </div>
        </div>
        <a href='http://payns.mha.co.id/'>
          <div
            className='d-flex form-control flex-center flex-column flex-lg-row-fluid text-center bg-secondary text-black rounded-3'
            style={{fontSize: 9}}
          >
            INFORMASI, LINK BARU PAYSLIP NON STAFF DISINI
          </div>
        </a>
      </div>
    </div>
  )
}

export default Login
