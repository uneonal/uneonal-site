// Lessons for "Introduction to AI Agents".
// To add a video: paste the YouTube video ID into `video`.
window.LESSONS = window.LESSONS || {};
window.LESSONS["intro-ai-agents"] = [
  {
    title: "From chatbots to agents",
    video: "",
    intro: "What makes an AI agent different from the chatbots you already know.",
    body: [
      "A chatbot answers. You send a message, it replies, and the conversation waits for you. An AI agent acts. You give it a goal, and it decides what steps to take, uses tools to carry them out, looks at the results and keeps going until the job is done or it needs help.",
      { h: "The key difference" },
      "The difference is a loop. A chatbot is one question and one answer. An agent repeats a cycle of deciding, acting and observing, and the model itself chooses what to do at each step.",
      { h: "A spectrum, not a switch" },
      { ul: [
        "Chat: the model answers a prompt. You do the rest.",
        "Workflow: you define fixed steps in code, and the model handles individual steps such as classifying or drafting.",
        "Agent: the model decides the steps, picks tools and adapts as it learns more."
      ] },
      "More autonomy means more flexibility but also more cost, more variation and more ways to go wrong. A fixed workflow is often the better choice when the steps are known in advance.",
      { h: "An example" },
      "Ask a chatbot 'How do I reschedule my meeting?' and it explains. Ask an agent 'Move my Thursday meeting to next week and tell the attendees' and it can check your calendar, find a free slot, update the invite and send the message, provided it has been given those tools.",
      "Agents became practical because modern language models can follow instructions reliably and call tools, which means asking for a function to be run and reading what it returns."
    ],
    takeaways: [
      "Chatbots reply; agents pursue a goal in a loop of deciding, acting and observing.",
      "Workflows and agents sit on a spectrum of autonomy.",
      "Pick the simplest approach that solves the problem."
    ]
  },
  {
    title: "Anatomy of an agent: model, instructions, tools and memory",
    video: "",
    intro: "The four building blocks of almost every agent, and the loop that ties them together.",
    body: [
      "Most agents are built from the same four parts, wrapped in a small piece of code that runs the loop.",
      { h: "1. The model" },
      "The language model is the reasoning engine. It reads the situation and decides what to do next. Larger models usually reason better, while smaller ones are faster and cheaper, so the choice is a trade-off.",
      { h: "2. Instructions" },
      "The instructions, often called the system prompt, define the agent's role, goal, rules and tone. Good instructions say what the agent should do, what it must never do and when to ask for help.",
      { h: "3. Tools" },
      "Tools are functions the agent can call: search the web, query a database, read a file, send an email, run a calculation. Each tool is described to the model by a name, a plain-language description and the inputs it expects. The model chooses a tool and supplies the inputs, and your code actually runs it.",
      { h: "4. Memory" },
      { ul: [
        "Short-term memory: the conversation and tool results so far, held in the model's context window.",
        "Long-term memory: information stored outside the model, such as notes or a database, that the agent can look up later."
      ] },
      { h: "The loop" },
      { code: "while not done:\n    response = model(instructions, history, tool_descriptions)\n    if response.wants_tool:\n        result = run_tool(response.tool, response.arguments)\n        history.append(result)\n    else:\n        answer = response.text\n        done = True" },
      "Every agent framework, however fancy, is a more robust version of this loop."
    ],
    takeaways: [
      "An agent = model + instructions + tools + memory, run in a loop.",
      "The model chooses the tool; your code executes it.",
      "Clear instructions and well-described tools make a big difference to quality."
    ]
  },
  {
    title: "How agents plan and take actions",
    video: "",
    intro: "How an agent breaks a goal into steps and adapts when things do not go to plan.",
    body: [
      "Given a goal, an agent has to work out what to do. A common pattern is to alternate between reasoning and acting, often called the reason-and-act (ReAct) pattern.",
      { h: "Think, act, observe" },
      { ul: [
        "Think: decide what is needed next and why.",
        "Act: call a tool, or give a final answer.",
        "Observe: read the tool's result and update the plan."
      ] },
      { h: "A worked example" },
      "Goal: 'Summarise today's unread support emails and flag anything urgent.' The agent first calls a tool to fetch unread emails. It reads them, decides which look urgent, perhaps calls a tool to look up whether a sender is a high-value customer, then writes a summary with the urgent items at the top.",
      { h: "Planning" },
      "For larger goals an agent can first write a plan, a list of sub-tasks, and then work through it. If a step fails or reveals new information, it revises the plan instead of blindly continuing.",
      { h: "Knowing when to stop" },
      { ul: [
        "Success condition: the goal has clearly been met.",
        "Step limit: a maximum number of loops so a confused agent cannot run forever.",
        "Escalation: when blocked or unsure, stop and ask a person."
      ] },
      { h: "Limits to keep in mind" },
      "Each step costs time and money, and small mistakes can compound over many steps. Agents can also get stuck repeating themselves. Keeping tasks well-scoped and adding limits helps."
    ],
    takeaways: [
      "Agents alternate between thinking, acting and observing.",
      "Planning helps with big goals, and re-planning helps when things change.",
      "Always set step limits and a way to escalate to a human."
    ]
  },
  {
    title: "Connecting agents to apps and data",
    video: "",
    intro: "How agents reach the outside world safely: tools, APIs, shared standards and your own documents.",
    body: [
      "An agent is only as useful as the things it can reach. Connecting it to apps and data is where most of the value, and most of the risk, lives.",
      { h: "Tools and function calling" },
      "Most models support 'function calling' or 'tool use'. You describe each tool, the model returns a structured request to call it, your code runs it and returns the result. Behind the scenes a tool is usually a call to an ordinary API.",
      { h: "Shared standards" },
      "The Model Context Protocol (MCP) is an open standard for connecting AI applications to tools and data sources, so a connector built once can work across different agents and products. Using a standard saves you from writing custom integration code for every pairing.",
      { h: "Giving agents your knowledge" },
      "Agents often need information that is not in the model, such as company policies or product manuals. Retrieval lets the agent search your documents and bring the relevant passages into its context before answering. This is often called retrieval-augmented generation, or RAG.",
      { h: "Permissions and safety" },
      { ul: [
        "Least privilege: give the agent only the access it needs. Start read-only.",
        "Separate credentials: never put secrets in prompts. Keep them in your code or a secrets manager.",
        "Scope the data: a tool that can read everything is a bigger risk than one that can read a single folder.",
        "Confirm risky actions: sending, deleting and paying should need approval."
      ] }
    ],
    takeaways: [
      "Tools let agents act; function calling is how models request them.",
      "Standards such as MCP reduce custom integration work.",
      "Retrieval connects agents to your own knowledge.",
      "Start with minimal, read-only access and add permissions deliberately."
    ]
  },
  {
    title: "Single-agent and multi-agent designs",
    video: "",
    intro: "When one agent is enough, and when splitting work across several is worth the added complexity.",
    body: [
      "Once you can build one agent, it is tempting to build many. Sometimes that is right, but often it is not.",
      { h: "Start with one agent" },
      "A single agent with a good set of tools can handle a surprising amount. It is simpler to build, cheaper to run and far easier to debug because there is one conversation to read.",
      { h: "When multiple agents help" },
      { ul: [
        "Specialisation: a researcher, a writer and a reviewer, each with focused instructions and tools.",
        "Too many tools: one agent with dozens of tools can get confused, while specialists each have a short list.",
        "Parallel work: several agents tackle independent sub-tasks at the same time.",
        "Separation of duties: one agent produces work and another checks it."
      ] },
      { h: "Common patterns" },
      { ul: [
        "Orchestrator and workers: a lead agent breaks down the task and delegates to specialists.",
        "Routing: a first step classifies a request and sends it to the right agent.",
        "Hand-offs: one agent passes the conversation to another when the topic changes.",
        "Generate and review: one agent drafts, another critiques, and the draft improves."
      ] },
      { h: "The cost of more agents" },
      "Every extra agent adds cost, delay and ways for messages to be misunderstood between them. Debugging a conversation between several agents is much harder than debugging one.",
      "A good rule is to begin with a single agent, measure where it falls short, and add structure only to fix a specific problem."
    ],
    takeaways: [
      "One well-designed agent often beats a complicated team.",
      "Use several agents for specialisation, parallel work or independent review.",
      "More agents means more cost and more complexity to debug."
    ]
  },
  {
    title: "Reliability, safety and human oversight",
    video: "",
    intro: "What can go wrong with agents and the practical safeguards that make them trustworthy.",
    body: [
      "Because agents act, their mistakes have consequences. Reliability and safety are part of the design, not an afterthought.",
      { h: "Common failure modes" },
      { ul: [
        "Wrong tool or wrong inputs: the agent misreads the task or fills in a bad value.",
        "Hallucinated facts: it states something it did not actually look up.",
        "Loops and drift: it repeats itself or wanders away from the goal.",
        "Over-reach: it uses permissions in ways you did not intend.",
        "Prompt injection: text in an email, web page or document tries to give the agent new instructions."
      ] },
      { h: "Safeguards" },
      { ul: [
        "Limits: maximum steps, time and spend per task.",
        "Validation: check tool inputs and outputs in code instead of trusting the model.",
        "Least privilege and sandboxes: restrict what the agent can touch.",
        "Approval gates: require a person to confirm anything irreversible or costly.",
        "Logging: record every step and tool call so you can review and debug.",
        "Testing: run the agent against a set of realistic examples, including awkward ones, and track the results."
      ] },
      { h: "Choosing the level of oversight" },
      { ul: [
        "Approve before acting: a person confirms each action. Safest, but slower.",
        "Review after acting: the agent works freely and a person checks the results. Good for reversible tasks.",
        "Autonomous: only for low-stakes, well-tested tasks."
      ] },
      "Treat any text the agent reads from outside, such as inbound email, as untrusted. Never let that text expand the agent's permissions."
    ],
    takeaways: [
      "Plan for failure: limits, validation, logging and testing.",
      "Prompt injection means outside content must be treated as untrusted.",
      "Match human oversight to the stakes of the action."
    ]
  },
  {
    title: "Project: design an agent for a task of your choice",
    video: "",
    intro: "Apply everything from this course by designing, on paper, an agent you could actually build.",
    body: [
      "In this project you will produce a one-page design for an AI agent. You do not need to write code. The aim is to think through each part clearly.",
      { h: "Step 1: choose a task" },
      "Pick something you or your team do repeatedly that involves reading, deciding and acting, such as triaging support emails, preparing a weekly report or scheduling meetings.",
      { h: "Step 2: fill in the design template" },
      { code: "Goal: <what the agent should achieve, in one sentence>\nSuccess looks like: <how you will know it worked>\nInputs: <what it receives and from where>\nTools: <each tool, what it does, read-only or can change things>\nInstructions: <role, rules, things it must never do, when to ask a human>\nMemory: <what it must remember, and for how long>\nOversight: <what needs approval, what is reviewed afterwards>\nFailure plan: <step limits, what happens when it is stuck>\nRisks: <data sensitivity, prompt injection, wrong actions>" },
      { h: "Step 3: sanity-check the design" },
      { ul: [
        "Would a simple fixed workflow do the job instead?",
        "Does every tool have the minimum access it needs?",
        "What is the worst thing that could happen, and what stops it?",
        "How will you measure whether it saves time or improves quality?"
      ] },
      { h: "Deliverable" },
      "Your completed one-page design. If you want a next step, the following course, Automate Your Tasks with AI Agents, turns a design like this into a working automation."
    ],
    takeaways: [
      "A clear written design catches problems before you build anything.",
      "Decide tools, permissions and oversight up front.",
      "Keep the first agent small, safe and measurable."
    ]
  }
];
