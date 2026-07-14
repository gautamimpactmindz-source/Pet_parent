import { baseApi } from "./baseApi";

export const adminpetapi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
           getAllPets:builder.query({
        query:()=>({
            url:"/admin/pet",
            method:"GET"
        }),
        providesTags:["Pets"]
    }),
    })
})

export const {useGetAllPetsQuery} = adminpetapi