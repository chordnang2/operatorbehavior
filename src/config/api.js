export const API_BASE_URL = 'https://mandiriservices.biz.id'

export const API_ENDPOINTS = {
    peringkat: `${API_BASE_URL}/optbehav/peringkat`,
    hmtrip: `${API_BASE_URL}/optbehav/hmtrip`,
    table: `${API_BASE_URL}/optbehav/table`,
    komplain: `${API_BASE_URL}/optbehav/komplain/opt`,
    getKomplain: (userId) => `${API_BASE_URL}/optbehav/komplain/opt/${userId}`,
    uang: {
        getAll: `${API_BASE_URL}/optbehav/uang`,
        create: `${API_BASE_URL}/optbehav/uang`,
        update: (id) => `${API_BASE_URL}/optbehav/uang/${id}`,
        delete: (id) => `${API_BASE_URL}/optbehav/uang/${id}`
    }
} 