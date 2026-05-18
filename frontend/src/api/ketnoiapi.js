import axios from "axios";

const ketNoiApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

ketNoiApi.interceptors.request.use((cauhinh) => {
  const token = localStorage.getItem("ma_dang_nhap");

  if (token) {
    cauhinh.headers.Authorization = `Bearer ${token}`;
  }

  return cauhinh;
});

ketNoiApi.interceptors.response.use(
  (phanhoi) => phanhoi,
  (loi) => {
    return Promise.reject(loi);
  }
);

export default ketNoiApi;
