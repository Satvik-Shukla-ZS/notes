import { REQ_ADD_PAGE, RES_ADD_PAGE} from '../types/api/collection_Types'
import axiosInstance from './axiosInterface'

const ADD = async (data: REQ_ADD_PAGE): Promise<RES_ADD_PAGE> => {
  try {
    return await axiosInstance()
      .post('/auth/page/add', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error adding the page: ${error}`)
  }
}

const PAGES_API = {
  ADD
}
export default PAGES_API
