import {
  REQ_ADD_PAGE,
  REQ_GET_PAGE,
  REQ_RENAME_PAGE, REQ_SAVE_PAGE,
  RES_ADD_PAGE,
  RES_GET_PAGE,
  RES_RENAME_PAGE, RES_SAVE_PAGE
} from '../types/api/collection_Types'
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

const SAVE = async (data: REQ_SAVE_PAGE): Promise<RES_SAVE_PAGE> => {
  try {
    return await axiosInstance()
        .post('/auth/page/save', data)
        .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error saving the page: ${error}`)
  }
}

const GET = async (data: REQ_GET_PAGE): Promise<RES_GET_PAGE> => {
  try {
    return await axiosInstance()
        .post('/auth/page/getById', data)
        .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error saving the page: ${error}`)
  }
}

const PAGES_API = {
  ADD,
  RENAME,
  GET,
  SAVE
}
export default PAGES_API
