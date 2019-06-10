import axios from 'axios';

const host = 'http://backend.izba.iep.megiteam.pl/';
const baseURL = `${host}api/`;

export default axios.create({
  baseURL,
});
