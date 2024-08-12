import response from "./responseHandler";

const handlePropTypes = (props : object , keys : string[]) =>{
    for(let key of keys){
        if(!(key in props)) return [false , response.BAD_REQUEST(`${key} missing in request`) ]
    }
    return [true , {}]
}

export {handlePropTypes}