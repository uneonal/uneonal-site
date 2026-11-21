// Lessons for "AI on AWS".
// To add a video: paste the YouTube video ID into `video`.
window.LESSONS = window.LESSONS || {};
window.LESSONS["ai-on-aws"] = [
  {
    title: "The AWS AI landscape",
    video: "",
    intro: "A map of the AWS AI services and a simple rule for choosing between them.",
    body: [
      "AWS offers AI capabilities at several levels. Thinking in layers makes it much easier to pick the right tool.",
      { h: "Layer 1: pre-built AI services" },
      "Ready-to-use APIs for specific jobs, with no machine learning expertise required. Examples include Amazon Rekognition for images and video, Amazon Textract for reading documents, Amazon Comprehend for text analysis, Amazon Transcribe for speech to text, Amazon Polly for text to speech and Amazon Translate for translation.",
      { h: "Layer 2: generative AI with Amazon Bedrock" },
      "Amazon Bedrock is a managed service that gives you access to foundation models from several providers through one API, along with features for guardrails, retrieval over your own data and agents. You do not manage any infrastructure.",
      { h: "Layer 3: build your own models with Amazon SageMaker" },
      "Amazon SageMaker is a platform for preparing data, training, tuning and deploying your own machine learning models when you need full control.",
      { h: "AI assistants" },
      "AWS also offers ready-made assistants, such as Amazon Q, aimed at helping with software development and business tasks.",
      { h: "A simple rule" },
      "Use the simplest layer that solves your problem.",
      { ul: [
        "Common task such as reading documents or detecting objects? Use a pre-built service.",
        "Need language understanding, writing, summarising or an agent? Start with Bedrock.",
        "Need a custom model trained on your own data? Use SageMaker.",
        "Need only an off-the-shelf assistant? Look at the Amazon Q products."
      ] },
      { note: "Service names and features evolve quickly. Check the AWS documentation for what is currently available in your Region." }
    ],
    takeaways: [
      "AWS AI comes in layers: pre-built services, Bedrock and SageMaker.",
      "Choose the simplest layer that meets the need.",
      "You need little or no ML expertise for the first two layers."
    ]
  },
  {
    title: "Amazon Bedrock: foundation models and your first call",
    video: "",
    intro: "What Bedrock is and how to send your first request to a foundation model.",
    body: [
      "Amazon Bedrock lets you use foundation models, large pre-trained models for text, images and more, from several model providers through a single, consistent API.",
      { h: "Getting set up" },
      { ul: [
        "Pick a Region where Bedrock and your chosen model are available.",
        "Check which models you can use in the Bedrock console and request access if the console asks you to. Availability depends on the model and Region.",
        "Give your IAM user or role permission to invoke models, following least privilege.",
        "Try your prompts in the console playground before writing code."
      ] },
      { h: "Your first call" },
      "The Converse API gives you one way to talk to many models, so you can change models without rewriting your code. Here it is in Python with the boto3 SDK. Replace the model ID with one shown for your Region in the console.",
      { code: "import boto3\n\nclient = boto3.client(\"bedrock-runtime\", region_name=\"us-east-1\")\n\nresponse = client.converse(\n    modelId=\"<model-id>\",\n    messages=[\n        {\"role\": \"user\", \"content\": [{\"text\": \"Explain AWS in one sentence.\"}]}\n    ],\n    inferenceConfig={\"maxTokens\": 200, \"temperature\": 0.3},\n)\n\nprint(response[\"output\"][\"message\"][\"content\"][0][\"text\"])" },
      { h: "Settings worth knowing" },
      { ul: [
        "maxTokens: the longest response you will accept. It also limits cost.",
        "temperature: lower values give more predictable answers, and higher values give more varied ones.",
        "system prompt: instructions that set the model's role and rules for the whole conversation."
      ] },
      { h: "How pricing works" },
      "On-demand use is generally billed by the amount of text processed, measured in tokens, for both input and output. Shorter prompts and capped outputs reduce cost. Check current pricing for the model you choose.",
      "Choosing a model is a trade-off between quality, speed and cost, so test a few on your own examples."
    ],
    takeaways: [
      "Bedrock gives one API for many foundation models.",
      "The Converse API makes it easy to swap models.",
      "Cost follows tokens, so keep prompts focused and cap outputs."
    ]
  },
  {
    title: "Prompting, guardrails and responsible AI on Bedrock",
    video: "",
    intro: "How to get dependable output from Bedrock models and add safety controls around them.",
    body: [
      { h: "Prompting on Bedrock" },
      "Everything you learned about good prompts applies: clear context, a specific task, constraints and an output format. In the Converse API you can place standing instructions in a system prompt, keeping them separate from the user's message.",
      { code: "response = client.converse(\n    modelId=\"<model-id>\",\n    system=[{\"text\": \"You are a support assistant for Acme Ltd. Answer briefly. If you do not know, say so.\"}],\n    messages=[{\"role\": \"user\", \"content\": [{\"text\": \"What is your returns policy?\"}]}],\n)" },
      { h: "Guardrails for Amazon Bedrock" },
      "Guardrails add configurable safety checks around a model, applied to what users send in and what the model sends back. Depending on how you configure them, they can:",
      { ul: [
        "Filter harmful content, such as hate, violence or other categories you choose.",
        "Block denied topics, subjects your application should not discuss.",
        "Filter words and phrases you specify.",
        "Detect or mask sensitive information, such as personal data.",
        "Check responses are grounded in the source material, to help reduce unsupported answers."
      ] },
      "You define a guardrail once and apply it across different models and applications.",
      { h: "Responsible AI practices" },
      { ul: [
        "Test with adversarial and edge-case prompts before you launch.",
        "Evaluate model quality on your own examples, since general benchmarks do not tell the whole story.",
        "Tell users when they are talking to AI and make it easy to reach a person.",
        "Log interactions, with privacy in mind, so you can investigate problems.",
        "Keep a human responsible for decisions that affect people."
      ] },
      "Guardrails reduce risk but do not remove it. Combine them with testing, monitoring and human oversight."
    ],
    takeaways: [
      "Use system prompts for standing instructions.",
      "Guardrails filter content, block topics, protect sensitive data and check grounding.",
      "Safety needs testing and human oversight as well as technical controls."
    ]
  },
  {
    title: "Retrieval-augmented generation with Knowledge Bases",
    video: "",
    intro: "How to make a model answer from your own documents instead of guessing.",
    body: [
      "Foundation models do not know your company's policies, products or documents. Retrieval-augmented generation (RAG) solves this by finding the relevant passages from your own data and giving them to the model together with the question.",
      { h: "How RAG works" },
      { ul: [
        "1. Prepare: your documents are split into chunks.",
        "2. Embed: each chunk is converted into an embedding, a list of numbers that captures its meaning, and stored in a vector database.",
        "3. Retrieve: when a user asks a question, the question is embedded too and the most similar chunks are found.",
        "4. Generate: the model answers using those chunks as its source material."
      ] },
      { h: "Knowledge Bases for Amazon Bedrock" },
      "This feature manages most of the pipeline for you. You point it at your documents, for example in an S3 bucket, choose an embedding model and a vector store, and it handles ingestion, chunking and retrieval. Supported vector stores include options such as Amazon OpenSearch Serverless and Aurora PostgreSQL, among others.",
      "You can call it in two ways: a retrieve-only call that returns the matching passages, and a retrieve-and-generate call that returns a finished answer with citations.",
      { h: "Tips for good results" },
      { ul: [
        "Quality in, quality out: clean, current documents give better answers.",
        "Chunking matters: chunks that are too large or too small hurt retrieval, so test different settings.",
        "Show sources: citations let users verify answers.",
        "Respect permissions: make sure people only get answers drawn from documents they are allowed to see.",
        "Evaluate retrieval separately: check that the right passages are found before judging the model.",
        "Keep data fresh: re-sync when your documents change."
      ] },
      "RAG is usually the best first step for adding company knowledge to an AI application. It is cheaper and easier to keep up to date than retraining a model."
    ],
    takeaways: [
      "RAG retrieves relevant passages and gives them to the model as context.",
      "Knowledge Bases manage ingestion, embeddings, storage and retrieval.",
      "Good documents, sensible chunking, citations and access control make RAG trustworthy."
    ]
  },
  {
    title: "Building agents on AWS",
    video: "",
    intro: "The AWS options for building AI agents, from managed agents to open-source tooling.",
    body: [
      "You learned what agents are in Introduction to AI Agents. AWS offers several ways to build them, from fully managed to code-first.",
      { h: "Agents for Amazon Bedrock" },
      "This managed capability lets you create an agent by configuring it rather than writing the orchestration yourself. You provide:",
      { ul: [
        "Instructions: the agent's role, goal and rules.",
        "A foundation model that does the reasoning.",
        "Action groups: the actions the agent may take, typically backed by AWS Lambda functions and described with an API schema.",
        "Knowledge bases: documents the agent can search.",
        "Guardrails: safety controls applied to its inputs and outputs."
      ] },
      "The agent plans the steps, calls your actions and knowledge bases, and returns an answer. You can configure it to ask for confirmation before running particular actions.",
      { h: "Code-first and production tooling" },
      { ul: [
        "Strands Agents: an open-source SDK from AWS for building agents in code.",
        "Amazon Bedrock AgentCore: services for deploying and operating agents at scale, covering areas such as secure runtime, memory, identity and observability."
      ] },
      "Because this area is moving quickly, check the AWS documentation for the current capabilities and recommended approach.",
      { h: "Design reminders" },
      { ul: [
        "Give each action the least privilege it needs, through a tightly scoped IAM role.",
        "Make action descriptions clear, since the model chooses actions based on them.",
        "Require human approval for irreversible or sensitive actions.",
        "Log and monitor what the agent does, and test it against realistic examples.",
        "Treat content the agent reads as untrusted, because of prompt injection."
      ] }
    ],
    takeaways: [
      "Agents for Bedrock lets you configure agents with models, actions, knowledge and guardrails.",
      "Code-first options such as Strands Agents and AgentCore support production use.",
      "Scoped permissions, approvals and monitoring matter as much as the model."
    ]
  },
  {
    title: "Pre-built AI services: vision, documents, language and speech",
    video: "",
    intro: "Ready-made AI APIs that solve common problems without any model building.",
    body: [
      "Many everyday AI needs, such as reading a scanned form or transcribing a call, are solved by AWS's pre-built services. You send data to an API and get structured results back.",
      { h: "The main services" },
      { ul: [
        "Amazon Rekognition: analyse images and video, such as detecting objects, text and unsafe content.",
        "Amazon Textract: extract text, tables and form fields from scanned documents and PDFs.",
        "Amazon Comprehend: analyse text for sentiment, key phrases, entities and personal information.",
        "Amazon Transcribe: convert speech to text.",
        "Amazon Polly: convert text to lifelike speech.",
        "Amazon Translate: translate text between languages.",
        "Amazon Lex: build conversational interfaces such as chatbots."
      ] },
      { h: "Example: reading a document with Textract" },
      { code: "aws textract detect-document-text \\\n  --document '{\"S3Object\":{\"Bucket\":\"my-bucket\",\"Name\":\"invoice.png\"}}'" },
      { h: "A typical architecture" },
      { code: "Invoice uploaded to S3\n   -> triggers an AWS Lambda function\n   -> Textract extracts the text and fields\n   -> Bedrock or rules check and classify the content\n   -> result saved to DynamoDB\n   -> exceptions sent to a person for review" },
      "Notice how these services combine: pre-built services read and transcribe, generative AI understands and decides, and ordinary AWS services store and connect everything.",
      { h: "When to choose these over Bedrock" },
      "Pre-built services are often cheaper, faster and more predictable for narrow, well-defined tasks. Use a foundation model when the task needs open-ended language understanding or generation."
    ],
    takeaways: [
      "Pre-built services cover vision, documents, text analysis, speech and translation.",
      "They combine well with Lambda, S3 and Bedrock in a pipeline.",
      "Prefer them for narrow, well-defined jobs."
    ]
  },
  {
    title: "Training and deploying models with Amazon SageMaker",
    video: "",
    intro: "When to build your own model and what SageMaker gives you to do it.",
    body: [
      "Most applications do not need a custom model. Start with pre-built services or Bedrock, and turn to SageMaker when you have a clear reason, such as your own data, a specialised task, strict control over the model or a need to tune performance and cost.",
      { h: "What SageMaker provides" },
      { ul: [
        "Development environments: managed notebooks and a studio for exploring data and writing code.",
        "Training: run training jobs on managed compute, including GPUs, without managing servers.",
        "Tuning: automatic hyperparameter tuning to improve model quality.",
        "Model registry: track and version models.",
        "Deployment: host models behind endpoints, with real-time, serverless, asynchronous and batch options.",
        "JumpStart: a hub of pre-trained models and example solutions to start from.",
        "Pipelines: automate repeatable workflows for training and deployment, often called MLOps."
      ] },
      { h: "A typical workflow" },
      { code: "1. Put training data in S3\n2. Prepare and explore it in a notebook\n3. Launch a training job\n4. Evaluate the model on held-out data\n5. Register the model\n6. Deploy it to an endpoint\n7. Monitor quality and cost, and retrain when needed" },
      { h: "Cost and care" },
      { ul: [
        "Endpoints and notebooks are billed while they are running, so shut down or delete what you are not using.",
        "Choose instance sizes to match the job. Bigger is not always better.",
        "Use batch or asynchronous options when you do not need instant answers.",
        "Monitor the model after launch, since real-world data can drift away from what it was trained on."
      ] },
      "Fine-tuning an existing foundation model on your data is another route, and is available through Bedrock for some models and through SageMaker for others."
    ],
    takeaways: [
      "Use SageMaker when you need a custom model or tight control.",
      "It covers the whole lifecycle: data, training, tuning, deployment and monitoring.",
      "Always switch off endpoints and notebooks you are not using."
    ]
  },
  {
    title: "Security, cost and going to production",
    video: "",
    intro: "The practical checklist for moving an AI application from prototype to a service people can rely on.",
    body: [
      { h: "Security" },
      { ul: [
        "Least privilege: give each role only the model, data and actions it needs.",
        "Private connectivity: use VPC endpoints (AWS PrivateLink) so traffic to AWS services stays off the public internet where required.",
        "Encryption: encrypt data at rest and in transit, using AWS Key Management Service (KMS) where you need control of keys.",
        "Audit: use CloudTrail for API activity and Bedrock's invocation logging where appropriate.",
        "Data handling: AWS documents how Bedrock treats your prompts and outputs, including that they are not used to train the underlying models. Read the current terms for your use."
      ] },
      { h: "Cost" },
      { ul: [
        "Pick the smallest model that meets your quality bar.",
        "Keep prompts short, and cap output length.",
        "Cache repeated work and reuse results where you can.",
        "Use batch options for work that is not time-sensitive.",
        "Set budgets and alerts, and track cost per request."
      ] },
      { h: "Reliability and performance" },
      { ul: [
        "Handle throttling and quotas with retries and back-off.",
        "Plan for model or service outages, with a fallback model or a graceful message.",
        "Test latency with realistic loads.",
        "Monitor with Amazon CloudWatch and set alarms on errors and delays."
      ] },
      { h: "Quality" },
      { ul: [
        "Evaluate on your own test set before launch and after every change.",
        "Collect user feedback and review samples of real conversations.",
        "Keep humans in the loop for sensitive decisions."
      ] },
      { h: "Launch checklist" },
      { code: "[ ] Least-privilege roles in place\n[ ] Guardrails configured and tested\n[ ] Evaluation set and quality targets agreed\n[ ] Logging, monitoring and alarms working\n[ ] Budget alerts set\n[ ] Fallback and error handling tested\n[ ] Human escalation path defined" },
      "If you want a certification goal, AWS offers the AWS Certified AI Practitioner exam as a good way to consolidate what you have learned. Well done on finishing the course."
    ],
    takeaways: [
      "Secure with least privilege, private connectivity, encryption and audit logs.",
      "Control cost through model choice, short prompts, caching and budgets.",
      "Evaluate, monitor and keep an escalation path before launch."
    ]
  }
];
