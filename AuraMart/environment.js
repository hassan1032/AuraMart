
const server = {
    dev: "http://localhost:5000", //localhost backend url
    prod: "https:"  //backend deployed url
}

const baseURL =
    process.env.NODE_ENV === "development" ? server.dev : server.prod;

export default baseURL;