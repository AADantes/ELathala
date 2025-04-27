// src/app/writingpage/data/writingData.ts

export const prompts: string[] = [
    "Write about a time when you surprised yourself with your own strength.",
    "If you could revisit one moment from your past, what would it be and why?",
    "Imagine meeting a version of yourself from 10 years in the future—what advice would you give them?",
    "Write about a habit you want to break and how it’s affected your life.",
    "What does happiness mean to you? Has your definition changed over time?",
  ];
  
  export const genres: string[] = [
    'Fiction',
    'Non-Fiction',
    'Poetry',
    'Journal Entry',
    'Creative Writing',
    'Memoir',
  ];
  
  export const genreTopics: { [key: string]: string[] } = {
    Fiction: [
      'Fantasy Worlds',
      'Superheroes',
      'Mystery',
      'Time Travel',
      'Alternate Realities',
    ],
    'Non-Fiction': [
      'Personal Growth',
      'True Stories',
      'History',
      'Self-Improvement',
      'Social Issues',
    ],
    Poetry: ['Love', 'Nature', 'Emotion', 'Dreams', 'Time'],
    Memoir: [
      'Life Lessons',
      'Family Stories',
      'Travel Experiences',
      'Overcoming Challenges',
      'Personal Milestones',
    ],
    'Creative Writing': [
      'Imagination Unleashed',
      'The Unknown',
      'What if...',
      'Inner Journeys',
      'Strange Adventures',
    ],
    'Journal Entry': [
      'Daily Reflections',
      'Personal Growth',
      'Current Events',
      'Dreams and Goals',
      'Thoughts on Society',
    ],
  };
  