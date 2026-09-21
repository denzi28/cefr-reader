import type { CEFRLevel, QuizQuestion } from "../types/book";

// Every Big Quiz question needs an explanation - unlike a per-book quiz,
// a child can come back to review exactly which questions they missed
// (see LevelQuizReviewPage), and "you got it wrong" without saying why
// isn't a real review.
export interface LevelUpQuizQuestion extends QuizQuestion {
  explanation: string;
}

export interface LevelUpQuiz {
  toLevel: CEFRLevel;
  passFraction: number;
  questions: LevelUpQuizQuestion[];
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
    // These test the grammar and vocabulary the A1 books taught, applied
    // to a fresh sentence or question each time - not "what happened in
    // the book" recall, and never a question that hands the answer to
    // itself (e.g. spelling out the target word in the question text).
    // The correct option's position is deliberately varied across
    // questions (never always first) so "always tap the top option"
    // can't pass the quiz on its own.
    questions: [
      {
        id: "a1-1",
        question: "Choose the correct sentence.",
        options: [
          { id: "right", label: "My sister is happy.", emoji: "🔵", correct: true },
          { id: "wrong1", label: "My sister are happy.", emoji: "🟢", correct: false },
          { id: "wrong2", label: "My sister am happy.", emoji: "🟠", correct: false },
        ],
        explanation:
          "We use 'is' with one person or thing, like 'my sister'. 'Are' is for more than one, and 'am' is only used with 'I'.",
      },
      {
        id: "a1-2",
        question: "Which word means something belongs to YOU?",
        options: [
          { id: "you", label: "you", emoji: "👉", correct: false },
          { id: "it", label: "it", emoji: "📦", correct: false },
          { id: "my", label: "my", emoji: "🙋", correct: true },
        ],
        explanation: "'My' shows that something belongs to you, like 'my book' or 'my family'.",
      },
      {
        id: "a1-3",
        question: "Complete the question: '___ does he need for the trip?'",
        options: [
          { id: "who", label: "Who", emoji: "🙋", correct: false },
          { id: "what", label: "What", emoji: "❓", correct: true },
          { id: "when", label: "When", emoji: "⏰", correct: false },
        ],
        explanation: "'What' asks about a thing (like what he needs). 'Who' asks about a person, and 'When' asks about time.",
      },
      {
        id: "a1-4",
        question: "Choose the correct word: 'The book is ___ the table.'",
        options: [
          { id: "on", label: "on", emoji: "📖", correct: true },
          { id: "in", label: "in", emoji: "📦", correct: false },
          { id: "at", label: "at", emoji: "📍", correct: false },
        ],
        explanation: "We use 'on' when something is resting on top of a surface, like a book on a table.",
      },
      {
        id: "a1-5",
        question: "Which sentence is correct?",
        options: [
          { id: "wrong1", label: "She like to swim.", emoji: "🔵", correct: false },
          { id: "wrong2", label: "She liking to swim.", emoji: "🟢", correct: false },
          { id: "right", label: "She likes to swim.", emoji: "🟠", correct: true },
        ],
        explanation: "After 'she' or 'he', we add -s to the verb: 'likes'. 'Like' and 'liking' aren't correct here.",
      },
      {
        id: "a1-6",
        question: "Which word describes weather with no water in it at all?",
        options: [
          { id: "wet", label: "wet", emoji: "💧", correct: false },
          { id: "dry", label: "dry", emoji: "🏜️", correct: true },
          { id: "cold", label: "cold", emoji: "❄️", correct: false },
        ],
        explanation: "'Dry' means there's no water at all. 'Wet' means full of water, and 'cold' is about temperature.",
      },
      {
        id: "a1-7",
        question: "Which little word do we use to ask about a PLACE?",
        options: [
          { id: "what", label: "What", emoji: "❓", correct: false },
          { id: "where", label: "Where", emoji: "📍", correct: true },
          { id: "who", label: "Who", emoji: "🙋", correct: false },
        ],
        explanation: "'Where' asks about a place. 'What' asks about a thing, and 'who' asks about a person.",
      },
      {
        id: "a1-8",
        question: "Complete the command: '___ up! It's time for school.'",
        options: [
          { id: "wakes", label: "Wakes", emoji: "🔵", correct: false },
          { id: "waking", label: "Waking", emoji: "🟢", correct: false },
          { id: "wake", label: "Wake", emoji: "🟠", correct: true },
        ],
        explanation: "Commands use the plain verb with no -s and no -ing, like 'Wake up!' - not 'Wakes' or 'Waking'.",
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
        explanation: "The story says Mia climbed over the fence to find the ball after Tom kicked it over.",
      },
      {
        id: "a2-2",
        question: "In 'A Day at the Park', what did Mia and Tom eat for lunch?",
        options: [
          { id: "pizza", label: "Pizza", emoji: "🍕", correct: false },
          { id: "sandwiches", label: "Sandwiches", emoji: "🥪", correct: true },
          { id: "soup", label: "Soup", emoji: "🍲", correct: false },
        ],
        explanation: "They sat on a bench and had sandwiches and juice for lunch.",
      },
      {
        id: "a2-3",
        question: "In 'Sam and the Four Seasons', when do leaves turn orange and fall down?",
        options: [
          { id: "spring", label: "Spring", emoji: "🌸", correct: false },
          { id: "summer", label: "Summer", emoji: "☀️", correct: false },
          { id: "autumn", label: "Autumn", emoji: "🍂", correct: true },
        ],
        explanation: "In autumn the weather gets cooler and the leaves turn orange and fall to the ground.",
      },
      {
        id: "a2-4",
        question: "In 'Sam and the Four Seasons', why do new leaves grow in spring?",
        options: [
          { id: "cold", label: "Because it gets colder", emoji: "❄️", correct: false },
          { id: "warmer", label: "Because the sun is warmer", emoji: "🌞", correct: true },
          { id: "rain", label: "Because it never rains", emoji: "🌧️", correct: false },
        ],
        explanation: "New leaves grow in spring because the sun gets warmer, which helps plants grow.",
      },
      {
        id: "a2-5",
        question: "In 'Leo Grows a Sunflower', what did Leo plant first?",
        options: [
          { id: "seed", label: "A tiny seed", emoji: "🌰", correct: true },
          { id: "sprout", label: "A sprout", emoji: "🌱", correct: false },
          { id: "flower", label: "A flower", emoji: "🌻", correct: false },
        ],
        explanation: "The very first step was planting a tiny seed - the sprout and flower come later.",
      },
      {
        id: "a2-6",
        question: "In 'Leo Grows a Sunflower', what happened right after Leo watered the soil?",
        options: [
          { id: "bloom", label: "The sunflower bloomed", emoji: "🌻", correct: false },
          { id: "sprout", label: "A tiny sprout appeared", emoji: "🌱", correct: true },
          { id: "seed", label: "He planted the seed", emoji: "🌰", correct: false },
        ],
        explanation: "After watering, a tiny sprout appeared first - the sunflower only bloomed later.",
      },
      {
        id: "a2-7",
        question: "In 'A Day at the Park', a little dog wanted a \"piece\" of their sandwich. What does \"piece\" mean?",
        options: [
          { id: "small-part", label: "A small part of something", emoji: "🧩", correct: true },
          { id: "whole-thing", label: "The whole thing", emoji: "🥪", correct: false },
          { id: "plate", label: "A plate", emoji: "🍽️", correct: false },
        ],
        explanation: "'A piece' means a small part of something - Mia gave the dog a small piece, not the whole sandwich.",
      },
      {
        id: "a2-8",
        question: "Which season comes right after summer?",
        options: [
          { id: "winter", label: "Winter", emoji: "☃️", correct: false },
          { id: "autumn", label: "Autumn", emoji: "🍂", correct: true },
          { id: "spring", label: "Spring", emoji: "🌸", correct: false },
        ],
        explanation: "The seasons go in order: spring, summer, autumn, winter - so autumn comes right after summer.",
      },
    ],
  },
};
