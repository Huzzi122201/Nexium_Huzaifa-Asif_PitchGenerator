import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const allParams = Object.fromEntries(requestUrl.searchParams.entries());
  
  console.log('Test route hit with URL:', requestUrl.href);
  console.log('All URL parameters:', allParams);
  
  return NextResponse.json({
    url: requestUrl.href,
    params: allParams,
    message: 'Test route working'
  });
} 