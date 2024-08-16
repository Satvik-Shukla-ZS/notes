import React, {FormEvent, useContext, useEffect, useState} from 'react'
import Directory, {dataType, ResultArr} from "../utils/helper/DirFormatter";
import DirectoryMapper from "./DirectoryMapper";
import useDirCreator from "../utils/hooks/useDirCreator";
import {OptionsContext} from "../utils/Context/OptionsProvider";

const Sidebar = () => {
    const {dirData , DataAdder , onAdd , handleAddData} = useDirCreator()

    const Options = useContext(OptionsContext)

    useEffect(() => {
        const handleClose = () =>{
            if(!Options) return
            Options.onClose();
        }

        document.addEventListener("click", handleClose)

        return ()=>{
            document.removeEventListener("click", handleClose)
        }
    }, []);

  return (
      <div className='sidebar h-screen bg-white w-fit flex flex-col p-2 gap-4 px-5 min-w-[250px]'>
          <div className={`flex justify-center p-2`}>
              <span className={`text-2xl text-gray-700`}>Notes</span>
          </div>

          <div>
              <button className={`w-full flex rounded-md justify-center items-center p-2 bg-slate-200 text-slate-500`} onClick={()=>{onAdd("COLLECTION")}}><i className="fi fi-rr-square-plus"></i></button>
          </div>

          <div className={`flex flex-col overflow-auto h-full`}>
                <DirectoryMapper data={(new Directory(dirData)).createObject()} />
                <DataAdder handleAdd={(e)=>{handleAddData(e,null)}} />
          </div>
      </div>
  )
}

export default Sidebar
