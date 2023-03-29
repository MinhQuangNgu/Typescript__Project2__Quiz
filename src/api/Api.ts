import axios from 'axios'
export const postApi = async (url:string,data:object,header:object,interObject:any) => {
    return (await axios.post<typeof interObject>(url,data,{
        headers:{
            ...header
        }
    })) 
}

export const getApi = async (url:string,header:object,interObject:any) => {
    return   (await axios.get<typeof interObject>(url,{
        headers:{
            ...header
        }
    }))
}

export const deleteApi = async (url:string,header:object,interObject:any) => {
    return (await axios.delete<typeof interObject>(url,{
        headers:{
            ...header
        }
    }))
}

export const putApi = async (url:string,data:object,header:object,interObject:any) => {
    return (await axios.put<typeof interObject>(url,data,{
        headers:{
            ...header
        }
    }))
}