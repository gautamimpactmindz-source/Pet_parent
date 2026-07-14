import { baseApi } from "./baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
   logoutAdmin:builder.mutation({
    query:()=>({
      url:'/admin/logout',
      method:'POST'
    })
   }),

    getCount: builder.query({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
    }),

   
 

   
  })
});

export const {
  useLoginAdminMutation,
  useGetCountQuery,
  
  

  useLogoutAdminMutation
} = adminApi;
