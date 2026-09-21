import type { CEFRLevel, QuizQuestion } from "../types/book";

export interface LevelUpQuiz {
  toLevel: CEFRLevel;
  passFraction: number;
  questions: QuizQuestion[];
}

// The "big quiz" a child takes after finishing every book in a level, to
// unlock the next one. Bigger than a single book's quiz (drawing on all
// of that level's books) and requires a real pass mark, not just
// participation - keyed by the level you're leveling up FROM. Only
// levels with a next level that actually has books get an entry (B1 has
// none yet since B2 is still empty).
export const LEVEL_UP_QUIZZES: Partial<Record<CEFRLevel, LevelUpQuiz>> = {
  A1: {
    toLevel: "A2",
    passFraction: 0.75,
    questions: [
      {
        id: "a1-1",
        question: "In 'The Red Ball', what does Max lose?",
        options: [
          { id: "ball", label: "A ball", emoji: "⚽", correct: true },
          { id: "shoe", label: "A shoe", emoji: "👟", correct: false },
          { id: "hat", label: "A hat", emoji: "🎩", correct: false },
        ],
      },
      {
        id: "a1-2",
        question: "In 'My Family', who likes to read a book?",
        options: [
          { id: "mother", label: "The mother", emoji: "👩", correct: true },
          { id: "father", label: "The father", emoji: "👨", correct: false },
          { id: "sister", label: "The sister", emoji: "👧", correct: false },
        ],
      },
      {
        id: "a1-3",
        question: "What does the word 'MY' tell us?",
        options: [
          { id: "color", label: "A color", emoji: "🎨", correct: false },
          { id: "mine", label: "Something belongs to you", emoji: "🙋", correct: true },
          { id: "number", label: "A number", emoji: "🔢", correct: false },
        ],
      },
      {
        id: "a1-4",
        question: "In 'Zoe and the Animal Homes', where do camels live?",
        options: [
          { id: "ocean", label: "In the ocean", emoji: "🌊", correct: false },
          { id: "desert", label: "In the desert", emoji: "🏜️", correct: true },
          { id: "forest", label: "In the forest", emoji: "🌲", correct: false },
        ],
      },
      {
        id: "a1-5",
        question: "In 'Zoe and the Animal Homes', where do fish live?",
        options: [
          { id: "ocean", label: "In the ocean", emoji: "🌊", correct: true },
          { id: "sky", label: "In the sky", emoji: "☁️", correct: false },
          { id: "desert", label: "In the desert", emoji: "🏜️", correct: false },
        ],
      },
      {
        id: "a1-6",
        question: "In 'Ruby's Picnic Basket', what is Ruby packing for?",
        options: [
          { id: "party", label: "A birthday party", emoji: "🎂", correct: false },
          { id: "picnic", label: "A picnic", emoji: "🧺", correct: true },
          { id: "trip", label: "A trip", emoji: "✈️", correct: false },
        ],
      },
      {
        id: "a1-7",
        question: "\"What DOES she need?\" - we use 'does' when we ask about...",
        options: [
          { id: "one", label: "One person (he/she/it)", emoji: "🙋", correct: true },
          { id: "many", label: "Many people", emoji: "👨‍👩‍👧‍👦", correct: false },
          { id: "me", label: "Yourself", emoji: "🪞", correct: false },
        ],
      },
      {
        id: "a1-8",
        question: "Which little word tells us what something IS like? (Max IS happy)",
        options: [
          { id: "is", label: "is", emoji: "✅", correct: true },
          { id: "the", label: "the", emoji: "📄", correct: false },
          { id: "and", label: "and", emoji: "➕", correct: false },
        ],
      },
    ],
  },
  A2: {
    toLevel: "B1",
    passFraction: 0.75,
    questions: [
      {
        id: "a2-1",
        question: "In 'A Day at the Park', who climbed over the fence to find the ball?",
        options: [
          { id: "mia", label: "Mia", emoji: "👧", correct: true },
          { id: "tom", label: "Tom", emoji: "👦", correct: false },
          { id: "dog", label: "The dog", emoji: "🐶", correct: false },
        ],
      },
      {
        id: "a2-2",
        question: "In 'A Day at the Park', what did Mia and Tom eat for lunch?",
        options: [
          { id: "pizza", label: "Pizza", emoji: "🍕", correct: false },
          { id: "sandwiches", label: "Sandwiches", emoji: "🥪", correct: true },
          { id: "soup", label: "Soup", emoji: "🍲", correct: false },
        ],
      },
      {
        id: "a2-3",
        question: "In 'Sam and the Four Seasons', when do leaves turn orange and fall down?",
        options: [
          { id: "spring", label: "Spring", emoji: "🌸", correct: false },
          { id: "summer", label: "Summer", emoji: "☀️", correct: false },
          { id: "autumn", label: "Autumn", emoji: "🍂", correct: true },
        ],
      },
      {
        id: "a2-4",
        question: "In 'Sam and the Four Seasons', why do new leaves grow in spring?",
        options: [
          { id: "cold", label: "Because it gets colder", emoji: "❄️", correct: false },
          { id: "warmer", label: "Because the sun is warmer", emoji: "🌞", correct: true },
          { id: "rain", label: "Because it never rains", emoji: "🌧️", correct: false },
        ],
      },
      {
        id: "a2-5",
        question: "In 'Leo Grows a Sunflower', what did Leo plant first?",
        options: [
          { id: "seed", label: "A tiny seed", emoji: "🌰", correct: true },
          { id: "sprout", label: "A sprout", emoji: "🌱", correct: false },
          { id: "flower", label: "A flower", emoji: "🌻", correct: false },
        ],
      },
      {
        id: "a2-6",
        question: "In 'Leo Grows a Sunflower', what happened right after Leo watered the soil?",
        options: [
          { id: "bloom", label: "The sunflower bloomed", emoji: "🌻", correct: false },
          { id: "sprout", label: "A tiny sprout appeared", emoji: "🌱", correct: true },
          { id: "seed", label: "He planted the seed", emoji: "🌰", correct: false },
        ],
      },
      {
        id: "a2-7",
        question: "In 'A Day at the Park', a little dog wanted a \"piece\" of their sandwich. What does \"piece\" mean?",
        options: [
          { id: "small-part", label: "A small part of something", emoji: "🧩", correct: true },
          { id: "whole-thing", label: "The whole thing", emoji: "🥪", correct: false },
          { id: "plate", label: "A plate", emoji: "🍽️", correct: false },
        ],
      },
      {
        id: "a2-8",
        question: "Which season comes right after summer?",
        options: [
          { id: "winter", label: "Winter", emoji: "☃️", correct: false },
          { id: "autumn", label: "Autumn", emoji: "🍂", correct: true },
          { id: "spring", label: "Spring", emoji: "🌸", correct: false },
        ],
      },
    ],
  },
};
