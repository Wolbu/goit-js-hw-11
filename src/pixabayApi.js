import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28346013-699c033653f8987279bd73509';
const imageType = 'photo';
const orientation = 'horizontal';

export default async function pixabayApi(query, page) {
    try {
        const response = await axios({
          url: BASE_URL,
          params: {
            key: API_KEY,
            q: query,
            orientation: orientation,
            image_type: imageType,
            safesearch: true,
            page: page,
            per_page: 40,
          },
        });
        return response;
      } catch (error) {
        console.log(error);
      }
    }