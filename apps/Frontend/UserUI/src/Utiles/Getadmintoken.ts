import axios from "axios"
import { backend_url } from "../../config"

export const Getadmintoken = async ()=> {
    try {
        const response = await axios.get(`${backend_url}userAuth/getadmininfo`,{withCredentials: true})
        console.log(response)

        return response.data.token
    } catch (error) {
        console.log(error)
    }
}