export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  lessonsCount: number;
  duration: string;
  rating: number;
  students: number;
  progress?: number | null;
  color: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string | null;
  completed: boolean;
  type: "video" | "quiz" | "reading";
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const demoCourses: Course[] = [
  {
    id: "react-mastery",
    title: "React Mastery: From Components to Architecture",
    description: "Build production-ready React applications with hooks, context, performance optimization, and modern patterns used by top engineering teams.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    category: "Frontend",
    lessonsCount: 24,
    duration: "12h 30m",
    rating: 4.8,
    students: 3847,
    progress: 65,
    color: "hsl(24 95% 53%)",
    lessons: [
      { id: "r1", title: "Why React? Mental Models", duration: "18:00", completed: true, type: "video" },
      { id: "r2", title: "JSX Deep Dive", duration: "22:00", completed: true, type: "video" },
      { id: "r3", title: "Component Patterns Quiz", duration: "10:00", completed: true, type: "quiz" },
      { id: "r4", title: "Hooks: useState & useEffect", duration: "35:00", completed: false, type: "video" },
      { id: "r5", title: "Custom Hooks Workshop", duration: "28:00", completed: false, type: "video" },
      { id: "r6", title: "Context & State Management", duration: "40:00", completed: false, type: "video" },
    ],
  },
  {
    id: "python-data-science",
    title: "Python for Data Science & Machine Learning",
    description: "Master Python's data ecosystem — NumPy, Pandas, Matplotlib, and scikit-learn. Build real ML models from scratch and deploy them.",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop",
    category: "Data Science",
    lessonsCount: 32,
    duration: "18h 15m",
    rating: 4.9,
    students: 5213,
    progress: 30,
    color: "hsl(174 62% 38%)",
    lessons: [
      { id: "p1", title: "Python Refresher", duration: "25:00", completed: true, type: "video" },
      { id: "p2", title: "NumPy Fundamentals", duration: "32:00", completed: true, type: "video" },
      { id: "p3", title: "Pandas DataFrames", duration: "38:00", completed: false, type: "video" },
      { id: "p4", title: "Data Cleaning Quiz", duration: "12:00", completed: false, type: "quiz" },
      { id: "p5", title: "Visualization with Matplotlib", duration: "30:00", completed: false, type: "video" },
    ],
  },
  {
    id: "typescript-pro",
    title: "TypeScript: Type System Wizardry",
    description: "Go beyond basics — generics, conditional types, mapped types, and advanced patterns that make your code bulletproof and self-documenting.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    category: "Languages",
    lessonsCount: 18,
    duration: "9h 45m",
    rating: 4.7,
    students: 2156,
    color: "hsl(262 60% 55%)",
    lessons: [
      { id: "t1", title: "Type Inference Deep Dive", duration: "20:00", completed: false, type: "video" },
      { id: "t2", title: "Generics Masterclass", duration: "35:00", completed: false, type: "video" },
      { id: "t3", title: "Conditional Types", duration: "28:00", completed: false, type: "video" },
    ],
  },
  {
    id: "system-design",
    title: "System Design for Engineers",
    description: "Learn to design scalable systems — load balancers, databases, caching, message queues. Ace your system design interviews with confidence.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    category: "Backend",
    lessonsCount: 20,
    duration: "14h 00m",
    rating: 4.9,
    students: 4102,
    color: "hsl(220 25% 20%)",
    lessons: [
      { id: "s1", title: "Scaling 101", duration: "22:00", completed: false, type: "video" },
      { id: "s2", title: "Database Choices", duration: "30:00", completed: false, type: "video" },
    ],
  },
  {
    id: "algo-patterns",
    title: "Algorithm Patterns & Problem Solving",
    description: "Master the 14 essential coding patterns — sliding window, two pointers, BFS/DFS, and more. Solve problems faster with structured thinking.",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop",
    category: "Algorithms",
    lessonsCount: 28,
    duration: "16h 20m",
    rating: 4.8,
    students: 3421,
    progress: 12,
    color: "hsl(152 60% 42%)",
    lessons: [
      { id: "a1", title: "Two Pointers Pattern", duration: "25:00", completed: true, type: "video" },
      { id: "a2", title: "Sliding Window", duration: "28:00", completed: false, type: "video" },
    ],
  },
  {
    id: "devops-essentials",
    title: "DevOps: Docker, CI/CD & Cloud Deploy",
    description: "Containerize apps with Docker, automate with GitHub Actions, and deploy to AWS/GCP. The full DevOps pipeline from code to production.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
    category: "DevOps",
    lessonsCount: 22,
    duration: "11h 50m",
    rating: 4.6,
    students: 1893,
    color: "hsl(45 93% 47%)",
    lessons: [
      { id: "d1", title: "Docker Fundamentals", duration: "30:00", completed: false, type: "video" },
      { id: "d2", title: "Compose & Multi-container", duration: "25:00", completed: false, type: "video" },
    ],
  },
];

export const demoQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does the useState hook return in React?",
    options: [
      "A single state value",
      "An array with state value and setter function",
      "An object with state and dispatch",
      "A promise that resolves to the state",
    ],
    correctAnswer: 1,
    explanation: "useState returns an array with exactly two elements: the current state value and a function to update it. This is why we use array destructuring: const [count, setCount] = useState(0).",
  },
  {
    id: 2,
    question: "Which hook should you use for side effects in React?",
    options: ["useMemo", "useCallback", "useEffect", "useRef"],
    correctAnswer: 2,
    explanation: "useEffect is designed for side effects like data fetching, subscriptions, and DOM manipulations. It runs after the component renders.",
  },
  {
    id: 3,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search halves the search space with each step, giving it O(log n) time complexity. This is why it requires a sorted input.",
  },
  {
    id: 4,
    question: "What does 'key' prop help React with in lists?",
    options: [
      "Styling list items",
      "Identifying which items changed, added, or removed",
      "Sorting the list automatically",
      "Adding accessibility labels",
    ],
    correctAnswer: 1,
    explanation: "Keys help React identify which items in a list have changed. Without stable keys, React may re-render items unnecessarily or lose component state.",
  },
];
