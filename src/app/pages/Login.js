import axios from 'axios'
import {toAbsoluteUrl} from '../../_metronic/helpers'
import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'
import {API_ENDPOINTS} from '../../config/api'

function Login() {
  const [nik, setNik] = useState('')
  const [password, setPassword] = useState('')
  const [nama, setNama] = useState('')
  const [loading, setLoading] = useState(false)

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
    const lastShown = localStorage.getItem('safetyMessageLastShown')
    const now = new Date().getTime()

    const showSafetyModal = () => {
      const randomIndex = Math.floor(Math.random() * safetyMessages.length)
      const message = safetyMessages[randomIndex]

      const pointsHtml = message.points
        .map(
          (point) => `
            <div class="d-flex align-items-center mb-2">
                <i class="bi bi-check2-circle me-2" style="color: #009ef7;"></i>
                <span>${point}</span>
            </div>
        `
        )
        .join('')

      Swal.fire({
        title: `<div class="d-flex align-items-center">
                    <div class="safety-icon me-3" style="background-color: #009ef7; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        <i class="bi bi-shield-check text-white fs-4"></i>
                    </div>
                    <h5 class="mb-0" style="color: #009ef7;">${message.title}</h5>
                </div>`,
        html: `
            <div class="safety-points text-start" style="background-color: #f1faff; border-radius: 6px; padding: 15px 20px;">
                ${pointsHtml}
            </div>
        `,
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Saya Mengerti',
        width: '600px',
        customClass: {
          title: 'p-0 border-0',
          htmlContainer: 'p-0 mt-0',
        },
      })

      localStorage.setItem('safetyMessageLastShown', now.toString())
    }

    if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
      showSafetyModal()
    }
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Trigger the login button click when Enter key is pressed
      loginButtonRef.current.click()
    }
  }


  const handleGetNama = async () => {
    await axios
      .post(API_ENDPOINTS.user(nik))
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
    setLoading(true)
    
    try {
      await handleGetNama()

      const body = {
        nik: nik,
        password: password,
      }
      await axios
        .post(API_ENDPOINTS.login, body)
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
    } catch (error) {
      console.error('Login error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Terjadi kesalahan, silakan coba lagi',
      })
    } finally {
      setLoading(false)
    }
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
              <div
                className='mb-10 bg-light-info p-8 rounded'
                style={{
                  border: '1px solid #e4e6ef',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#f1faff',
                  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
                  textAlign: 'left',
                }}
              >
                <div className='d-flex align-items-center mb-3'>
                  <div
                    className='safety-icon me-3'
                    style={{
                      backgroundColor: '#009ef7',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i className='bi bi-info-circle-fill text-white fs-4'></i>
                  </div>
                  <h5 className='mb-0' style={{color: '#009ef7'}}>
                    Informasi Login
                  </h5>
                </div>
                <div style={{paddingLeft: '10px'}}>
                  <p className='mb-2'>
                    <i className='bi bi-person-check-fill me-2' style={{color: '#009ef7'}}></i>
                    Login menggunakan akun HRIS.
                  </p>
                  <p className='mb-2'>
                    <i className='bi bi-key-fill me-2' style={{color: '#009ef7'}}></i>
                    Akun default adalah <b>NIK</b> dan password <b>NIK</b>.
                  </p>
                  <p className='mb-2'>
                    <i className='bi bi-exclamation-triangle-fill me-2' style={{color: '#f1416c'}}></i>
                    <b>PENTING!</b> Password bukan lagi 5 digit terakhir no KTP.
                  </p>
                  <p className='mb-2'>
                    <i className='bi bi-shield-lock-fill me-2' style={{color: '#009ef7'}}></i>
                    Untuk mengubah, lupa atau reset password, install aplikasi HRIS.
                  </p>
                  <p className='mb-0'>
                    <i className='bi bi-headset me-2' style={{color: '#009ef7'}}></i>
                    Hubungi MPP atau CCR (Muhajir atau Rasyid) untuk bantuan.
                  </p>
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
                  placeholder='Masukkan Password'
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
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                      <span className='ms-2'>Loading...</span>
                    </span>
                  ) : (
                    'Login'
                  )}
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
