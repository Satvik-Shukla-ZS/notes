import React, { useContext, useEffect, useRef, useState } from 'react'
import Directory, {
  CollectionType,
  dataType,
  DirCollectionProps,
  DirectoryMapperProps,
  PageType,
  ResultArr
} from '../utils/helper/DirFormatter'
import { FaRegStickyNote } from 'react-icons/fa'
import { CiFolderOn } from 'react-icons/ci'
import COLLECTION_API from '../utils/api/collection'
import { sign } from 'crypto'

const DirectoryMapper: React.FC<DirectoryMapperProps> = ({ data, setinputColl }) => {
  const [notes, setNotes] = useState<ResultArr>([])

  useEffect(() => {
    setNotes(data)
    console.log(data)
  }, [notes])

  const handleAddData = (res: CollectionType) => {
    setNotes((prevNotes) => [
      ...prevNotes,
      {
        ...res,
        type: 'COLLECTION',
        children: []
      }
    ])
  }

  return (
    <>
      {notes.map((single) => (
        <DirCollection key={single.id} single={single} />
      ))}
    </>
  )
}

const DirCollection: React.FC<DirCollectionProps> = ({ single, children }) => {
  const [isChildVisible, setIsChildVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [takeinputColl, setinputColl] = useState(false)

  const handleKeyDown = (parent: number | null) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputRef.current && inputRef.current.value.trim() !== '') {
      console.log(inputRef.current.value)
      setinputColl(false)
      COLLECTION_API.ADD({ name: inputRef.current.value, parent }).then((res) => {
        console.log(res)
      })
    }
  }

  return (
    <div className={`flex flex-col`}>
      <span
        className={`${single.type === 'COLLECTION' ? 'bg-amber-200' : 'bg-sky-200'}`}
        onClick={() => setIsChildVisible((prev) => !prev)}
      >
        <div
          className='flex flex-row items-center p-2'
          onClick={() => {
            setinputColl((prev) => !prev)
          }}
        >
          {single.type === 'COLLECTION' ? <CiFolderOn /> : <FaRegStickyNote />}
          <span className='px-2'>{single.name}</span>
        </div>
      </span>
      {'children' in single && isChildVisible && (
        <span className={`pl-5`}>
          <DirectoryMapper data={single.children as ResultArr} setinputColl={setinputColl} takeinputColl={takeinputColl} />
        </span>
      )}
      {takeinputColl && <input ref={inputRef} onKeyDown={handleKeyDown(single.id)} className='p-2 m-2' />}
    </div>
  )
}

export default DirectoryMapper

// export default DirCollection;
