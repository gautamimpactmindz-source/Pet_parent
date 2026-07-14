import { baseApi } from "./baseApi";

export const adminuserapi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
getAllUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ slug, status }) => ({
        url: `/admin/user/status/${slug}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: ({ slug }) => ({
        url: `/admin/user/delete/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"]
    }),

    })
})

export const {useGetAllUsersQuery,useUpdateUserStatusMutation,useDeleteUserMutation} = adminuserapi