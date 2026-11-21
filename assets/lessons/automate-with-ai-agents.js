// Lessons for "Automate Your Tasks with AI Agents".
// To add a video: paste the YouTube video ID into `video`.
window.LESSONS = window.LESSONS || {};
window.LESSONS["automate-with-ai-agents"] = [
  {
    title: "Finding tasks worth automating",
    video: "",
    intro: "How to choose the right first tasks, so your automation saves real time and carries little risk.",
    body: [
      "The most common mistake in automation is starting with the wrong task. A good first candidate is boring, frequent, and forgiving if it goes wrong.",
      { h: "Signs a task is a good candidate" },
      { ul: [
        "Repetitive: you do essentially the same thing again and again.",
        "Frequent: it happens daily or weekly, so small savings add up.",
        "Digital: the inputs and outputs already live in email, documents, spreadsheets or apps.",
        "Clear: you can describe what 'done correctly' looks like.",
        "Low to moderate risk: a mistake is cheap and easy to catch or reverse."
      ] },
      { h: "Signs to hold back" },
      { ul: [
        "High stakes, such as legal, medical or financial decisions made without review.",
        "Vague goals where even people disagree on the right answer.",
        "Rare tasks that take longer to automate than to do by hand."
      ] },
      { h: "Run a one-week audit" },
      "For a week, jot down each repetitive task you do: what it is, how long it takes and how often. Then score each one.",
      { code: "Time saved per month = minutes per run x runs per month\nPriority = time saved x ease (1 = hard, 3 = easy) x safety (1 = risky, 3 = safe)" },
      "Choose one or two tasks with the highest priority. Starting small lets you learn how automation behaves before you rely on it."
    ],
    takeaways: [
      "Pick tasks that are repetitive, frequent, digital, clear and low risk.",
      "Audit your week and score candidates by time saved, ease and safety.",
      "Start with one small task."
    ]
  },
  {
    title: "Designing a workflow step by step",
    video: "",
    intro: "Turn a task into a clear map of triggers, steps, decisions and outputs before you build anything.",
    body: [
      "Before opening any tool, write down exactly how the task works today. A clear map is half the work.",
      { h: "The parts of a workflow" },
      { ul: [
        "Trigger: what starts it, such as a new email, a form submission or a schedule.",
        "Inputs: the information it needs.",
        "Steps: what happens, in order.",
        "Decisions: where the path branches.",
        "Outputs: what is produced and where it goes."
      ] },
      { h: "Decide where AI belongs" },
      "Not every step needs AI. Use ordinary automation for predictable steps, such as copying a value or sending a notification. Use AI where the work needs language understanding or judgement, such as classifying a message, extracting details from free text or drafting a reply.",
      { h: "Example: triaging incoming invoices" },
      { code: "Trigger:   new email arrives in the invoices inbox\nStep 1:    save the attachment to a shared folder            (plain automation)\nStep 2:    read the invoice and extract supplier, date,\n           amount and invoice number                         (AI)\nStep 3:    check the amount against the purchase order        (plain automation)\nDecision:  matches? yes -> log it; no -> send to a person     (rule)\nOutput:    a new row in the tracking spreadsheet" },
      { h: "Design for the unusual cases" },
      "List what could go wrong: a missing attachment, an unreadable scan, an amount that does not match. Decide in advance what the workflow does in each case, and the safe default is usually to pass it to a person."
    ],
    takeaways: [
      "Map trigger, inputs, steps, decisions and outputs first.",
      "Use AI only for steps that need language or judgement.",
      "Plan for the exceptions, with a human as the safe fallback."
    ]
  },
  {
    title: "Building your first agent-powered automation",
    video: "",
    intro: "The practical steps to get a first automation running, whatever tool you choose.",
    body: [
      "You can build automations with no-code tools, workflow platforms or your own code. The approach is the same in all of them, so the choice mostly depends on your comfort level and what you need to connect.",
      { h: "The build steps" },
      { ul: [
        "1. Set up the trigger so the workflow starts when the event happens.",
        "2. Collect the input and clean it, for example removing signatures or quoted replies from an email.",
        "3. Call the model with clear instructions and the input.",
        "4. Ask for a structured answer so the next step can use it reliably.",
        "5. Act on the result: update a sheet, create a draft, send a notification.",
        "6. Log what happened so you can review it later."
      ] },
      { h: "Ask for structured output" },
      "When another step will read the model's answer, request a fixed format such as JSON. This is much more reliable than free text.",
      { code: "You classify customer emails.\nRead the email below and respond with JSON only, in this shape:\n{\"category\": \"billing\" | \"technical\" | \"sales\" | \"other\",\n \"urgent\": true | false,\n \"summary\": \"one sentence\"}\nIf you are unsure, use category \"other\".\n\nEmail:\n<paste the email text here>" },
      { h: "Keep it small" },
      "Get a thin end-to-end version working first, even if it handles only one case. Then improve it. A small automation that runs beats an ambitious one that never finishes.",
      { note: "Draft, do not send. In your first version, have the automation create drafts or suggestions for a person to approve, instead of acting on its own." }
    ],
    takeaways: [
      "Every automation follows trigger, input, model, output and action.",
      "Request structured output when another step will use the answer.",
      "Start with a thin working version that drafts instead of acting."
    ]
  },
  {
    title: "Connecting to email, documents and spreadsheets",
    video: "",
    intro: "How to link your automation to the tools where your work lives, safely.",
    body: [
      "Useful automations read from and write to everyday tools. Most email, document and spreadsheet services offer connectors in automation platforms, or APIs you can call yourself.",
      { h: "How connections are authorised" },
      "When you connect an account, you usually sign in and approve a list of permissions, a process called OAuth. Read that list carefully. An automation that only needs to read a folder should not be given access to your whole mailbox.",
      { h: "Good practice" },
      { ul: [
        "Least privilege: grant the narrowest permissions that work, and begin with read-only.",
        "Use a dedicated account or shared mailbox for the automation where you can, instead of your personal one.",
        "Never paste passwords or keys into prompts. Store secrets in the platform's secure settings.",
        "Review connections regularly and remove any you no longer use."
      ] },
      { h: "Working with each type of tool" },
      { ul: [
        "Email: read the subject, body and attachments. Strip signatures and quoted history before sending text to a model.",
        "Documents: extract the text first. Long files may need to be split into sections.",
        "Spreadsheets: a sheet makes a handy simple database for logging results and tracking status. Keep one row per item and use consistent column names."
      ] },
      { h: "Mind the limits" },
      "Services limit how many requests you can make per minute or day, so batch your work and add retries. Remember also that anything you send to a model leaves that tool, so check privacy rules for customer or personal data."
    ],
    takeaways: [
      "Connect with the least permission needed, read-only first.",
      "Keep secrets out of prompts and use dedicated accounts where possible.",
      "Pre-process emails and documents before sending them to a model."
    ]
  },
  {
    title: "Testing, error handling and fallbacks",
    video: "",
    intro: "How to find out whether your automation is good enough and what to do when it is not.",
    body: [
      "Language models can be right most of the time and still wrong at the worst moment. Testing and error handling are what make an automation dependable.",
      { h: "Build a test set" },
      "Collect 20 to 50 real examples of the inputs your automation will see, including messy and unusual ones. For each, write down the correct result. Run the automation on all of them and compare.",
      { code: "Accuracy = correct results / total examples\nTrack it each time you change the prompt or the model." },
      "Look at the failures, not just the score. They usually show what to add to your instructions or which cases need a person.",
      { h: "Handle errors on purpose" },
      { ul: [
        "Retries: if a service fails temporarily, try again after a short, growing delay.",
        "Timeouts: do not wait forever.",
        "Validation: check that the model's output is in the expected format and has sensible values before using it.",
        "Fallback: if anything looks wrong, send the item to a human queue instead of guessing."
      ] },
      { h: "Log and monitor" },
      "Record what the automation did and why, and set up a simple alert when failures rise. Check a sample of results regularly, because behaviour can drift when inputs change or a model is updated.",
      "A well-built automation does not aim never to fail. It aims to fail safely and visibly."
    ],
    takeaways: [
      "Test on a realistic set of examples and track accuracy.",
      "Validate outputs and use retries and timeouts.",
      "Route anything doubtful to a person, and keep logs."
    ]
  },
  {
    title: "Keeping a human in the loop",
    video: "",
    intro: "Where people belong in an automated process, and how to design reviews that actually work.",
    body: [
      "Full automation is rarely the goal. The best results usually come from combining the speed of AI with human judgement at the right points.",
      { h: "Common human-in-the-loop patterns" },
      { ul: [
        "Approval gate: the automation prepares an action, such as a draft reply, and a person approves it before it is sent.",
        "Confidence threshold: clear cases proceed automatically, while uncertain ones go to a review queue.",
        "Sampling: a person spot-checks a percentage of automated results to catch problems early.",
        "Exception handling: anything unusual is escalated instead of processed."
      ] },
      { h: "Design reviews people will actually do" },
      { ul: [
        "Make the review fast: show the source, the proposed result and a one-click approve or edit.",
        "Show why: include the key evidence behind a decision.",
        "Keep the queue small: if reviewers are overwhelmed they will start approving without reading.",
        "Capture corrections so you can improve the instructions over time."
      ] },
      { h: "Accountability" },
      "Decide who is responsible for the automation's output and keep an audit trail of what it did. If something goes wrong, you should be able to see what happened and fix it.",
      { h: "When to loosen oversight" },
      "As your test results and monitoring show consistently good outcomes on low-risk work, you can reduce review, for example by moving from approving everything to sampling. Keep a human in the loop for anything high-stakes."
    ],
    takeaways: [
      "Use approval gates, thresholds and sampling to balance speed and safety.",
      "Make reviews quick and informative so people really do them.",
      "Reduce oversight only when evidence supports it, and never for high-stakes work."
    ]
  },
  {
    title: "Project: automate a real task end to end",
    video: "",
    intro: "Build and measure a working automation for a real task in your own work.",
    body: [
      "Time to put everything together. You will automate one real task, test it and measure how much time it saves.",
      { h: "Step 1: choose and describe the task" },
      "Use your audit from the first lesson. Pick a task that is frequent, clear and low risk, and write down how it works today.",
      { h: "Step 2: measure the baseline" },
      { code: "Baseline minutes per run: ____\nRuns per month:           ____\nTime spent per month:     ____ minutes" },
      { h: "Step 3: design and build" },
      { ul: [
        "Draw the workflow with its trigger, inputs, steps, decisions and outputs.",
        "Mark which steps use AI and which are plain automation.",
        "Build a thin end-to-end version that creates drafts or suggestions.",
        "Connect only the tools and permissions you need."
      ] },
      { h: "Step 4: test and add safeguards" },
      { ul: [
        "Assemble a test set of at least 20 real examples and record accuracy.",
        "Add validation, retries and a fallback queue for doubtful cases.",
        "Decide where a person approves or spot-checks."
      ] },
      { h: "Step 5: measure the result" },
      { code: "Time saved per month = baseline time - (review time + fixing time)\nAccuracy on test set = ____ %\nHow many items needed a person = ____ %" },
      { h: "Deliverable" },
      "A working automation, your test results and a short summary of the time saved and what you would improve next. That summary is also a good way to show others the value of what you built."
    ],
    takeaways: [
      "Measure before and after so the benefit is real, not assumed.",
      "Ship a small, safe version first, then improve it.",
      "Combine testing, fallbacks and human review to make it dependable."
    ]
  }
];
