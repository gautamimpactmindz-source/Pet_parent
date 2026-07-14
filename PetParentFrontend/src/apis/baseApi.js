import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}api`,
  credentials: 'include',

 
});


const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result?.error?.status === 401 &&
    result?.error?.data?.message === "Unauthorized"
  ) {
    console.log("Access token expired, trying refresh...");

    // 🔥 Detect if admin route
    const isAdmin = typeof window !== "undefined" &&
                    window.location.pathname.startsWith("/admin");

    const refreshUrl = isAdmin
      ? "/admin/refreshToken"
      : "/auth/refreshToken";

    const refreshResult = await rawBaseQuery(
      {
        url: refreshUrl,
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      console.log("Refresh success, retrying original request...");
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh failed");

      
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
 tagTypes: ["Users","Pets","Content","BreedUser"],
  endpoints: () => ({}),
});