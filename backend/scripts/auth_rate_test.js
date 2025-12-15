import axios from 'axios';

const url = 'http://localhost:4000/api/v1/auth/login';

(async () => {
  for (let i = 1; i <= 25; i++) {
    try {
      const res = await axios.post(url, { email: `notfound${i}@example.com`, password: 'badpass' });
      console.log(i, res.status, res.data);
    } catch (err) {
      if (err.response) {
        console.log(i, err.response.status, err.response.data, 'retry-after:', err.response.headers['retry-after']);
      } else {
        console.log(i, 'ERR', err.message);
      }
    }
  }
})();