
const server = {
    dev: "https://auramart-backend-vl5j.onrender.com", //localhost backend url
    prod: "https:"  //backend deployed url
}

const baseURL =
    process.env.NODE_ENV === "development" ? server.dev : server.prod;

export default baseURL;