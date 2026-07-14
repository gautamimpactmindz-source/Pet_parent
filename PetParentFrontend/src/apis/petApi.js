import { baseApi } from "./baseApi";
const petApi = baseApi.injectEndpoints({
   endpoints:(builder)=>({
    getPets:builder.query({
        query:()=>({
            url:'/pet/getMyPets',
            method: 'GET',
        })
    })
   })
})

export const {useGetPetsQuery} = petApi;