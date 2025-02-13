// js/data.js

// Personal and site-wide data
const siteData = {
    name: "Ajinkya Malhotra",
    jobTitle: "Software Engineer @ ARM",
    tagline: "I code.",
    about: [
        `I am a passionate software engineer with a knack for solving complex problems and crafting creative solutions. With a Masters degree in Computer Science from Texas A&M University, I have built a strong foundation in software engineering, cloud computing, and automation. My career spans industry-leading companies like AWS and ARM, where I have worked on high-impact projects in cloud infrastructure, performance optimization, and CI/CD automation.`,

        `At AWS, I gained hands-on experience working on scalable, distributed systems and troubleshooting intricate cloud infrastructure challenges. Now, at ARM, I focus on optimizing cloud architectures, automating workflows, and enhancing system performance to push the limits of efficiency.`,

        `I have deep expertise in AWS, Python, Java, and Groovy, which I leverage to streamline CI/CD pipelines, enhance automation frameworks, and improve cloud performance. Whether it’s designing AI-powered solutions, automating large-scale infrastructure, or debugging mission-critical systems, I thrive on tackling difficult puzzles that push the boundaries of technology.`
    ],
    socialLinks: {
        github: "https://github.com/ajinkyamalhotra",
        linkedin: "https://www.linkedin.com/in/ajinkyamalhotra",
        email: "mailto:ajinkyamalhotra73@gmail.com"
    }
};


// Experience data
const experiences = [
    {
        type: "experience",
        link: "https://arm.com",
        period: "Jan 2024 - Present",
        title: "Software Engineer at ARM",
        description:
            "Working on Performance Models Productization team which handles external releases to various partners. Optimizing AWS infrastructure using various tools.",
        tags: [
            "✨ AWS",
            "✨ Jenkins",
            "✨ Groovy",
            "✨ Python",
            "Bash",
            "✨ Git",
        ],
    },
    {
        type: "experience",
        link: "https://arm.com",
        period: "May 2023 - Aug 2023",
        title: "Software Engineer Intern at ARM",
        description:
            "Worked on automating AWS pipeline, by managing AMIs updates, EC2 instances, and EBS Volumes. Accomplished automation of complex manually repetitive tasks using a variety of tools and improved overall operational efficiency.",
        tags: [
            "✨ AWS",
            "✨ Python",
            "✨ Boto3",
            "Terraform",
            "Packer",
            "Pytest",
        ],
    },
    {
        type: "experience",
        link: "https://aws.amazon.com/",
        period: "May 2020 - Jun 2022",
        title: "Cloud Support Engineer at AWS",
        description:
            "Applied advanced troubleshooting techniques to provide unique solutions to AWS customers. Drove multiple projects to improve internal support-related processes and overall customer experience. Worked on critical, highly complex customer problems that spanned throughout multiple AWS services.",
        tags: [
            "✨ AWS Lambda",
            "✨ AWS API Gateway",
            "✨ SNS/SQS",
            "EC2",
            "S3",
            "VPC",
            "Javascript",
            "Python",
        ],
    },
    {
        type: "resume",
        link: "resume.pdf",
        title: "View full Resume",
    },
];

// Project data
const projects = [
    {
        link: "https://github.com/ajinkyamalhotra/Steam-Game-Recommendation/",
        period: "Mar 2023 - May 2023",
        title: "Steam Game Recommendation",
        description:
            "Developed a video game recommendation engine utilizing Content-Based Filtering and VBPR algorithms. Successfully deployed the recommendation system which enhanced user engagement and satisfaction by streamlining the discovery process for games tailored to individual tastes.",
        tags: [
            "AWS Lambda",
            "Heroku",
            "Python",
            "HTML/CSS",
            "Bootstrap",
            "Git",
        ],
    },
    {
        link: "https://github.com/ajinkyamalhotra/Chess-Master",
        period: "Feb 2023 - Apr 2023",
        title: "Chess Master",
        description:
            "Designed a human vs CPU chess-like game and created a computer player, using Minimax algorithm. CPU player is optimized through Alpha-Beta pruning, Depth Limited Search, and Iterative Deepening Search.",
        tags: ["✨ Java", "Minimax", "DLS", "IDS"],
    },
    {
        link: "https://github.com/ajinkyamalhotra/Network-Optimization-using-Shortest-Path",
        period: "Nov 2022",
        title: "Network Optimization",
        description:
            "Designed a sparse (30000 total edges) and dense (5000000 total edges) random graph generator. Implemented Dijkstras without heap, with heap and Kruskals algorithm for performance comparison.",
        tags: ["✨ Java", "Dijkstras", "Heap", "Kruskals"],
    },
];
