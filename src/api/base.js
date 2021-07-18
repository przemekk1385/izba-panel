import axios from "axios";

const host = "http://backend.iep.kalis.ovh/";
const baseURL = `${host}api/`;

export default axios.create({
  baseURL,
});
