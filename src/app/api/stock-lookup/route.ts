import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  console.log('Received query:', query);

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const url = `https://www.portfoliovisualizer.com/symbol-lookup?query=${encodeURIComponent(query)}`;

  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'priority': 'u=1, i',
        'referer': 'https://www.portfoliovisualizer.com/monte-carlo-simulation',
        'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
      },
    });

    console.log('Response status:', response.status);

    const text = await response.text();
    console.log('Response text:', text);

    if (!text) {
      return NextResponse.json({ error: 'Empty response from external API' }, { status: 500 });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      // Return the raw text if it's not JSON
      return new NextResponse(text, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (error:any) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json({ error: 'Failed to fetch stocks', details: error.message }, { status: 500 });
  }
}