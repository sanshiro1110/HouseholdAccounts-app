import axios from 'axios';

const axiosFirestore = axios.create({
  baseURL: 'https://firestore.googleapis.com/v1/projects/vueapp1-c024a/databases/(default)/documents',
});

export default axiosFirestore;
