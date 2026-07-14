import { baseApi } from "./baseApi"


const breedapi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAllBreed:builder.query({
            query:() =>({
                url : "/admin/getAllBreeds",
                method:"GET"
            }),
            providesTags:["BreedUser"]
        })
    })

})


export const {useGetAllBreedQuery} = breedapi