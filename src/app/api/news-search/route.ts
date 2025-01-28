// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   const { ticker } = await req.json();

//   const messages = [
//     { role: "system", content: "You are a helpful assistant that provides news about stock options." },
//     { role: "user", content: `Provide the latest options-related news for ${ticker}. Focus on recent market movements, analyst opinions, and any significant events that might affect options trading for this stock. Only send the news items, no intro, no outro, no commentary. ` }
//   ];

//   try {
//     const response = await fetch('https://api.perplexity.ai/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer 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`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         model: "llama-3.1-sonar-small-128k-online",
//         messages,
//         max_tokens: 1000,
//         temperature: 0.7,
//         return_citations: true
//       })
//     });

//     const data = await response.json();
//     console.log(JSON.stringify(data, null, 2));
//     const content = data.choices[0].message.content;

//     // Parse the content into news items (this is a simplified example)
//     const newsItems = content.split('\n\n').map((item: string) => {
//       const [title, ...contentParts] = item.split('\n');
//       return {
//         title,
//         content: contentParts.join('\n'),
//         url: '' // You might want to extract URLs from citations if available
//       };
//     });

//     return NextResponse.json({ news: newsItems });
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { ticker } = await req.json();

  const messages = [
    { role: "system", content: "You are a helpful assistant that provides news about stock options." },
    { role: "user", content: `Provide the latest options-related news for ${ticker}. Focus on recent market movements, analyst opinions, and any significant events that might affect options trading for this stock. Only send the news items, no intro, no outro, no commentary.` }
  ];

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages,
        max_tokens: 3000,
        temperature: 0.7,
        return_citations: true,
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                url: { type: "string", format: "uri" }
              },
              required: ["title", "content", "url"]
            }
          }
        }
      })
    });

//     const text = await response.text();
// console.log(text);
    

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));

    const content = data.choices[0].message.content;
    const citations = data.citations || [];

    // Parse the content into news items and include URLs from citations
    const newsItems = content.split('\n\n').map((item: string, index: number) => {
      const [title, ...contentParts] = item.split('\n');
      return {
        title: title.trim(),
        content: contentParts.join('\n').trim(),
        url: citations[index]?.url || ''
      };
    });

    return NextResponse.json({ news: newsItems });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}