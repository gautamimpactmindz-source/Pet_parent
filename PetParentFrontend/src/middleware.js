import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  const admintoken = request.cookies.get("adminaccessToken")?.value;
  const urftoken = request.cookies.get("refreshToken")?.value;
  const adrftoken = request.cookies.get("adminrefreshToken")?.value;


  const { pathname } = request.nextUrl;
  
  // Admin login redirect
  if (pathname === "/admin" && admintoken) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }


if(pathname.startsWith("/admin") && pathname !=="/admin/login"){
  if(admintoken){
     return NextResponse.next();

  }
 
  if(!admintoken && adrftoken ){
    try{
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/refreshToken`,
          {
            method: "POST",
            headers: {
              cookie: request.headers.get("cookie") || "",
            },
          }
        );
        const data = await response.json();
        const {status} = data;
        if(status){
          return NextResponse.next();
        }
        console.log(data);
    }catch(err){
      console.log(err);
       return NextResponse.redirect(
          new URL("/admin/login", request.url)
        );
    }

  }
  else{
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }
}





  // Protect user routes
  if (pathname.startsWith("/home") && !token) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }



  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/admin/users/:path*", "/admin/dashboard/:path*", "/admin/pets/:path*", "/admin/content/:path*", "/admin/settings/:path*"],
};
