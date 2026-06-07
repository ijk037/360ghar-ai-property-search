export async function parseQuery(userQuery) {
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
        model: "google/gemma-3-27b-it:free", // ← fixed: added :free suffix
        messages: [
          {
            role: "system",
            content: `You are a real estate filter parser for properties in Gurgaon, India.

Extract search filters from the user's query and return ONLY a valid JSON object with these exact fields:
{
  "bhk": number or null,
  "maxPrice": number or null,
  "minPrice": number or null,
  "location": string or null,
  "amenities": [],
  "preferences": []
}

Example:
User: "2BHK in Sector 50 under 80 lakhs near school with sunlight"
Return:
{
  "bhk": 2,
  "maxPrice": 80,
  "minPrice": null,
  "location": "Sector 50",
  "amenities": ["school nearby", "sunlight"],
  "preferences": []
}

Return ONLY the JSON object. No markdown. No explanation. No backticks.`
          },
          {
            role: "user",
            content: userQuery
          }
        ]
      })
    }
  );

  const data = await response.json();

  if (!data.choices) {
    console.error("OpenRouter API Error:", data);
    throw new Error(data.error?.message || "API call failed");
  }

  const text = data.choices[0].message.content;
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}


export async function generateSummary(property, userQuery) {
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
        model: "google/gemma-3-27b-it:free", // ← fixed
        messages: [
          {
            role: "system",
            content:
              "You are a warm, helpful real estate assistant for 360 Ghar, an AI property platform in Gurgaon. Write exactly 2-3 sentences explaining why a specific property matches the buyer's search query. Be specific, reference actual property details, and sound genuinely helpful — not like a template."
          },
          {
            role: "user",
            content: `Buyer's search: "${userQuery}"

Property details:
- ${property.bhk} BHK, ${property.area} sq ft
- Location: ${property.location}
- Price: ${property.priceLabel}
- Floor: ${property.floor} of ${property.totalFloors}
- Facing: ${property.facing}
- Amenities: ${property.amenities.join(", ")}

Why does this property match the buyer's search?`
          }
        ]
      })
    }
  );

  const data = await response.json();
  return data.choices[0].message.content;
}


export async function generateFollowUpQuestion(filters, results) {
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
        model: "google/gemma-3-27b-it:free", // ← fixed
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant for a real estate platform. Generate ONE short, helpful follow-up question to help a buyer narrow their search. Maximum 20 words. No quotation marks around the question."
          },
          {
            role: "user",
            content: `Search filters used: ${JSON.stringify(filters)}
Properties found: ${results.map(p => `${p.bhk}BHK in ${p.location} at ${p.priceLabel}`).join(", ")}

Generate a helpful follow-up question.`
          }
        ]
      })
    }
  );

  const data = await response.json();
  return data.choices[0].message.content;
}
