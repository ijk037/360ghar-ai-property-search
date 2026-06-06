# 360 Ghar AI Property Search Assistant



## Overview



An AI-powered property search prototype built for the 360 Ghar Software Developer Intern Assignment.



Users can describe their ideal home in natural language, and the application uses OpenRouter LLMs to convert the query into structured filters, rank matching properties, and generate personalized property recommendations.



---



## Features



### Natural Language Search



Example:



"2BHK in Sector 50 under 80 lakhs with good sunlight near school"



The query is parsed into structured filters:



* BHK

* Budget

* Location

* Amenities

* Preferences



---



### Smart Property Cards



Each property card displays:



* BHK type

* Area

* Location

* Price

* 360° image placeholder

* AI-style match reason badge



---



### AI Property Summary



Clicking a property opens a modal and generates a personalized AI explanation of why the property matches the user's requirements.



---



### Bonus Feature



AI-powered follow-up question generation that helps refine the search and create a conversational experience.



---



## Tech Stack



* React

* Vite

* OpenRouter API

* JavaScript

* CSS



---



## Model Choice



google/gemma-3-27b-it:free



Chosen for strong instruction following, reliable JSON generation, and good performance on natural-language-to-structured-data tasks.



---



## Architecture



Frontend-only React application.



Components:



* SearchBar

* PropertyCard

* PropertyModal

* MatchBadge

* FollowUpQuestion



Utilities:



* Query Parsing

* Property Summary Generation

* Follow-up Question Generation



Data:



* Mock Gurgaon property dataset



---



## Setup



1. Clone repository

2. Install dependencies



npm install



3. Create .env



VITE_OPENROUTER_KEY=your_key



4. Start development server



npm run dev



---



## Prompt Design Notes



* Used a strict JSON-only system prompt for property filter extraction.

* Explicitly defined expected output fields to reduce hallucinations.

* Removed markdown formatting from model responses before parsing.

* Kept summary prompts short and focused to avoid verbose responses.

* Tested structured prompting versus free-form prompting and found structured prompts produced significantly more reliable filtering.



