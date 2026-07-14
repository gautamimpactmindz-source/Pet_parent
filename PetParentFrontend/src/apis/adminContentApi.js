import { baseApi } from "./baseApi";

export const admincontentapi  = baseApi.injectEndpoints({
    endpoints:(builder)=>({
         createContent:builder.mutation({
      query:(credentials)=>({
        url:"/admin/content/create",
        method:"POST",
        body:credentials
      }),
      invalidatesTags:["Content"]
    }),

    deleteContent:builder.mutation({
      query:({slug})=>({
        url:`/admin/content/remove/${slug}`,
        method:"PATCH"
      }),
      invalidatesTags:["Content"]
    }),

    updateContent:builder.mutation({
      query:({slug,credentials})=>({
        url:`/admin/content/edit/${slug}`,
        method:"PATCH",
        body:credentials
      }),
      invalidatesTags:["Content"]
    }),

    getSingleContent:builder.query({
      query:(slug)=>({
        url:`/admin/content/get/${slug}`,
        method:"GET"
      })
    }),

    getAllContent:builder.query({
         query:()=>({
          url:"/admin/content/get",
          method:"GET"
         }),
         providesTags:["Content"]
    }),
    })
})
export const{useCreateContentMutation,useDeleteContentMutation,useUpdateContentMutation,useGetSingleContentQuery,useGetAllContentQuery} = admincontentapi