import {useEffect, useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import axios from 'axios'
import moment from 'moment'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import ModalImage from 'react-modal-image'
import {API_ENDPOINTS} from '../../../config/api'

function Komplain() {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // You can adjust this value as needed.
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = currentPage * itemsPerPage
  const currentTableData = tableData.slice(startIndex, endIndex)

  const usersBreadcrumbs = [
    {
      title: 'Komplain',
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

  useEffect(() => {
    setLoading(true)
    getKomplain()
  }, [])

  const getKomplain = () => {
    axios
      .get(API_ENDPOINTS.komplain)
      // .get(`http://localhost:4000/optbehav/komplain`)
      .then((response) => {
        const formattedData = response.data.data.map((row) => ({
          ...row,
          timestamp_komplain: moment(row.timestamp_komplain).format('DD/MM/YYYY HH:mm'),
          tanggalAnomali: moment(row.tanggalAnomali).format('DD MMM YYYY'),
          textAreaValue: '', // Add a new property for text area value
        }))
        setTableData(formattedData)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }
  // const botTelegram = async (nik_komplain, nama_komplain, tanggalAnomali) => {
  //   await axios
  //     .get(`http://localhost/optbehav/bot`)
  //     // .get(`http://localhost:4000/optbehav/komplain`)
  //     .then((response) => {
  //       console.log(response, 'AMANNN TELEGRAM BOT')
  //     })
  // }

  const submitBalasan = (itemId) => {
    setLoading(true)

    // Find the item in the tableData array
    const itemToUpdate = tableData.find((item) => item.id === itemId)

    const {nik_komplain, nama_komplain, tanggalAnomali} = itemToUpdate
    // console.log(nik_komplain, nama_komplain, tanggalAnomali, 'AAA')
    // botTelegram(nik_komplain, nama_komplain, tanggalAnomali)
    // const itemNik = tableData.find((item) => item.nik_komplain === itemNik)
    // const itemNama = tableData.find((item) => item.nik_komplain === itemNama)
    // const itemTanggal = tableData.find((item) => item.tanggalAnomali === itemTanggal)

    if (itemToUpdate) {
      const requestBody = {
        balasan: itemToUpdate.textAreaValue,
        nik_komplain: nik_komplain,
        nama_komplain: nama_komplain,
        tanggalAnomali: tanggalAnomali,
      }

      axios
        .patch(API_ENDPOINTS.komplainBalasan(itemId), requestBody)
        .then((response) => {
          console.log('Balasan submitted successfully:', response)
          getKomplain()
        })
        .catch((error) => {
          console.error('Error submitting balasan:', error)
          setLoading(false)
        })
    }
  }

  // Handle text area input change for a specific item
  const handleTextAreaChange = (itemId, value) => {
    setTableData((prevData) =>
      prevData.map((item) => (item.id === itemId ? {...item, textAreaValue: value} : item))
    )
  }
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    const maxPage = Math.ceil(tableData.length / itemsPerPage)
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div>
      <>
        <PageTitle breadcrumbs={usersBreadcrumbs}>Komplain</PageTitle>
        <div className='card mb-10'>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold text-dark'>Data Komplain Operator </span>
              {/* <span className='text-muted mt-1 fw-semibold fs-7'></span> */}
            </h3>
          </div>
          {loading ? ( // Render a spinner when loading is true
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>Loading Data...</span>
            </div>
          ) : (
            <div className='card-body align-items-center w-100 py-8 table-responsive'>
              <table className='table table-bordered  table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    {/* <th scope='col'>TIMESTAMP</th> */}
                    <th scope='col'>TANGGAL KOMPLAIN</th>
                    <th scope='col'>NIK</th>
                    <th scope='col'>NAMA</th>
                    <th scope='col'>UNIT</th>
                    <th scope='col'>SHIFT</th>
                    <th scope='col'>KOMPLAIN</th>
                    <th scope='col'>BALASAN</th>
                    <th scope='col'>FOTO</th>
                    <th scope='col'>STATUS</th>
                  </tr>
                </thead>
                {currentTableData.length > 0 ? (
                  <tbody>
                    {currentTableData.map((item, index) => (
                      <tr key={index} className={item.balasan ? 'table-success' : 'table-danger'}>
                        <th scope='row'>{index + 1}</th>
                        {/* <td>{item.timestamp_komplain}</td> */}
                        <td>{item.tanggalAnomali}</td>
                        <td>{item.nik_komplain}</td>
                        <td>{item.nama_komplain}</td>
                        <td>{item.unit}</td>
                        <td>{item.shift}</td>
                        <td>{item.komplain}</td>
                        <td>
                          {item.balasan ? (
                            `${item.balasan}`
                          ) : (
                            <>
                              <div className='pb-2'>
                                <textarea
                                  className='form-control'
                                  value={item.textAreaValue} // Set the value of the text area for this specific item
                                  onChange={
                                    (e) => handleTextAreaChange(item.id, e.target.value) // Handle text area input change
                                  }
                                />
                              </div>
                              <button
                                type='submit'
                                className='btn btn-sm btn-primary'
                                onClick={() => submitBalasan(item.id)}
                              >
                                Submit
                              </button>
                            </>
                          )}
                        </td>
                        <td>
                          {item.foto ? (
                            item.foto === 'null' ? (
                              'tidak ada foto'
                            ) : (
                              <ModalImage
                                small={toAbsoluteUrl(`/uploadfoto/${item.foto}`)}
                                large={toAbsoluteUrl(`/uploadfoto/${item.foto}`)}
                                alt={item.foto}
                              />
                            )
                          ) : (
                            'tidak ada foto'
                          )}
                        </td>
                        <td>{item.balasan ? 'sudah dibalas' : 'belum dibalas'}</td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan='10'>No data available</td>
                    </tr>
                  </tbody>
                )}
              </table>
              <ul className='pagination'>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className='page-link' onClick={goToPreviousPage}>
                    <i className='previous'></i>
                  </button>
                </li>
                {Array.from({length: Math.ceil(tableData.length / itemsPerPage)}, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button className='page-link' onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === Math.ceil(tableData.length / itemsPerPage) ? 'disabled' : ''
                  }`}
                >
                  <button className='page-link' onClick={goToNextPage}>
                    <i className='next'></i>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </>
    </div>
  )
}

export default Komplain
