USE learnspark;

-- Reset only learning content (do NOT delete users, so accounts persist)
DELETE FROM quiz_questions;
DELETE FROM lessons;
DELETE FROM courses;


INSERT INTO courses (id, title, description, image, category, lessons_count, duration, rating, students, progress, color) VALUES
('react-mastery', 'React Mastery: From Components to Architecture', 'Build production-ready React applications with hooks, context, performance optimization, and modern patterns used by top engineering teams.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop', 'Frontend', 4, '2h 10m', 4.8, 3847, 65, 'hsl(24 95% 53%)'),
('python-data-science', 'Python for Data Science & Machine Learning', 'Master Python''s data ecosystem — NumPy, Pandas, Matplotlib, and scikit-learn. Build real ML models from scratch and deploy them.', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop', 'Data Science', 4, '2h 40m', 4.9, 5213, 30, 'hsl(174 62% 38%)'),
('typescript-pro', 'TypeScript: Type System Wizardry', 'Go beyond basics — generics, conditional types, mapped types, and advanced patterns that make your code bulletproof and self-documenting.', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop', 'Languages', 2, '1h 30m', 4.7, 2156, NULL, 'hsl(262 60% 55%)'),
('node-backend-pro', 'Node.js Backend Pro: APIs & Auth', 'Build REST APIs with Express, handle errors, and secure endpoints with JWT concepts (prototype).', 'https://media.licdn.com/dms/image/v2/D4D12AQEdO_fcrn1sjg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1698927153522?e=2147483647&v=beta&t=NKn9v2VRG7ezkSSjbL_hIxUnvBFRIykJnXzcK4dbWRw', 'Backend', 5, '2h 30m', 4.7, 2150, 20, 'hsl(210 80% 55%)'),
('docker-devops-essentials', 'Docker & CI/CD Essentials', 'Containerize apps, understand images/containers, and get an overview of CI/CD workflows.', 'https://miro.medium.com/0*2tbstAdD84Y8HOAG', 'DevOps', 4, '1h 50m', 4.6, 1600, NULL, 'hsl(45 93% 47%)'),
('algo-patterns', 'Algorithm Patterns & Problem Solving', 'Master core algorithm patterns like sliding window, two pointers, BFS/DFS and more — with practical problem sets.', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop', 'Algorithms', 4, '2h 05m', 4.8, 2420, NULL, 'hsl(152 60% 42%)'),
('system-design', 'System Design for Engineers', 'Learn to design scalable systems: load balancers, databases, caching, and message queues. Prepare with real interview patterns.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop', 'Backend', 4, '2h 35m', 4.9, 1880, NULL, 'hsl(220 25% 20%)'),
('data-structures', 'Data Structures Mastery', 'Arrays, linked lists, stacks/queues, hash maps, trees and graphs — with guided exercises and explanations.', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop', 'Algorithms', 3, '1h 45m', 4.7, 1620, NULL, 'hsl(195 70% 40%)'),
('ml-practices', 'ML Practices: From Ideas to Models', 'Train, evaluate and improve ML models with practical workflows. Includes quizzes and conceptual checkpoints.', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop', 'Data Science', 4, '2h 20m', 4.6, 1730, NULL, 'hsl(285 60% 60%)');

INSERT INTO lessons (id, course_id, title, duration, completed, type, position) VALUES
('r1', 'react-mastery', 'Why React? Mental Models', '18:00', 1, 'video', 1),
('r2', 'react-mastery', 'JSX Deep Dive', '22:00', 1, 'video', 2),
('r3', 'react-mastery', 'Component Patterns Quiz', '10:00', 1, 'quiz', 3),
('r4', 'react-mastery', 'Hooks: useState & useEffect', '35:00', 0, 'video', 4),
('p1', 'python-data-science', 'Python Refresher', '25:00', 1, 'video', 1),
('p2', 'python-data-science', 'NumPy Fundamentals', '32:00', 1, 'video', 2),
('p3', 'python-data-science', 'Pandas DataFrames', '38:00', 0, 'video', 3),
('p4', 'python-data-science', 'Data Cleaning Quiz', '12:00', 0, 'quiz', 4),
('t1', 'typescript-pro', 'Type Inference Deep Dive', '20:00', 0, 'video', 1),
('t2', 'typescript-pro', 'Generics Masterclass', '35:00', 0, 'video', 2),
('n1', 'node-backend-pro', 'Express Routing Basics', '15:00', 1, 'video', 1),
('n2', 'node-backend-pro', 'Middleware & Error Handling', '25:00', 0, 'video', 2),
('n3', 'node-backend-pro', 'REST API Quiz', '10:00', 0, 'quiz', 3),
('n4', 'node-backend-pro', 'JWT Authentication (Concepts)', '20:00', 0, 'video', 4),
('n5', 'node-backend-pro', 'MySQL Data Access', '30:00', 0, 'video', 5),
('d1', 'docker-devops-essentials', 'Docker Fundamentals', '20:00', 0, 'video', 1),
('d2', 'docker-devops-essentials', 'Images vs Containers', '25:00', 0, 'video', 2),
('d3', 'docker-devops-essentials', 'Docker Compose Overview', '18:00', 0, 'video', 3),
('d4', 'docker-devops-essentials', 'CI/CD Overview Quiz', '12:00', 0, 'quiz', 4),
('a1', 'algo-patterns', 'Sliding Window Pattern', '18:00', 0, 'video', 1),
('a2', 'algo-patterns', 'Two Pointers Pattern', '22:00', 0, 'video', 2),
('a3', 'algo-patterns', 'BFS/DFS Foundations Quiz', '12:00', 0, 'quiz', 3),
('a4', 'algo-patterns', 'Putting It All Together', '25:00', 0, 'video', 4),
('s1', 'system-design', 'Scalability 101', '20:00', 0, 'video', 1),
('s2', 'system-design', 'Database Choices', '28:00', 0, 'video', 2),
('s3', 'system-design', 'Caching & Consistency Quiz', '14:00', 0, 'quiz', 3),
('s4', 'system-design', 'Message Queues & Backpressure', '26:00', 0, 'video', 4),
('ds1', 'data-structures', 'Arrays & Linked Lists', '16:00', 0, 'video', 1),
('ds2', 'data-structures', 'Stacks/Queues & Hash Maps', '24:00', 0, 'video', 2),
('ds3', 'data-structures', 'Trees: Traversals Quiz', '18:00', 0, 'quiz', 3),
('m1', 'ml-practices', 'Training & Evaluation Workflow', '25:00', 0, 'video', 1),
('m2', 'ml-practices', 'Feature Engineering Checkpoint Quiz', '12:00', 0, 'quiz', 2),
('m3', 'ml-practices', 'Model Selection & Tuning', '28:00', 0, 'video', 3),
('m4', 'ml-practices', 'Debugging ML Pipelines', '22:00', 0, 'video', 4);

INSERT INTO quiz_questions (id, question, options_json, correct_answer, explanation) VALUES
(1, 'What does the useState hook return in React?', JSON_ARRAY('A single state value', 'An array with state value and setter function', 'An object with state and dispatch', 'A promise that resolves to the state'), 1, 'useState returns an array with two elements: value and setter.'),
(2, 'Which hook should you use for side effects in React?', JSON_ARRAY('useMemo', 'useCallback', 'useEffect', 'useRef'), 2, 'useEffect is designed for side effects like API calls and subscriptions.'),
(3, 'What is the time complexity of binary search?', JSON_ARRAY('O(n)', 'O(log n)', 'O(n log n)', 'O(1)'), 1, 'Binary search halves the search interval each step, so O(log n).'),
(4, 'In Express, what does middleware do?', JSON_ARRAY('Only renders HTML', 'Transforms request/response and can end the request', 'Replaces the database', 'Compiles TypeScript'), 1, 'Middleware can modify request/response and decide whether to continue to the next handler.'),
(5, 'Which HTTP status code means "Created"?', JSON_ARRAY('200', '201', '204', '404'), 1, '201 is the conventional status code for a successful resource creation.'),
(6, 'JWT stands for:', JSON_ARRAY('Java JSON Web Token', 'JSON Web Token', 'Java Virtual Token', 'Jetty Web Token'), 1, 'JWT stands for JSON Web Token.'),
(7, 'A PRIMARY KEY in MySQL ensures that:', JSON_ARRAY('Values can be duplicated freely', 'Rows are optional', 'Each row is uniquely identifiable', 'Only NULL values are allowed'), 2, 'PRIMARY KEY guarantees uniqueness for each row.');

-- Users (auth persistence) - do NOT delete
-- Passwords (prototype):
--  - ayoub.ek@gmail.com => 12345 (admin)
--  - samir.ouh@gmail.com => client123
--  - atmane.mzn@gmail.com => pass1234
--  - amine.gnn@gmail.com => client456
INSERT INTO users (id, email, password_hash, role, name) VALUES
  (UUID(), 'ayoub.ek@gmail.com', '$2a$10$ceULndIOSKipuNo.8sfrfe9Q9ES0r0YFU.V58tyWyoIzA9s.R6SMm', 'admin', 'Admin'),
  (UUID(), 'samir.ouh@gmail.com', '$2a$10$t6AwTa3iyRMJyIVQQTdkEuq/eOlZLojLd4LE0XjTPdfR9dK855NuK', 'client', 'Client'),
  (UUID(), 'atmane.mzn@gmail.com', '$2a$10$lVpO2GsLqzIE0uYWTv/FfOK7VcxZLO60vQLxlm9Bl6zRCJxejRc/a', 'client', 'Client'),
  (UUID(), 'amine.gnn@gmail.com', '$2a$10$dGw4Tqx8waIKbAl7JmlcEuxQ8u6dXtmATeJfPofCEB1CRZiV7Iduq', 'client', 'Client')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  name = VALUES(name);

