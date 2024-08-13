import React, {useEffect} from 'react';
import Directory, {CollectionType, dataType, PageType, ResultArr} from "../utils/helper/DirFormatter";

const DirectoryMapper = ({data}: { data : ResultArr }) => {
    console.log(data)
    return<>
        { data.map((single) => <DirCollection single={single} />) }
    </>
};

export default DirectoryMapper;



const DirCollection = ({single}:{single:CollectionType | PageType}) => {
    const [isChildVisible, setIsChildVisible] = React.useState(false);

    return <div className={`flex flex-col`}>
                   <span className={`${single.type === "COLLECTION" ? "bg-amber-200" : "bg-sky-200"}`} onClick={() => {
                       setIsChildVisible(prev => !prev)
                   }}>
                        {single.name}
                   </span>
        {
            "children" in single && isChildVisible ?
                <span className={`pl-5`}>
                                 <DirectoryMapper data={single.children as ResultArr}/>
                            </span> : ""
        }
    </div>
}