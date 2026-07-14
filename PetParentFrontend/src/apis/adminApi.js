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

    getCount: builder.query({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ slug, status }) => ({
        url: `/admin/users/status/${slug}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: ({ slug }) => ({
        url: `/admin/users/delete/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getAllPets: builder.query({
      query: () => ({
        url: "/admin/pet",
        method: "GET",
      }),
      providesTags: ["Pets"],
    }),

    createContent: builder.mutation({
      query: (credentials) => ({
        url: "/admin/content/create",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Content"],
    }),

    deleteContent: builder.mutation({
      query: ({ slug }) => ({
        url: `/admin/content/remove/${slug}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Content"],
    }),

    updateContent: builder.mutation({
      query: ({ slug, credentials }) => ({
        url: `/admin/content/edit/${slug}`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["Content"],
    }),

    getSingleContent: builder.query({
      query: (slug) => ({
        url: `/admin/content/get/${slug}`,
        method: "GET",
      }),
    }),

    getAllContent: builder.query({
      query: () => ({
        url: "/admin/content/get",
        method: "GET",
      }),
      providesTags: ["Content"],
    }),

    addBreed: builder.mutation({
      query: (credentials) => ({
        url: "/admin/addBreed",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Breed"],
    }),

    getAllBreeds: builder.query({
      query: () => ({
        url: "/admin/getAllBreeds",
        method: "GET",
      }),
      providesTags: ["Breed"],
    }),

    deleteBreed: builder.mutation({
      query: (slug) => ({
        url: `/admin/breed/remove/${slug}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Breed"],
    }),

    updateBreed: builder.mutation({
      query: ({ slug, credentials }) => ({
        url: `/admin/breed/update/${slug}`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Breed", id: slug }, // invalidate single breed
        "Breed", // invalidate list
      ],
    }),

    getSingleBreed: builder.query({
      query: (slug) => ({
        url: `/admin/breed/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "Breed", id: slug }, // tag per slug
      ],
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useGetCountQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetAllPetsQuery,
  useGetAllContentQuery,
  useCreateContentMutation,
  useDeleteContentMutation,
  useUpdateContentMutation,
  useGetSingleContentQuery,
  useAddBreedMutation,
  useGetAllBreedsQuery,
  useDeleteBreedMutation,
  useUpdateBreedMutation,
  useGetSingleBreedQuery,
} = adminApi;
