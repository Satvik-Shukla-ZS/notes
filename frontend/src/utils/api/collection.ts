import { REQ_ADD_COLLECTION, RES_ADD_COLLECTION } from '../types/api/collection'
import axiosInstance from './axiosInterface'

const ADD = async (data: REQ_ADD_COLLECTION): Promise<RES_ADD_COLLECTION> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/add', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching popular movies: ${error}`)
  }
}

const COLLECTION_API = {
  ADD
}
export default COLLECTION_API
