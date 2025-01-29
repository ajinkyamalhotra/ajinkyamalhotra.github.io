import { backend, binaryTrees, cp, docker, dsakit, frontend, kafka, leethub, linkedList, redis } from '../assets';
import { python, sql, django, css, git, html, javascript, mongodb, nodejs, reactjs, tailwind, typescript, } from '../assets';

export const resumeLink = "https://drive.google.com/file/d/1x4-tvVjyN37nGlHNsDJz0ckmpLMkyhI3/preview";

export const aboutMe = "Hello, I'm Aayush, a dedicated Full Stack Engineer at Listed (OpeninApp), thriving in the dynamic startup environment. My journey here has been incredibly rewarding, allowing me to take ownership of projects and experience rapid professional growth through continuous learning.\nDriven by a passion for problem-solving and Leetcoding, I've achieved a Guardian badge (2187 rating) and represented my college at the ICPC 2023 Regionals. With over 550 days of consistent practice on LeetCode, I'm deeply committed to refining my skills and optimizing solutions.\nMy curiosity for exploring new technologies has led me to diverse projects, including crafting Chrome extensions, developing Python modules, and creating engaging web app games and full-stack applications. Each project presents a unique opportunity for me to expand my technical repertoire and push the boundaries of innovation.\nLet's connect and explore opportunities to collaborate on exciting ventures together!"

export const skills = [
    {title: "Competitive Programmer", icon: cp}, 
    {title: "FrontEnd Developer", icon: frontend}, 
    {title: "Backend Developer", icon: backend}, 
    // {title: "AWS Solutions Architect", icon: aws}
];

export const frameworks = [
    {title: 'React', icon: reactjs, invert: false }, 
    {title: 'Node.js', icon: nodejs, invert: true }, 
    {title: 'Tailwind', icon: tailwind, invert: false }, 
    {title: 'Django', icon: django, invert: true }, 
    {title: 'Git', icon: git, invert: false },
    {title: 'Docker', icon: docker, invert: false }, 
    {title: 'Kafka', icon: kafka, invert: true }, 
    // {title: 'Spring Boot', icon: springboot, invert: false }, 
]

export const languages = [
    {title: 'Python', icon: python, invert: false }, 
    // {title: 'C++', icon: cpp, invert: false }, 
    // {title: 'C', icon: c, invert: false }, 
    // {title: 'Java', icon: java, invert: false }, 
    {title: 'HTML', icon: html, invert: false }, 
    {title: 'CSS', icon: css, invert: false }, 
    {title: 'Javascript', icon: javascript, invert: false }, 
    {title: 'TypeScript', icon: typescript, invert: false }, 
    {title: 'SQL', icon: sql, invert: true }, 
    {title: 'MongoDB', icon: mongodb, invert: false },
    {title: 'Redis', icon: redis, invert: false }
];

export const websites = [
    {
        title: 'VIT Grievance Portal', 
        description: 'A website designed to give students a platform to raise their concerns, problems and doubts to the college administration and authorities. This includes separate pages for students, teachers and admins.', 
        stack: [reactjs, tailwind, typescript, nodejs, mongodb, redis],
        link: 'https://vitb-grievances.aayush65.com',
        source: "https://github.com/Aayush65/Grievance-Portal"
    },
    {
        title: 'Crypto Trend', 
        description: 'A Cryptocurrency tracking website integrated with a price drop alert system and real-time data. It also enhances the visualisation of price trends with the help of real-time graphical trends. Some of the features include data persistency, price drop/rise alert system and watchlist tracking.', 
        stack: [reactjs, tailwind, typescript, nodejs, mongodb],
        link: 'https://cryptotrend.aayush65.com',
        source: "https://github.com/Aayush65/CryptoTrend"
    },
    {
        title: 'Flip Game', 
        description: 'A Memory based Game made up of fliped tiles which has some image on their rear side. One has to match cards bearing identical images with least amount of flips to win the game. Also integrated with a real-time leaderboard.', 
        stack: [reactjs, tailwind, typescript, nodejs, mongodb],
        link: 'https://flipgame.aayush65.com',
        source: "https://github.com/Aayush65/flipgame"
    },
    {
        title: 'Wordle2', 
        description: "A game inspired by the NYT's Wordle Game. You can show your command of English vocabulary and also learn in this game.",
        stack: [reactjs, tailwind, typescript],
        link: 'https://wordle2.aayush65.com',
        source: "https://github.com/Aayush65/Wordle2"
    },
    {
        title: 'Sudoku', 
        description: 'A Sudoku Website which can generate all levels of unfilled sudokus to play with alongwith the ability to complete any possible unfilled sudoku. It also helps the player along the way by highlighting possible conflicts while cell filling.', 
        stack: [reactjs, tailwind, typescript],
        link: 'https://sudoku.aayush65.com',
        source: "https://github.com/Aayush65/sudoku"
    },
    {
        title: 'Portfolio', 
        description: 'My humble portfolio website', 
        stack: [reactjs, tailwind, typescript],
        link: 'https://aayush65.com',
        source: "https://github.com/Aayush65/Portfolio"
    },
]

export const projects = [
    {
        title: "DSA Kit",
        description: "DSA Kit is a comprehensive collection of Python modules that implement various data structures and algorithms from scratch. The primary goal of this project is to provide efficient and well-optimized implementations of fundamental data structures and algorithms. Some of the data structures include Segment Trees, Linked Lists, Binary Trees, Union Find, etc.",
        stack: [python],
        source: "https://pypi.org/project/dsakit/",
        media: dsakit
    },
    {
        title: "LeetHub 2.0",
        description: "A Chrome extension to streamline the process of uploading accurately solved LeetCode solutions to a personal GitHub repository, complete with appropriate naming and documentation. Also enhances the representation of a user's LeetCode achievements on GitHub and the visual appearance of GitHub's heatmap.",
        stack: [javascript, html, css, git],
        source: "https://github.com/Aayush65/LeetHub2",
        media: leethub
    },
    {
        title: "Binary Trees Module",
        description: "A Python module containing Binary Tree implementation and all the functions necessary for its operations and implementation.",
        stack: [python],
        source: "https://github.com/Aayush65/BinaryTreesModule",
        media: binaryTrees
    },
    {
        title: "Linked List Module",
        description: "This Python module contains 12 important and best space and time-efficient functions for dealing with Linked Lists.",
        stack: [python],
        source: "https://github.com/Aayush65/LinkedListModule",
        media: linkedList
    },

]