// Set this to true for local development, false for production
const isLocalDevelopment = false;

// Base URLs
const PRODUCTION_BASE_URL = 'https://produksi.mandiriservices.biz.id';
const LOCAL_BASE_URL = 'http://localhost:4100'; // Update this with your local server port

// Select the base URL based on the environment
export const API_BASE_URL = isLocalDevelopment ? LOCAL_BASE_URL : PRODUCTION_BASE_URL;

export const API_ENDPOINTS = {
    // User endpoints
    login: `${API_BASE_URL}/optbehav/login`,
    user: (nikOpt) => `${API_BASE_URL}/optbehav/user/${nikOpt}`,
    
    // Main data endpoints
    pelanggaran: {
        getAll: (page, limit) => `${API_BASE_URL}/optbehav/pelanggaran?page=${page}&limit=${limit}`,
        batch: `${API_BASE_URL}/optbehav/pelanggaran/batch`
    },
    sp: {
        getAll: (page, limit) => `${API_BASE_URL}/optbehav/sp?page=${page}&limit=${limit}`,
        batch: `${API_BASE_URL}/optbehav/sp/batch`
    },
    
    cek: `${API_BASE_URL}/optbehav/cek`,
    cekOpt: `${API_BASE_URL}/optbehav/cek/opt`,
    cekDino: `${API_BASE_URL}/optbehav/cek/dino`,
    peringkat: `${API_BASE_URL}/optbehav/peringkat`,
    hmtrip: `${API_BASE_URL}/optbehav/hmtrip`,
    table: `${API_BASE_URL}/optbehav/table`,
    
    // Excel endpoints
    excel: (date) => `${API_BASE_URL}/optbehav/excel/${date}`,
    excelCreate: (date) => `${API_BASE_URL}/optbehav/excel/create/${date}`,
    
    // Komplain endpoints
    komplain: `${API_BASE_URL}/optbehav/komplain`,
    komplainOpt: `${API_BASE_URL}/optbehav/komplain/opt`,
    getKomplain: (userId) => `${API_BASE_URL}/optbehav/komplain/opt/${userId}`,
    komplainBalasan: (id) => `${API_BASE_URL}/optbehav/komplain/balasan/${id}`,
    
    // Uang endpoints
    uang: {
        getAll: `${API_BASE_URL}/optbehav/uang`,
        create: `${API_BASE_URL}/optbehav/uang`,
        update: (id) => `${API_BASE_URL}/optbehav/uang/${id}`,
        delete: (id) => `${API_BASE_URL}/optbehav/uang/${id}`
    },
    
    // Operator endpoints
    operatorAll: (bulan) => `${API_BASE_URL}/optbehav/operatorall?bulan=${bulan}`
} 