import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'
export default function Logout() {
  const navigate = useNavigate()
  console.log(localStorage.getItem('user'))
  const user = localStorage.clear()
  useEffect(() => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle the logout action here (e.g., call an API to log the user out).
        // You can use your preferred method to handle actual logout.
        // For this example, we'll simply display a success message.
        // Swal.fire('Logged out!', 'You have been successfully logged out.', 'success')
        navigate('/login')
      } else {
        if (user === 'admin') {
          navigate('/behavior/excel')
        } else {
          navigate('/behavior/hmtrip')
        }
      }
    })
  }, [])

  return (
    <div>
      <></>
    </div>
  )
}
