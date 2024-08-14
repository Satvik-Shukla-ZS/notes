import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import PAGES_API from "../utils/api/pages";

const PageViewer = () => {
    const {collId , pageId} = useParams()
    const [initialData, setInitialData] = useState<string>()
    const [isReadOnly, setIsReadOnly] = useState(true)
    const [value, setValue] = React.useState("**Hello world!!!**");
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false)

    useEffect(() => {
        PAGES_API
    }, []);

    console.log(collId , pageId)

    return (
        <div className={`p-2 m-2 rounded-md bg-white h-full flex flex-col gap-2`}>
            <div>
                <button className={`bg-slate-100 min-w-[80px] rounded-md text-xs px-2 py-1`} onClick={()=>{setIsReadOnly(prev=>!prev)}}>{ isReadOnly ? "Read Only" : "Edit" }</button>
            </div>

            {
                isReadOnly ? (
                    <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
                ):(
                    <MDEditor
                        value={value}
                        onChange={(val)=>setValue(val ?? "")}
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                        }}
                        preview="edit"
                    />
                )
            }
        </div>
    );
};

export default PageViewer;