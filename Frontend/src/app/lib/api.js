import axiosInstance from "../config/axiosInstance"

export const getJobs = async () => {
    const data = await axiosInstance.get('/api/jobs/getJob/');
    return data
}

export const cancelJob = async (id) => {
    const data = await axiosInstance.put(`/api/jobs/cancelJob/${id}`);
    return data
}