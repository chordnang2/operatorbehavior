import React, {useState, useEffect} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {HotTable} from '@handsontable/react'
import {registerAllModules} from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.min.css'
import axios from 'axios'
import {toast} from 'react-toastify'
import moment from 'moment'
import {API_ENDPOINTS} from '../../../config/api'

registerAllModules()

const Sp = () => {
	const [data, setData] = useState([])
	const [existingData, setExistingData] = useState([])
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [totalItems, setTotalItems] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [search, setSearch] = useState('')
	const [filters, setFilters] = useState({
		nik: '',
		nama: '',
		suratPeringatan: '',
		kejadian: '',
		pp: '',
		grounded: '',
		berbunyi: '',
		jangka: '',
		diberikanOleh: '',
		sifatSurat: '',
		startDateFrom: '',
		startDateTo: '',
		endDateFrom: '',
		endDateTo: ''
	})

	const columns = [
		{data: 'nik', title: 'NIK'},
		{data: 'nama', title: 'Nama'},
		{data: 'suratPeringatan', title: 'Surat Peringatan'},
		{data: 'kejadian', title: 'Kejadian'},
		{data: 'pp', title: 'PP'},
		{data: 'grounded', title: 'Grounded'},
		{data: 'berbunyi', title: 'Berbunyi'},
		{data: 'jangka', title: 'Jangka'},
		{data: 'start', title: 'Tanggal Mulai', type: 'date', dateFormat: 'YYYY-MM-DD'},
		{data: 'end', title: 'Tanggal Selesai', type: 'date', dateFormat: 'YYYY-MM-DD'},
		{data: 'diberikanOleh', title: 'Diberikan Oleh'},
		{data: 'sifatSurat', title: 'Sifat Surat'}
	]

	useEffect(() => {
		fetchData(currentPage, itemsPerPage)
	}, [currentPage, itemsPerPage])

	const fetchData = async (page = 1, limit = 10) => {
		try {
			setLoading(true)
			
			// Build query parameters
			const params = new URLSearchParams({
				page,
				limit
			})
			
			// Add search parameter if not empty
			if (search) params.append('search', search)
			
			// Add filter parameters if not empty
			Object.entries(filters).forEach(([key, value]) => {
				if (value) params.append(key, value)
			})
			
			const response = await axios.get(`${API_ENDPOINTS.sp.getAll()}?${params.toString()}`)
			setExistingData(response.data.data)
			
			// Set pagination data
			if (response.data.pagination) {
				setCurrentPage(response.data.pagination.currentPage)
				setTotalPages(response.data.pagination.totalPages)
				setTotalItems(response.data.pagination.totalItems)
				setItemsPerPage(response.data.pagination.itemsPerPage)
			}
			
			toast.success('Data berhasil dimuat')
		} catch (error) {
			console.error('Error fetching data:', error)
			toast.error('Gagal mengambil data SP')
		} finally {
			setLoading(false)
		}
	}

	const handlePageChange = (newPage) => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage)
		}
	}

	const handleLimitChange = (e) => {
		const newLimit = parseInt(e.target.value)
		setItemsPerPage(newLimit)
		setCurrentPage(1) // Reset to first page when changing limit
	}

	const handleSearchChange = (e) => {
		setSearch(e.target.value)
	}

	const handleFilterChange = (e) => {
		const {name, value} = e.target
		setFilters(prev => ({...prev, [name]: value}))
	}

	const applyFilters = () => {
		setCurrentPage(1) // Reset to first page when applying filters
		toast.info('Menerapkan filter...')
		fetchData(1, itemsPerPage)
	}

	const resetFilters = () => {
		setSearch('')
		setFilters({
			nik: '',
			nama: '',
			suratPeringatan: '',
			kejadian: '',
			pp: '',
			grounded: '',
			berbunyi: '',
			jangka: '',
			diberikanOleh: '',
			sifatSurat: '',
			startDateFrom: '',
			startDateTo: '',
			endDateFrom: '',
			endDateTo: ''
		})
		setCurrentPage(1)
		toast.info('Mereset filter...')
		fetchData(1, itemsPerPage)
	}

	const handleAfterChange = (changes, source) => {
		if (source === 'loadData') return

		if (changes) {
			const [row, prop, oldValue, newValue] = changes[0]
			const updatedData = [...data]
			
			if (prop === 'nik' || prop === 'start' || prop === 'suratPeringatan') {
				// Check for duplicates
				const isDuplicate = existingData.some(item => 
					item.nik === updatedData[row].nik && 
					item.start === updatedData[row].start && 
					item.suratPeringatan === updatedData[row].suratPeringatan
				)

				if (isDuplicate) {
					toast.error('Data dengan NIK, tanggal mulai, dan surat peringatan yang sama sudah ada!')
					// Revert the change
					updatedData[row][prop] = oldValue
					setData(updatedData)
					return
				}
			}
		}
	}

	const handleSave = async () => {
		try {
			setLoading(true)
			const validData = data.filter(row => row.nik && row.start && row.suratPeringatan)
			
			if (validData.length === 0) {
				toast.warning('Tidak ada data valid untuk disimpan')
				return
			}

			const response = await axios.post(API_ENDPOINTS.sp.batch, {
				data: validData
			})

			toast.success('Data berhasil disimpan')
			fetchData(currentPage, itemsPerPage)
			setData([]) // Clear input table
		} catch (error) {
			console.error('Error saving data:', error)
			
			// Display error notification
			if (error.response && error.response.data) {
				const errorData = error.response.data
				console.log('Error data received:', errorData) // Debug log
				
				// Show the main error message
				toast.error(errorData.message || 'Gagal menyimpan data', {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
				
				// Show duplicate entries in a simplified way
				if (errorData.duplicates && Array.isArray(errorData.duplicates) && errorData.duplicates.length > 0) {
					// Create a clear message for duplicates
					const duplicateMessages = errorData.duplicates.map(dup => 
						`NIK: ${dup.nik}, Tanggal Mulai: ${dup.start}, Surat Peringatan: ${dup.suratPeringatan}`
					);
					
					// Show each duplicate as a separate toast
					duplicateMessages.forEach(msg => {
						toast.warning(`Duplikat data: ${msg}`, {
							position: "top-right",
							autoClose: 7000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
						})
					})
					
					// Also create an alert as a fallback to ensure the user sees the message
					if (duplicateMessages.length > 0) {
						const alertMsg = `Terdapat ${duplicateMessages.length} data duplikat:\n\n${duplicateMessages.join('\n')}`;
						alert(alertMsg);
					}
				}
			} else {
				toast.error('Gagal menyimpan data', {
					position: "top-right",
					autoClose: 5000,
				})
			}
		} finally {
			setLoading(false)
		}
	}

	// Generate pagination items
	const renderPaginationItems = () => {
		const items = []
		
		// Add first page and previous
		items.push(
			<li key="first" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
				<button className="page-link" onClick={() => handlePageChange(1)}>
					<i className="fas fa-angle-double-left"></i>
				</button>
			</li>
		)
		items.push(
			<li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
				<button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
					<i className="fas fa-angle-left"></i>
				</button>
			</li>
		)
		
		// Calculate visible page range
		let startPage = Math.max(1, currentPage - 2)
		let endPage = Math.min(totalPages, startPage + 4)
		
		if (endPage - startPage < 4) {
			startPage = Math.max(1, endPage - 4)
		}
		
		// Add page numbers
		for (let i = startPage; i <= endPage; i++) {
			items.push(
				<li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
					<button className="page-link" onClick={() => handlePageChange(i)}>
						{i}
					</button>
				</li>
			)
		}
		
		// Add next and last page
		items.push(
			<li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
				<button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
					<i className="fas fa-angle-right"></i>
				</button>
			</li>
		)
		items.push(
			<li key="last" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
				<button className="page-link" onClick={() => handlePageChange(totalPages)}>
					<i className="fas fa-angle-double-right"></i>
				</button>
			</li>
		)
		
		return items
	}

  return (
		<div className='d-flex flex-column gap-2'>
			<PageTitle>Data Surat Peringatan (SP)</PageTitle>
			
			<div className='row mb-3'>
				<div className='col-xl-6 col-lg-6'>
					<div className='card h-100'>
						<div className='card-header border-0 py-2'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold fs-4'>Input Data SP</span>
							</h3>
							<div className='card-toolbar'>
								<button
									className='btn btn-sm btn-primary'
									onClick={handleSave}
									disabled={loading}
								>
									{loading ? <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Menyimpan...</> : 'Simpan Data'}
								</button>
							</div>
						</div>
						
						<div className='card-body py-1'>
							<HotTable
								data={data}
								columns={columns}
								colHeaders={true}
								rowHeaders={true}
								height={300}
								licenseKey='non-commercial-and-evaluation'
								afterChange={handleAfterChange}
								minSpareRows={1}
								readOnly={loading}
							/>
						</div>
					</div>
				</div>
				
				<div className='col-xl-6 col-lg-6'>
					<div className='card h-100'>
						<div className='card-header border-0 py-2'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold fs-4'>Pencarian & Filter</span>
							</h3>
							<div className='card-toolbar'>
								<button className='btn btn-sm btn-primary me-2' onClick={applyFilters} disabled={loading}>
									{loading ? <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Loading...</> : 'Terapkan Filter'}
								</button>
								<button className='btn btn-sm btn-secondary' onClick={resetFilters} disabled={loading}>
									{loading ? <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Loading...</> : 'Reset'}
								</button>
							</div>
						</div>
						
						<div className='card-body py-2'>
							<div className='mb-3'>
								<label className='form-label'>Pencarian Umum</label>
								<input
									type='text'
									className='form-control form-control-sm'
									placeholder='Cari NIK, nama, surat peringatan, kejadian...'
									value={search}
									onChange={handleSearchChange}
									disabled={loading}
								/>
							</div>
							
							<div className='row g-3'>
								<div className='col-md-6'>
									<label className='form-label'>NIK</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='nik'
										value={filters.nik}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Nama</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='nama'
										value={filters.nama}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Surat Peringatan</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='suratPeringatan'
										value={filters.suratPeringatan}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Kejadian</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='kejadian'
										value={filters.kejadian}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>PP</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='pp'
										value={filters.pp}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Grounded</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='grounded'
										value={filters.grounded}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Berbunyi</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='berbunyi'
										value={filters.berbunyi}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Jangka</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='jangka'
										value={filters.jangka}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Tanggal Mulai (Dari)</label>
									<input
										type='date'
										className='form-control form-control-sm'
										name='startDateFrom'
										value={filters.startDateFrom}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Tanggal Mulai (Sampai)</label>
									<input
										type='date'
										className='form-control form-control-sm'
										name='startDateTo'
										value={filters.startDateTo}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Tanggal Selesai (Dari)</label>
									<input
										type='date'
										className='form-control form-control-sm'
										name='endDateFrom'
										value={filters.endDateFrom}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Tanggal Selesai (Sampai)</label>
									<input
										type='date'
										className='form-control form-control-sm'
										name='endDateTo'
										value={filters.endDateTo}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Diberikan Oleh</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='diberikanOleh'
										value={filters.diberikanOleh}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
								<div className='col-md-6'>
									<label className='form-label'>Sifat Surat</label>
									<input
										type='text'
										className='form-control form-control-sm'
										name='sifatSurat'
										value={filters.sifatSurat}
										onChange={handleFilterChange}
										disabled={loading}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='card'>
				<div className='card-header border-0 py-2'>
					<h3 className='card-title align-items-start flex-column'>
						<span className='card-label fw-bold fs-4'>List Data Surat Peringatan</span>
						<span className='text-muted fw-semibold fs-7'>
							Total {totalItems} data
						</span>
					</h3>
					<div className='card-toolbar'>
						<select 
							className='form-select form-select-sm form-select-solid' 
							value={itemsPerPage}
							onChange={handleLimitChange}
							disabled={loading}
						>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
						</select>
					</div>
				</div>
				
				<div className='card-body py-1'>
					{loading && (
						<div className="d-flex justify-content-center mb-3">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					)}
					<div className='table-responsive'>
						<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-0 table-sm'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th>NIK</th>
									<th>Nama</th>
									<th>Surat Peringatan</th>
									<th>Kejadian</th>
									<th>PP</th>
									<th>Grounded</th>
									<th>Berbunyi</th>
									<th>Jangka</th>
									<th>Tanggal Mulai</th>
									<th>Tanggal Selesai</th>
									<th>Diberikan Oleh</th>
									<th>Sifat Surat</th>
								</tr>
							</thead>
							<tbody>
								{existingData.length > 0 ? (
									existingData.map((row, index) => (
										<tr key={index}>
											<td className="py-1">{row.nik}</td>
											<td className="py-1">{row.nama}</td>
											<td className="py-1">{row.suratPeringatan}</td>
											<td className="py-1">{row.kejadian}</td>
											<td className="py-1">{row.pp}</td>
											<td className="py-1">{row.grounded}</td>
											<td className="py-1">{row.berbunyi}</td>
											<td className="py-1">{row.jangka}</td>
											<td className="py-1">{moment(row.start).format('YYYY-MM-DD')}</td>
											<td className="py-1">{row.end ? moment(row.end).format('YYYY-MM-DD') : '-'}</td>
											<td className="py-1">{row.diberikanOleh}</td>
											<td className="py-1">{row.sifatSurat}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={12} className="text-center">
											{loading ? 'Loading...' : 'Tidak ada data'}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					
					{totalPages > 1 && (
						<div className='d-flex justify-content-between align-items-center flex-wrap mt-2'>
							<div className='d-flex flex-wrap py-1 mr-3'>
								<ul className='pagination pagination-sm'>
									{renderPaginationItems()}
								</ul>
							</div>
							<div className='d-flex align-items-center py-1'>
								<span className='text-muted fs-7'>
									Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} sampai {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
  )
}

export default Sp