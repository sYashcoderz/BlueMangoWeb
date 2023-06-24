import Axios from 'axios'
const API_BASE = "http://localhost:8080";

export const compareProducts = async (data) => {
    try {
        console.log("hurrr",data);
        const response = await Axios.post(API_BASE + '/compare', data)
        if (response) {
            console.log("First API Service ==>>",response)
            return response.data
        } else {
            return null
        }
    } catch (error) {
        return { error }
    }
  }

