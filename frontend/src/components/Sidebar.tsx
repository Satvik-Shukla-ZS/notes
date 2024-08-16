import React, { createContext, useEffect, useRef, useState } from 'react'
import DirectoryMap from './DirectoryMapper'
import Directory, { dataType, ResultArr } from '../utils/helper/DirFormatter'
import { FaPlus } from "react-icons/fa";
import COLLECTION_API from '../utils/api/collection'
// import data from './data'

const Sidebar = () => {
  const [takeinputColl, setinputColl] = useState(false)
  const inputContext = createContext(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [data, setData] = useState<ResultArr>([])

  useEffect(() => {
    COLLECTION_API.Get_All_By_Parent_ID({ parent: null }).then((res) => {
      setData(res.data)
    })
  }, [])
  const dataArr = new Directory(data as dataType).createObject()
  const handleAddCollection = () => {
    setinputColl(true)
  }

  const handleKeyDown = (parent: number | null) => (e: React.KeyboardEvent) => {
    if (inputRef.current && e.key === 'Enter' && inputRef.current.value === '') {
      setinputColl(false)
    } else if (e.key === 'Enter' && inputRef.current && inputRef.current.value.trim() !== '') {
      console.log(inputRef.current.value)
      setinputColl(false)
      COLLECTION_API.ADD({ name: inputRef.current.value, parent }).then((res) => {
        console.log(res)
      })
    }
  }

  return (
    <>
      <div className='sidebar h-screen bg-slate-100 w-1/5 p-2'>
      <h1 className='text-center text-2xl font-extrabold font- mt-12 mb-4' >NoteBlock</h1>
        <inputContext.Provider value={takeinputColl}>
          <div className='flex justify-center py-2 text-3xl'>
            <FaPlus
              onClick={handleAddCollection}
              className='bg-slate-300 rounded-lg text-2xl hover:bg-slate-400 cursor-pointer py-1 w-full mb-2'
            />
          </div>
          <hr className='border-2 border-black mb-4' />
          <DirectoryMap />
          {takeinputColl && (
            <input
              ref={inputRef}
              onKeyDown={handleKeyDown(null)}
              placeholder='Enter the name of Collection'
              className='p-2 rounded-md w-full bg-slate-300 focus-within:'
            />
          )}
        </inputContext.Provider>
      </div>
    </>
  )
}

export default Sidebar
