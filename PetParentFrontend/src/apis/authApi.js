import { baseApi } from "./baseApi";

const authapi = baseApi.injectEndpoints({
    endpoints:(builder)=>({

        signUpUser:builder.mutation({
            query:(credentials)=>({
                url:'/auth/signup',
                method:'POST',
                body:credentials
            })
        }),
        loginUser:builder.mutation({
            query:(credentials)=>({
                url:'/auth/login',
                method:"POST",
                body:credentials
            })
        }),
        forgetPassword:builder.mutation({
            query:(email)=>({
                url:'/auth/forgotPassword',
                method:"POST",
                body:email
            })
        }),
        resetPassword:builder.mutation({
        
            query:({credentials,rstoken})=>({
                url:`/auth/resetPassword/${rstoken}`,
                method:"POST",
                body:credentials
            })
        }),
        googleAuth:builder.mutation({
         query:(credentials)=>({
            url:'/auth/googleAuth',
            method:"POST",
            body:credentials
         })
        })
    })
})
export const {useSignUpUserMutation,useLoginUserMutation,useForgetPasswordMutation,useResetPasswordMutation,useGoogleAuthMutation} = authapi