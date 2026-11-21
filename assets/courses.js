// Course catalog. Edit this file to add, remove or change courses.
// The text of each lesson lives in assets/lessons/<course id>.js (titles there must match the ones below).
// Optional field: weeks (shown on the course page when set).
window.COURSES = [
  {
    id: "ai-introduction",
    track: "AI",
    title: "Artificial Intelligence – An Introduction",
    level: "Beginner",
    summary: "Understand what AI is, how it works and where it is useful, explained in plain language with no technical background needed.",
    outcomes: [
      "Explain what AI, machine learning and generative AI are",
      "Use AI tools effectively and write clear prompts",
      "Recognise AI's limits, risks and responsible-use issues"
    ],
    prerequisites: "None. If you can use a web browser, you're ready.",
    lessons: [
      "What is AI? Key ideas and a short history",
      "How machine learning works",
      "Generative AI and large language models",
      "What AI does well and where it fails",
      "Getting good results: prompting basics",
      "Bias, privacy and responsible use",
      "Where AI is heading and what to learn next"
    ]
  },
  {
    id: "intro-ai-agents",
    track: "AI",
    title: "Introduction to AI Agents",
    level: "Intermediate",
    summary: "Learn what AI agents are, how they differ from chatbots, and how they plan, use tools and take actions on your behalf.",
    outcomes: [
      "Describe how an AI agent is put together",
      "Explain how agents use tools, memory and instructions",
      "Judge when an agent is the right solution and when it is not"
    ],
    prerequisites: "Artificial Intelligence – An Introduction, or regular experience using AI chat tools.",
    lessons: [
      "From chatbots to agents",
      "Anatomy of an agent: model, instructions, tools and memory",
      "How agents plan and take actions",
      "Connecting agents to apps and data",
      "Single-agent and multi-agent designs",
      "Reliability, safety and human oversight",
      "Project: design an agent for a task of your choice"
    ]
  },
  {
    id: "automate-with-ai-agents",
    track: "AI",
    title: "Automate Your Tasks with AI Agents",
    level: "Intermediate",
    summary: "Put agents to work: find tasks worth automating, build a workflow and keep it reliable.",
    outcomes: [
      "Identify repetitive tasks that suit automation",
      "Design, build and test an agent-based workflow",
      "Keep a human in the loop and measure the time you save"
    ],
    prerequisites: "Introduction to AI Agents, or equivalent experience.",
    lessons: [
      "Finding tasks worth automating",
      "Designing a workflow step by step",
      "Building your first agent-powered automation",
      "Connecting to email, documents and spreadsheets",
      "Testing, error handling and fallbacks",
      "Keeping a human in the loop",
      "Project: automate a real task end to end"
    ]
  },
  {
    id: "aws-introduction",
    track: "Cloud",
    title: "AWS – An Introduction",
    level: "Beginner",
    summary: "Get to know Amazon Web Services: what the cloud is, the core services, and how to use them securely and affordably.",
    outcomes: [
      "Explain cloud computing and how AWS is organised globally",
      "Describe the core compute, storage, database and networking services",
      "Secure an account, control costs and monitor what you run"
    ],
    prerequisites: "None. Basic computer skills are enough.",
    lessons: [
      "What is cloud computing and what is AWS?",
      "Regions, Availability Zones and the global infrastructure",
      "Accounts, IAM and keeping things secure",
      "Compute: EC2, Lambda and containers",
      "Storage and databases",
      "Networking basics: VPC, subnets and security groups",
      "Cost, monitoring and next steps"
    ]
  },
  {
    id: "ai-on-aws",
    track: "Cloud",
    title: "AI on AWS",
    level: "Intermediate",
    summary: "Build AI applications on AWS: foundation models with Amazon Bedrock, your own data, agents, pre-built AI services and custom models.",
    outcomes: [
      "Choose the right AWS AI service for a given problem",
      "Call foundation models and ground them in your own data",
      "Plan a secure, cost-aware production deployment"
    ],
    prerequisites: "AWS – An Introduction and Artificial Intelligence – An Introduction, or equivalent experience.",
    lessons: [
      "The AWS AI landscape",
      "Amazon Bedrock: foundation models and your first call",
      "Prompting, guardrails and responsible AI on Bedrock",
      "Retrieval-augmented generation with Knowledge Bases",
      "Building agents on AWS",
      "Pre-built AI services: vision, documents, language and speech",
      "Training and deploying models with Amazon SageMaker",
      "Security, cost and going to production"
    ]
  }
];
