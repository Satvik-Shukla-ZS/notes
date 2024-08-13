import {
  REQ_ADD_COLLECTION,
  REQ_ALL_COLLECTION_BY_PARENT_ID,
  REQ_COLLECTION_BY_ID,
  REQ_COLLECTION_BY_PARENT_ID,
  RES_ADD_COLLECTION,
  RES_ALL_COLLECTION_BY_PARENT_ID,
  RES_COLLECTION_BY_ID,
  RES_COLLECTION_BY_PARENT_ID
} from '../types/api/collection_Types'
import axiosInstance from './axiosInterface'

const ADD = async (data: REQ_ADD_COLLECTION): Promise<RES_ADD_COLLECTION> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/add', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error adding the collection: ${error}`)
  }
}

const Get_By_ID = async (data: REQ_COLLECTION_BY_ID): Promise<RES_COLLECTION_BY_ID> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/getById', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the collection by id: ${error}`)
  }
}

const Get_By_Parent_ID = async (data: REQ_COLLECTION_BY_PARENT_ID): Promise<RES_COLLECTION_BY_PARENT_ID> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/getByParentId', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the collection by parent id: ${error}`)
  }
}

const Get_All_By_Parent_ID = async (data: REQ_ALL_COLLECTION_BY_PARENT_ID): Promise<RES_ALL_COLLECTION_BY_PARENT_ID> => {
  try {
    return await axiosInstance()
      .post('/auth/collection/getAllByParentId', data)
      .then((res) => res.data)
  } catch (error) {
    throw new Error(`Error fetching the collection by parent id: ${error}`)
  }
}

const COLLECTION_API = {
  ADD,
  Get_By_ID,
  Get_By_Parent_ID,
  Get_All_By_Parent_ID
}
export default COLLECTION_API
