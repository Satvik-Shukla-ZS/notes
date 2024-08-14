import {REQ_ADD_PAGE, REQ_RENAME_PAGE, RES_ADD_PAGE, RES_RENAME_PAGE} from '../types/api/collection_Types'
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

const RENAME = async (data: REQ_RENAME_PAGE): Promise<RES_RENAME_PAGE> => {
  try {
    return await axiosInstance()
        .post('/auth/page/rename', data)
        .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error renaming the page: ${error}`)
  }
}

const SAVE = async (data: REQ_RENAME_PAGE): Promise<RES_RENAME_PAGE> => {
  try {
    return await axiosInstance()
        .post('/auth/page/save', data)
        .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error saving the page: ${error}`)
  }
}

const PAGES_API = {
  ADD,
  RENAME
}
export default PAGES_API
