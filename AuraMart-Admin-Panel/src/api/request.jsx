import { api } from "./api";
import { getToken } from "../auth/authToken";

// Helper: format errors consistently
const formatError = (error, defaultMessage = "Something went wrong") => ({
  message: error?.response?.data?.message || defaultMessage,
  status: error?.response?.status || 500,
});

// ✅ Generic request handler
export const request = async (config) => {
  try {
    const token = getToken();
    const isFormData = config.data instanceof FormData;

    const response = await api({
      ...config,
      headers: {
        ...(config.headers || {}),
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return [response.data, null];
  } catch (error) {
    return [null, formatError(error)];
  }
};

// ✅ File upload handler (can be merged into request if preferred)
// export const uploadFile = async (url, formData) => {
//   try {
//     const token = getToken();

//     const response = await api.post(url, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//     });

//     return [response.data, null];
//   } catch (error) {
//     return [null, formatError(error, "File upload failed")];
//   }
// };
