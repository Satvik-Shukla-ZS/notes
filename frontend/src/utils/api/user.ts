import { RES_USER_PROFILE } from '../types/api/user'
import axiosInstance from './axiosInterface'

const GET_PROFILE = async (): Promise<RES_USER_PROFILE> => {
  try {
    return await axiosInstance()
      .post('/auth/user/profile')
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching popular movies: ${error}`)
  }
}

const USER_API = {
  GET_PROFILE
}
export default USER_API
