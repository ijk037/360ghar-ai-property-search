export async function parseQuery(userQuery) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it",
        messages: [
          {
            role: "system",
            content: `
You are a real estate filter parser for properties in Gurgaon, India.

Extract search filters from the user's query and return ONLY a valid JSON object with:

{
  "bhk": number or null,
  "maxPrice": number or null,
  "minPrice": number or null,
  "location": string or null,
  "amenities": [],
  "preferences": []
}

Examples:

User: "2BHK in Sector 50 under 80 lakhs near school"

Return:
{
  "bhk": 2,
  "maxPrice": 80,
  "minPrice": null,
  "location": "Sector 50",
  "amenities": ["school nearby"],
  "preferences": []
}

Return ONLY JSON.
No markdown.
No explanation.
`
          },
          {
            role: "user",
            content: userQuery
          }
        ]
      })
    }
  );

  console.log("Status:", response.status);
  console.log("OK:", response.ok);

  const data = await response.json();
  console.log("Full Response:", data);

  if (!data.choices) {
    console.log("API Error:", data);
    throw new Error(JSON.stringify(data, null, 2));
  }

  const text = data.choices[0].message.content;

  return JSON.parse(
    text.replace(/```json|```/g, "").trim()
  );
}


export async function generateSummary(
  property,
  userQuery
) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "360 Ghar AI Search"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful real estate assistant. Write a warm 2-3 line summary explaining why a property matches the buyer's search."
          },
          {
            role: "user",
            content: `
Buyer Query:
${userQuery}

Property:
${property.bhk} BHK
Location: ${property.location}
Price: ${property.priceLabel}
Area: ${property.area} sq ft
Amenities: ${property.amenities.join(", ")}

Explain why this property is a good match.
`
          }
        ]
      })
    }
  );

  const data = await response.json();

  return data.choices[0].message.content;
}



export async function generateFollowUpQuestion(
  filters,
  results
) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "360 Ghar AI Search"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "system",
            content:
              "Generate ONE short helpful follow-up question for a home buyer. Maximum 20 words."
          },
          {
            role: "user",
            content: `
Filters:
${JSON.stringify(filters)}

Matching Properties:
${results.map(
  p =>
    `${p.title} in ${p.location}`
).join(", ")}
`
          }
        ]
      })
    }
  );

  const data = await response.json();

  return data.choices[0].message.content;
}