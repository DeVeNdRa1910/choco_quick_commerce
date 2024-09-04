'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient(){
  return new QueryClient();
}

function getQueryClient(){
  if(typeof window === 'undefined'){
    // we are on server , koi problem nahi new instance provide
    return makeQueryClient()
  }
  // we are on client component, first check instance of query is available or not if not then only create new instance and provide
  if(!browserQueryClient){
    browserQueryClient = makeQueryClient()
    return browserQueryClient;
  }
}

const queryClient = getQueryClient();

export function QueryProvider({children}:{children: ReactNode}){
  return (
    <QueryClientProvider client={queryClient!}>
      {children}
    </QueryClientProvider>
  )
}