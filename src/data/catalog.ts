import type { IconName } from "@/data/icons";

export type Word = {
  id: string;
  word: string;
  hint: string;
  icon: IconName;
  syllables: string[];
  category: string;
};

export type TurnTone = "clear" | "ok" | "unclear";

export type TurnChoice = {
  text: string;
  tone: TurnTone;
  coach: string;
};

export type Turn = {
  id: string;
  title: string;
  scene: string;
  model: string;
  icon: IconName;
  choices: TurnChoice[];
};

export const SEED_WORDS: Word[] = [
  { id: "water", word: "water", hint: "A drink", icon: "GlassWater", syllables: ["wa", "ter"], category: "Needs" },
  { id: "help", word: "help", hint: "When you want support", icon: "HandHeart", syllables: ["help"], category: "Needs" },
  { id: "happy", word: "happy", hint: "A good feeling", icon: "Smile", syllables: ["hap", "py"], category: "Feelings" },
  { id: "sad", word: "sad", hint: "A hurt feeling", icon: "Frown", syllables: ["sad"], category: "Feelings" },
  { id: "tired", word: "tired", hint: "You need rest", icon: "Moon", syllables: ["ti", "red"], category: "Feelings" },
  { id: "calm", word: "calm", hint: "A quiet, steady feeling", icon: "Leaf", syllables: ["calm"], category: "Feelings" },
  { id: "book", word: "book", hint: "You read it", icon: "BookOpen", syllables: ["book"], category: "School" },
  { id: "pencil", word: "pencil", hint: "You write with it", icon: "Pencil", syllables: ["pen", "cil"], category: "School" },
  { id: "backpack", word: "backpack", hint: "It holds your things", icon: "Backpack", syllables: ["back", "pack"], category: "School" },
  { id: "clock", word: "clock", hint: "It tells the time", icon: "Clock", syllables: ["clock"], category: "School" },
  { id: "dog", word: "dog", hint: "A pet that barks", icon: "Dog", syllables: ["dog"], category: "Animals" },
  { id: "cat", word: "cat", hint: "A pet that meows", icon: "Cat", syllables: ["cat"], category: "Animals" },
  { id: "house", word: "house", hint: "Where you live", icon: "House", syllables: ["house"], category: "Places" },
  { id: "door", word: "door", hint: "You walk through it", icon: "DoorOpen", syllables: ["door"], category: "Places" },
  { id: "sun", word: "sun", hint: "It shines in the day", icon: "Sun", syllables: ["sun"], category: "Outside" },
  { id: "tree", word: "tree", hint: "A tall plant", icon: "TreeDeciduous", syllables: ["tree"], category: "Outside" },
  { id: "bus", word: "bus", hint: "A ride to school", icon: "Bus", syllables: ["bus"], category: "Going" },
  { id: "apple", word: "apple", hint: "A fruit", icon: "Apple", syllables: ["ap", "ple"], category: "Food" },
  { id: "food", word: "food", hint: "Something you eat", icon: "Utensils", syllables: ["food"], category: "Food" },
];

export const SEED_TURNS: Turn[] = [
  {
    id: "ask-water",
    title: "Ask for water",
    scene: "You are thirsty at lunch.",
    model: "Can I have water, please?",
    icon: "GlassWater",
    choices: [
      {
        text: "Can I have water, please?",
        tone: "clear",
        coach: "That request names what you want and says please.",
      },
      {
        text: "Water, please.",
        tone: "ok",
        coach: "People can understand that. You can also say: Can I have water, please?",
      },
      {
        text: "Give me that.",
        tone: "unclear",
        coach: "The other person may not know what you need. Try: Can I have water, please?",
      },
    ],
  },
  {
    id: "ask-help",
    title: "Ask for help",
    scene: "The work is hard and you want support.",
    model: "I need help, please.",
    icon: "HandHeart",
    choices: [
      {
        text: "I need help, please.",
        tone: "clear",
        coach: "That tells someone what you need.",
      },
      {
        text: "Help, please.",
        tone: "ok",
        coach: "That can work. A full sentence is: I need help, please.",
      },
      {
        text: "I can't.",
        tone: "unclear",
        coach: "That shows a feeling. If you want support, try: I need help, please.",
      },
    ],
  },
  {
    id: "greet",
    title: "Say hello",
    scene: "You meet a classmate.",
    model: "Hi. My name is {name}.",
    icon: "Smile",
    choices: [
      {
        text: "Hi. My name is {name}.",
        tone: "clear",
        coach: "That greeting says hello and your name.",
      },
      {
        text: "Hi.",
        tone: "ok",
        coach: "Hello works. You can also say your name.",
      },
      {
        text: "What?",
        tone: "unclear",
        coach: "If you want to greet someone, you can say hi and your name.",
      },
    ],
  },
  {
    id: "feeling",
    title: "Say a feeling",
    scene: "Someone asks how you feel. You need a rest.",
    model: "I feel tired.",
    icon: "Moon",
    choices: [
      {
        text: "I feel tired.",
        tone: "clear",
        coach: "You named the feeling in a full sentence.",
      },
      {
        text: "Tired.",
        tone: "ok",
        coach: "That gets the idea across. You can also say: I feel tired.",
      },
      {
        text: "I don't know.",
        tone: "ok",
        coach: "That is an honest answer. You can also name a feeling: I feel tired.",
      },
    ],
  },
  {
    id: "goodbye",
    title: "Say goodbye",
    scene: "It is time to go.",
    model: "Bye. See you later.",
    icon: "DoorOpen",
    choices: [
      {
        text: "Bye. See you later.",
        tone: "clear",
        coach: "That lets the other person know you are leaving.",
      },
      {
        text: "Bye.",
        tone: "ok",
        coach: "Short and clear. You can add: See you later.",
      },
      {
        text: "Say nothing.",
        tone: "unclear",
        coach: "You can also say bye so the other person knows you are leaving.",
      },
    ],
  },
];

export const CATEGORIES = ["Needs", "Feelings", "School", "Animals", "Places", "Outside", "Going", "Food", "Other"];

export function fillName(text: string, name: string) {
  return text.replaceAll("{name}", name || "friend");
}
