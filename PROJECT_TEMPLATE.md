# Project Template

Use this template when adding new projects to projects.json

## Format:
```json
{
    "id": "UNIQUE_ID_NUMBER",
    "title": "Project Title",
    "company": "Company Name",
    "category": "CATEGORY_NAME",
    "icon": "EMOJI_ICON",
    "description": "Full project description explaining the work, goals, and impact.",
    "location": "City, Netherlands",
    "duration": "X months",
    "compensation": "€XXX/month",
    "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
    "status": "open"
}
```

## Field Definitions:

- **id**: Unique number as string (e.g., "13", "14", "15")
- **title**: Clear, descriptive project title
- **company**: Full company name
- **category**: Must match one of the filter categories:
  - Artificial Intelligence
  - Sustainability
  - Technology
  - Healthcare
  - Engineering
  - Data Science
  - Security
  - Urban Planning
  - Education
  - Energy
  - Marketing
- **icon**: Single emoji that represents the project
- **description**: 2-3 sentences explaining the project
- **location**: City name + ", Netherlands"
- **duration**: Format as "X months"
- **compensation**: Format as "€XXX/month"
- **skills**: Array of 3-6 relevant technical skills
- **status**: Always "open" for active projects

## How to Add a New Project:

1. Open `projects.json`
2. Copy the template above
3. Fill in all fields
4. Add a comma after the previous project's closing brace
5. Paste your new project before the closing bracket `]`
6. Save the file
7. Refresh the browse page

## Example:
```json
{
    "id": "13",
    "title": "Virtual Reality Training Simulator",
    "company": "SafetyFirst VR",
    "category": "Technology",
    "icon": "🥽",
    "description": "Develop immersive VR training modules for workplace safety procedures. Create realistic scenarios for emergency response training and evaluate learning outcomes.",
    "location": "Rotterdam, Netherlands",
    "duration": "8 months",
    "compensation": "€700/month",
    "skills": ["Unity", "VR Development", "C#", "3D Modeling"],
    "status": "open"
}
```

## Search & Filter System:

The search function searches across:
- Title
- Description
- Company name
- Category
- Location
- Skills

Filters work by category - only projects matching selected categories will show.
