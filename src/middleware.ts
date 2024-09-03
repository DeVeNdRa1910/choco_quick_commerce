import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({token, req})=>{
      console.log("token", token);
      
      if(req.nextUrl.pathname.startsWith('/admin')){
        return token?.role === 'admin'
      }else{
        return true;
      }
    }
  }
});

// /admin  or /admin ke baad kuchh bhi route ho to baha ye middleware apply hona chiye
export const config = {
  matcher: ["/admin(/.*)?"],
}