import React, {PropsWithChildren, useEffect} from 'react';
import {dataType} from "../helper/DirFormatter";
import dataArr from "../../components/data";
import COLLECTION_API from "../api/collection";

export const DataContext = React.createContext<{
    data:dataType,
    handleAddData(     dataParent: dataType): void
    setData: React.Dispatch<React.SetStateAction<dataType>>
}>({
    data : [] ,
    handleAddData:()=>{},
    setData:()=>{}
})

const DataProvider = ({children}:PropsWithChildren) => {
    const [data,setData] = React.useState<dataType>(dataArr as dataType);

    const handleAddData = (dataParent: dataType) => {
        const dataMap = new Map(data.map(item => [`${item.id}-${item.type}`, item]));

        dataParent.forEach(item => {
            dataMap.set(`${item.id}-${item.type}`, item);
        });

        const uniqueData = Array.from(dataMap.values());
        console.log(dataParent);
        console.log(uniqueData);
        setData(uniqueData);
    };

    useEffect(() => {
        COLLECTION_API.Get_All_By_Parent_ID({parent:null}).then((res)=>{
            if(res.code === 200){
                console.log(res.data)
                setData(res.data)
            }
        })
    }, []);

    return (
        <DataContext.Provider value={{data,handleAddData,setData}}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;