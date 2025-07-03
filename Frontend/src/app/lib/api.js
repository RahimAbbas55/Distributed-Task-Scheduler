import axiosInstance from "../config/axiosInstance";
export const getJobs = async () => {
  const res = await axiosInstance.get("/api/jobs/getJob/");
  return res.data;
};

export const cancelJob = async (id) => {
  const res = await axiosInstance.put(`/api/jobs/cancelJob/${id}`);
  return res.data;
};

export const addJob = async (formData) => {
  const res = await axiosInstance.post(`/api/jobs/createJob` , formData);
  return res.data;
}
