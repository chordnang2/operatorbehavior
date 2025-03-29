import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { API_ENDPOINTS } from '../../config/api';

const Uang = () => {
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [loading, setLoading] = useState(true);
    const [uangData, setUangData] = useState([]);
    const [operatorData, setOperatorData] = useState([]);
    const [unsubmittedOperators, setUnsubmittedOperators] = useState([]);

    const SUBMISSION_START_DATE = 1;
    const SUBMISSION_END_DATE = 15;

    const isWithinSubmissionPeriod = () => {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        return currentDay >= SUBMISSION_START_DATE && currentDay <= SUBMISSION_END_DATE;
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [uangResponse, operatorResponse] = await Promise.all([
                axios.get(`${API_ENDPOINTS.uang.getAll}?bulan=${selectedMonth}`),
                axios.get(`${API_ENDPOINTS.operatorAll(selectedMonth)}`)
            ]);

            setUangData(uangResponse.data.data);
            setOperatorData(operatorResponse.data.data);

            // Find operators who haven't submitted their payment preference
            const submittedNiks = new Set(uangResponse.data.data.map(item => item.nik));
            const unsubmitted = operatorResponse.data.data.filter(
                operator => !submittedNiks.has(operator.nik)
            );
            setUnsubmittedOperators(unsubmitted);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group uangData by payment method
    const groupedUangData = {
        cash: uangData.filter(item => item.uang === 'cash'),
        transfer: uangData.filter(item => item.uang === 'transfer')
    };

    const exportToExcel = () => {
        // Prepare data for export
        const cashData = groupedUangData.cash.map(item => {
            const operator = operatorData.find(op => op.nik === item.nik);
            return {
                NIK: item.nik,
                Nama: operator?.driver || '-',
                'Metode Pembayaran': 'Cash'
            };
        });

        const transferData = groupedUangData.transfer.map(item => {
            const operator = operatorData.find(op => op.nik === item.nik);
            return {
                NIK: item.nik,
                Nama: operator?.driver || '-',
                'Metode Pembayaran': 'Transfer'
            };
        });

        const unsubmittedData = unsubmittedOperators.map(operator => ({
            NIK: operator.nik,
            Nama: operator.driver,
            'Metode Pembayaran': 'Belum Mengajukan'
        }));

        // Combine all data
        const allData = [...cashData, ...transferData, ...unsubmittedData];

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(allData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Uang Bulanan');

        // Generate filename with current month
        const fileName = `Uang_Bulanan_${selectedMonth}.xlsx`;

        // Save file
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className='card card-custom card-flush mb-5'>
            <div className='card-header'>
                <h3 className='card-title'>Uang Bulanan</h3>
                <div className='card-toolbar'>
                    <input
                        type='month'
                        className='form-control form-control-sm me-3'
                        value={selectedMonth}
                        onChange={(e) => {
                            setLoading(true);
                            setSelectedMonth(e.target.value);
                        }}
                    />
                    <button 
                        className='btn btn-sm btn-success'
                        onClick={exportToExcel}
                        disabled={loading}
                    >
                        <i className="ki-duotone ki-file-down fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                        </i>
                        Export Excel
                    </button>
                </div>
            </div>
            <div className='card-body'>
                <div className='alert alert-info d-flex align-items-center p-5 mb-5'>
                    <i className="ki-duotone ki-information-5 fs-2qx me-4">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                    </i>
                    <div className='d-flex flex-column'>
                        <h4 className='mb-1'>Periode Pengajuan</h4>
                        <span>Pengajuan uang bulanan hanya dapat dilakukan pada tanggal {SUBMISSION_START_DATE} - {SUBMISSION_END_DATE} setiap bulannya</span>
                        {!isWithinSubmissionPeriod() && (
                            <span className='text-danger mt-1'>
                                Saat ini bukan periode pengajuan. Operator tidak akan bisa mengajukan ataupun mengedit data pengajuan bulan ini
                            </span>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className='d-flex justify-content-center'>
                        <div className='spinner-border text-primary' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h4>Sudah Mengajukan ({uangData.length})</h4>
                                {isWithinSubmissionPeriod() ? (
                                    <button 
                                        className='btn btn-sm btn-primary'
                                        onClick={() => {/* Your submission logic */}}
                                    >
                                        Ajukan Uang Bulanan
                                    </button>
                                ) : (
                                    <button 
                                        className='btn btn-sm btn-secondary'
                                        disabled
                                        title='Pengajuan hanya dapat dilakukan pada tanggal 1-15'
                                    >
                                        Ajukan Uang Bulanan
                                    </button>
                                )}
                            </div>
                            <div className='row'>
                                {/* Cash Section */}
                                <div className='col-md-6'>
                                    <div className='card card-custom card-flush shadow-sm'>
                                        <div className='card-header'>
                                            <h5 className='card-title'>Cash ({groupedUangData.cash.length})</h5>
                                        </div>
                                        <div className='card-body p-0'>
                                            <div className='table-responsive'>
                                                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 m-0'>
                                                    <thead>
                                                        <tr className='fw-bold text-muted'>
                                                            <th>NIK</th>
                                                            <th>Nama</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groupedUangData.cash.map((item) => {
                                                            const operator = operatorData.find(op => op.nik === item.nik);
                                                            return (
                                                                <tr key={item.id}>
                                                                    <td>{item.nik}</td>
                                                                    <td>{operator?.driver || '-'}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Transfer Section */}
                                <div className='col-md-6'>
                                    <div className='card card-custom card-flush shadow-sm'>
                                        <div className='card-header'>
                                            <h5 className='card-title'>Transfer ({groupedUangData.transfer.length})</h5>
                                        </div>
                                        <div className='card-body p-0'>
                                            <div className='table-responsive'>
                                                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 m-0'>
                                                    <thead>
                                                        <tr className='fw-bold text-muted'>
                                                            <th>NIK</th>
                                                            <th>Nama</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groupedUangData.transfer.map((item) => {
                                                            const operator = operatorData.find(op => op.nik === item.nik);
                                                            return (
                                                                <tr key={item.id}>
                                                                    <td>{item.nik}</td>
                                                                    <td>{operator?.driver || '-'}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Belum Mengajukan Section */}
                        <div className='col-md-4'>
                            <div className='card card-custom card-flush shadow-sm'>
                                <div className='card-header'>
                                    <h5 className='card-title'>
                                        Belum Mengajukan ({unsubmittedOperators.length})
                                        {!isWithinSubmissionPeriod() && (
                                            <span className='badge badge-light-warning ms-2'>
                                                Periode Tutup
                                            </span>
                                        )}
                                    </h5>
                                </div>
                                <div className='card-body p-0'>
                                    <div className='table-responsive'>
                                        <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 m-0'>
                                            <thead>
                                                <tr className='fw-bold text-muted'>
                                                    <th>NIK</th>
                                                    <th>Nama</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {unsubmittedOperators.map((operator) => (
                                                    <tr key={operator.nik}>
                                                        <td>{operator.nik}</td>
                                                        <td>{operator.driver}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Uang;