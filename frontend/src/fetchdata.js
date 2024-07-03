import axios from "axios";

const fetchdata = async (url) => {
  try {
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
      console.log(error.response.data);
      return error.response.data;
  }
};

export default fetchdata;
