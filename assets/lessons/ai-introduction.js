// Lessons for "Artificial Intelligence – An Introduction".
// To add a video: paste the YouTube video ID (the part after v= or youtu.be/) into `video`.
// Body items: a string = paragraph; {h} = heading; {ul} = bullet list; {code} = code block; {note} = callout.
window.LESSONS = window.LESSONS || {};
window.LESSONS["ai-introduction"] = [
  {
    title: "What is AI? Key ideas and a short history",
    video: "",
    intro: "A plain-language tour of what AI means, where it came from and the words you will keep hearing.",
    body: [
      "Artificial intelligence (AI) is the field of building computer systems that do things we normally associate with human intelligence: recognising speech, understanding language, spotting patterns, making recommendations and taking decisions. It is not one technology. It is a collection of techniques, and the label 'AI' is often used loosely for any software that seems smart.",
      { h: "A short history" },
      "The term 'artificial intelligence' was coined for a research workshop at Dartmouth College in 1956. Early AI relied on hand-written rules: experts encoded what they knew as if-then statements. These 'expert systems' worked in narrow areas but were brittle and expensive to maintain. Progress came in waves, with periods of excitement followed by 'AI winters' when results fell short of the hype.",
      "From the 1990s onward the focus shifted to learning from data instead of writing rules by hand. Cheaper computing, huge amounts of data and better algorithms led to a breakthrough in deep learning in the early 2010s, and then to the large language models that power today's chat assistants.",
      { h: "Key terms" },
      { ul: [
        "Artificial intelligence: the broad goal of machines performing tasks that need intelligence.",
        "Machine learning: AI systems that learn patterns from data rather than following hand-written rules.",
        "Deep learning: machine learning that uses large neural networks with many layers.",
        "Generative AI: models that create new content such as text, images, audio or code."
      ] },
      { h: "Narrow versus general AI" },
      "Every AI system in use today is 'narrow': it is good at specific tasks and cannot simply transfer its skill to anything else. 'Artificial general intelligence' (AGI), a system that could do any intellectual task a person can, remains a research goal and a topic of debate."
    ],
    takeaways: [
      "AI is a broad field, not a single technology.",
      "Modern AI mostly learns from data instead of following hand-written rules.",
      "Generative AI is the latest wave, built on deep learning.",
      "Today's AI is narrow: strong at specific tasks, not general intelligence."
    ]
  },
  {
    title: "How machine learning works",
    video: "",
    intro: "How a computer can learn from examples, and why the quality of those examples matters so much.",
    body: [
      "In traditional programming you write the rules and the computer applies them to data to produce answers. Machine learning (ML) flips this around: you give the computer data and the correct answers, and it works out the rules itself. The result is called a model.",
      { h: "Learning by example" },
      "Imagine predicting house prices. You collect thousands of past sales, each with details such as size, location and number of bedrooms, plus the price it sold for. During training the model makes a prediction for each house, compares it with the real price, measures the error and adjusts its internal settings (its parameters) to reduce that error. Repeating this many times produces a model that can estimate the price of a house it has never seen.",
      { h: "Three common styles of learning" },
      { ul: [
        "Supervised learning: learn from labelled examples, such as emails marked 'spam' or 'not spam'.",
        "Unsupervised learning: find structure in unlabelled data, such as grouping customers with similar behaviour.",
        "Reinforcement learning: learn by trial and error, guided by rewards, such as a program learning to play a game."
      ] },
      { h: "Neural networks" },
      "A neural network is a model made of layers of simple connected units. Each connection has a weight, and training adjusts those weights. With many layers (deep learning) networks can learn very complex patterns in images, sound and language.",
      { h: "Testing and overfitting" },
      "A model must work on new data, not just the data it was trained on. So the data is split: most is used for training, and some is held back to test the model fairly. A model that memorises its training data but performs poorly on new data is 'overfitting'.",
      { note: "Garbage in, garbage out. A model can only learn from what it is shown. If the data is incomplete, outdated or biased, the model will be too." }
    ],
    takeaways: [
      "ML learns rules from data and answers instead of being given the rules.",
      "Training means repeatedly adjusting parameters to reduce error.",
      "Always evaluate a model on data it has not seen before.",
      "Data quality is as important as the algorithm."
    ]
  },
  {
    title: "Generative AI and large language models",
    video: "",
    intro: "What sits behind chat assistants, and why they can be both impressive and wrong.",
    body: [
      "Generative AI refers to models that create new content. A large language model (LLM) is a generative model trained on enormous amounts of text. It powers the chat assistants many people now use for writing, summarising, translating and coding.",
      { h: "Predicting the next token" },
      "At its core an LLM does one thing: given some text, it predicts what comes next. The text is split into 'tokens', which are pieces of words. The model assigns a probability to every possible next token, picks one, adds it to the text and repeats. Out of this simple loop come fluent paragraphs, working code and sensible answers.",
      { h: "How they are built" },
      { ul: [
        "Pre-training: the model learns from vast amounts of text, picking up grammar, facts and patterns of reasoning.",
        "Fine-tuning: the model is further trained on examples of helpful behaviour, often including human feedback, so it follows instructions and behaves safely.",
        "The transformer: most modern LLMs use the transformer architecture, introduced in 2017, which lets the model weigh how every word in a passage relates to the others."
      ] },
      { h: "Useful ideas to know" },
      { ul: [
        "Context window: the amount of text a model can consider at once, including your prompt and its reply.",
        "Multimodal models: models that can work with images, audio or video as well as text.",
        "Hallucination: because the model produces plausible text rather than looking up facts, it can state something false with complete confidence."
      ] },
      "Generative AI also covers image, audio and video generation. The details differ, but the principle is the same: learn patterns from large datasets, then generate new examples that follow those patterns."
    ],
    takeaways: [
      "LLMs generate text one token at a time by predicting what comes next.",
      "Training has two main stages: pre-training and fine-tuning.",
      "A context window limits how much text the model can use at once.",
      "Fluent does not mean correct: models can hallucinate."
    ]
  },
  {
    title: "What AI does well and where it fails",
    video: "",
    intro: "A realistic view of strengths and weaknesses, so you know when to rely on AI and when to be careful.",
    body: [
      "AI tools are powerful but uneven. Knowing where they shine and where they stumble is the most practical skill you can build.",
      { h: "Where AI does well" },
      { ul: [
        "Drafting and rewriting text, from emails to reports.",
        "Summarising long documents and extracting key points.",
        "Translating and changing tone or reading level.",
        "Spotting patterns in large amounts of data.",
        "Generating ideas, outlines and first versions of code.",
        "Repetitive, well-defined tasks at speed and scale."
      ] },
      { h: "Where AI struggles" },
      { ul: [
        "Facts: it can invent details, sources and numbers (hallucination).",
        "Recent events: its knowledge stops at a training cut-off unless it is connected to search or your documents.",
        "Careful reasoning and arithmetic: it can make confident mistakes, especially in multi-step problems.",
        "Sensitivity to wording: small changes to a question can change the answer.",
        "Judgement and accountability: it has no responsibility for the outcome. You do.",
        "Bias: it can reflect unfair patterns in its training data."
      ] },
      { h: "A simple checklist before you rely on it" },
      { ul: [
        "Stakes: what happens if this is wrong? The higher the stakes, the more checking you need.",
        "Verifiability: can you check the answer against a trusted source?",
        "Sensitivity: does the task involve confidential or personal information?"
      ] },
      "A good working model is to treat AI as a fast, capable assistant that sometimes makes things up. Let it produce the first draft, and keep yourself responsible for the final result."
    ],
    takeaways: [
      "AI is strong at drafting, summarising, transforming text and finding patterns.",
      "It is weak at guaranteed facts, careful reasoning and accountability.",
      "Match the amount of checking to the stakes.",
      "You remain responsible for anything you use or share."
    ]
  },
  {
    title: "Getting good results: prompting basics",
    video: "",
    intro: "How to ask clearly so the AI gives you something useful the first time.",
    body: [
      "A prompt is the instruction you give an AI model. The model cannot read your mind, so the clearer and more specific the prompt, the better the result.",
      { h: "What a good prompt contains" },
      { ul: [
        "Context: who you are, who the audience is and what the situation is.",
        "Task: exactly what you want done, stated plainly.",
        "Constraints: length, tone, things to include or avoid.",
        "Format: bullet points, a table, a short email, JSON and so on.",
        "Examples: one or two samples of what 'good' looks like."
      ] },
      { h: "Weak versus strong" },
      "Weak: 'Write about our new product.' Strong: 'You are a marketing writer for a small software company. Write a 120-word announcement email for existing customers about our new reporting feature. Friendly, plain English, no jargon. End with one clear call to action to book a demo.'",
      { h: "A reusable template" },
      { code: "Context: <who I am and who this is for>\nTask: <what I want you to do>\nConstraints: <length, tone, must include, must avoid>\nFormat: <how the answer should be structured>\nIf you are unsure about something, ask me before answering." },
      { h: "Habits that help" },
      { ul: [
        "Iterate: treat the first answer as a draft and ask for specific changes.",
        "Give the source text: paste the material you want summarised instead of relying on memory.",
        "Ask it to show its working or list its assumptions for anything analytical.",
        "Allow 'I don't know': tell the model it may say when it is unsure rather than guess."
      ] }
    ],
    takeaways: [
      "Clear context, task, constraints and format give much better results.",
      "Examples are one of the most powerful things you can add to a prompt.",
      "Iterate instead of expecting a perfect first answer.",
      "Always review the output before you use it."
    ]
  },
  {
    title: "Bias, privacy and responsible use",
    video: "",
    intro: "The risks that come with AI and the habits that keep you, your work and other people safe.",
    body: [
      "Using AI well means using it responsibly. Four areas matter most.",
      { h: "Bias and fairness" },
      "AI learns from data created by people, so it can absorb and repeat unfair patterns. If past hiring decisions favoured one group, a model trained on them may too. Be especially careful when AI informs decisions about people, such as hiring, lending or access to services, and make sure a human reviews them.",
      { h: "Privacy and confidentiality" },
      "Information you type into an AI tool may be stored or processed by the provider. Do not paste personal data, customer records, passwords or confidential business information unless you are certain the tool and your organisation's policy allow it.",
      { h: "Accuracy and transparency" },
      "Check important facts, and be open about when AI helped create something where that matters, such as in published work, school or regulated settings.",
      { h: "Ownership and security" },
      { ul: [
        "Copyright and licensing of AI-generated and AI-trained content is still being worked out in many places, so check the rules that apply to you.",
        "Be wary of instructions hidden in content an AI reads, such as a web page or email, that try to steer it. This is called prompt injection and matters more once AI can take actions.",
        "Rules are emerging worldwide, for example the EU AI Act, so expect requirements to grow."
      ] },
      { h: "A responsible-use checklist" },
      { ul: [
        "Would I be comfortable if the people affected knew how this was produced?",
        "Have I removed personal or confidential details?",
        "Have I checked the facts that matter?",
        "Is a person accountable for the final decision?"
      ] }
    ],
    takeaways: [
      "AI can reproduce bias, so keep humans involved in decisions about people.",
      "Treat prompts as potentially stored: keep sensitive data out.",
      "Verify what matters and be transparent about AI use.",
      "People, not tools, remain accountable."
    ]
  },
  {
    title: "Where AI is heading and what to learn next",
    video: "",
    intro: "The trends to watch and a practical plan for continuing your learning.",
    body: [
      "Nobody can predict AI precisely, but several trends are clear enough to plan around.",
      { h: "Trends to watch" },
      { ul: [
        "AI agents: systems that do not just answer but plan and take actions using tools.",
        "Multimodal AI: models that understand and produce text, images, audio and video together.",
        "Smaller, faster models: capable models that run cheaply, including on your own device.",
        "AI built into everyday software: email, documents, spreadsheets and design tools.",
        "Rules and standards: more regulation and clearer expectations around safety and transparency."
      ] },
      { h: "Skills that will last" },
      { ul: [
        "Prompting and instruction-writing, which is really clear thinking.",
        "Evaluating output: spotting errors, gaps and bias.",
        "Domain knowledge: AI amplifies expertise, so knowing your field matters more, not less.",
        "Data literacy: understanding where information comes from and how reliable it is."
      ] },
      { h: "Your next steps" },
      { ul: [
        "Use an AI tool on a real task every week and note what works.",
        "Keep a personal library of prompts that gave good results.",
        "Take the next course, Introduction to AI Agents, to see how AI goes from answering to acting.",
        "If you work in the cloud, pair this with AWS – An Introduction and AI on AWS."
      ] },
      "Congratulations on completing the course. Keep experimenting, stay curious and stay critical."
    ],
    takeaways: [
      "Agents, multimodal models and AI inside everyday tools are the big trends.",
      "Judgement, domain knowledge and clear communication stay valuable.",
      "Build the habit of using AI on real work and reflecting on the results."
    ]
  }
];
