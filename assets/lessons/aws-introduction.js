// Lessons for "AWS – An Introduction".
// To add a video: paste the YouTube video ID into `video`.
window.LESSONS = window.LESSONS || {};
window.LESSONS["aws-introduction"] = [
  {
    title: "What is cloud computing and what is AWS?",
    video: "",
    intro: "The big idea behind the cloud and where Amazon Web Services fits.",
    body: [
      "Cloud computing means renting computing resources, such as servers, storage and databases, over the internet and paying only for what you use, instead of buying and running your own hardware.",
      { h: "Why organisations move to the cloud" },
      { ul: [
        "Speed: get a server or database in minutes instead of weeks.",
        "Elasticity: scale up when demand rises and back down when it falls.",
        "Lower upfront cost: no large hardware purchase. You pay as you go.",
        "Global reach: run applications close to customers around the world.",
        "Less undifferentiated work: the provider handles the data centres and much of the underlying maintenance."
      ] },
      { h: "Three service models" },
      { ul: [
        "Infrastructure as a Service (IaaS): you rent basic building blocks like virtual servers and manage the software yourself.",
        "Platform as a Service (PaaS): the provider manages the platform and you deploy your application on it.",
        "Software as a Service (SaaS): you use a finished application, such as web email."
      ] },
      { h: "What is AWS?" },
      "Amazon Web Services (AWS) is Amazon's cloud platform. It launched in 2006 with storage (Amazon S3) and virtual servers (Amazon EC2) and now offers a very large catalogue of services covering computing, storage, databases, networking, analytics, security and artificial intelligence.",
      { h: "Ways to use AWS" },
      { ul: [
        "AWS Management Console: the web interface, ideal for learning.",
        "AWS Command Line Interface (CLI): control services from a terminal and in scripts.",
        "SDKs: use AWS from code in languages such as Python and JavaScript.",
        "Infrastructure as code: describe your resources in files, with tools such as AWS CloudFormation, so they can be created repeatably."
      ] },
      { h: "Shared responsibility" },
      "AWS is responsible for the security 'of' the cloud, meaning the data centres and underlying infrastructure. You are responsible for security 'in' the cloud, such as who can access your data and how your resources are configured. We return to this in the lesson on IAM."
    ],
    takeaways: [
      "Cloud computing is on-demand, pay-as-you-go computing over the internet.",
      "AWS is a large catalogue of services, usable via console, CLI, SDKs and infrastructure as code.",
      "Security is shared: AWS secures the cloud, and you secure what you put in it."
    ]
  },
  {
    title: "Regions, Availability Zones and the global infrastructure",
    video: "",
    intro: "How AWS is physically organised around the world and why that matters for your design.",
    body: [
      "AWS runs its services from data centres located around the world. Two ideas organise them: Regions and Availability Zones.",
      { h: "Regions" },
      "A Region is a separate geographic area, for example Europe (Ireland) or US East (N. Virginia). Each Region has a code such as eu-west-1 or us-east-1. Resources you create live in a Region you choose, and Regions are isolated from each other by design.",
      { h: "Availability Zones" },
      "An Availability Zone (AZ) is one or more data centres within a Region, with independent power, cooling and networking. Each Region has multiple AZs, connected by fast, low-latency links. Spreading your application across more than one AZ keeps it running if a single data centre has a problem.",
      { h: "Edge locations" },
      "Beyond Regions, AWS operates many edge locations that cache content close to users. Services such as Amazon CloudFront use them to deliver websites and media faster.",
      { h: "How to choose a Region" },
      { ul: [
        "Latency: pick a Region close to your users.",
        "Data residency and compliance: some data must stay in a particular country or area.",
        "Service availability: not every service or feature is in every Region.",
        "Price: costs can differ between Regions."
      ] },
      { note: "Check which Region the console is showing before you create anything. Resources created in one Region do not appear in another, which is a common source of 'where did my server go?' confusion." },
      "A good starting habit is to design for at least two Availability Zones for anything important."
    ],
    takeaways: [
      "A Region is a geographic area. An Availability Zone is a data centre group inside it.",
      "Use multiple AZs for resilience.",
      "Choose a Region based on latency, compliance, service availability and price."
    ]
  },
  {
    title: "Accounts, IAM and keeping things secure",
    video: "",
    intro: "The first things to set up in any AWS account to keep it safe: root user protection and IAM.",
    body: [
      "Security is the most important habit to build from day one. Start with how identities and permissions work.",
      { h: "The root user" },
      "When you create an AWS account, the sign-in email and password belong to the root user, which has unrestricted access. Protect it with multi-factor authentication (MFA), use it only for the few tasks that require it, and do not create access keys for it.",
      { h: "AWS Identity and Access Management (IAM)" },
      "IAM controls who can do what in your account. Its main building blocks are:",
      { ul: [
        "Users: identities for people or applications.",
        "Groups: collections of users that share permissions.",
        "Roles: identities that are assumed temporarily, used by AWS services and applications instead of long-lived passwords.",
        "Policies: documents that define permissions."
      ] },
      { h: "Policies and least privilege" },
      "A policy is a JSON document that says which actions are allowed on which resources. The principle of least privilege means granting only the permissions needed for the job. This example allows reading objects from one S3 bucket and nothing else:",
      { code: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetObject\"],\n      \"Resource\": \"arn:aws:s3:::example-bucket/*\"\n    }\n  ]\n}" },
      { h: "Good habits" },
      { ul: [
        "Turn on MFA for the root user and for every person who signs in.",
        "Prefer roles and temporary credentials to long-lived access keys.",
        "For people, use AWS IAM Identity Center for sign-in across accounts.",
        "Give permissions through groups or roles, not one by one.",
        "Review permissions regularly and remove what is not used."
      ] }
    ],
    takeaways: [
      "Protect the root user with MFA and avoid using it day to day.",
      "IAM users, groups, roles and policies control access.",
      "Grant least privilege and prefer temporary credentials."
    ]
  },
  {
    title: "Compute: EC2, Lambda and containers",
    video: "",
    intro: "The main ways to run code on AWS, and how to choose between them.",
    body: [
      "Compute services are where your application code runs. AWS offers several models, ranging from virtual servers you manage to services where you manage almost nothing.",
      { h: "Amazon EC2: virtual servers" },
      "Amazon Elastic Compute Cloud (EC2) gives you virtual servers called instances. You choose an instance type (the mix of CPU, memory and networking) and an Amazon Machine Image (AMI), which defines the operating system and software. You have full control and also full responsibility for patching and managing the server.",
      { h: "AWS Lambda: serverless functions" },
      "With AWS Lambda you upload a function and AWS runs it in response to events, such as a file arriving in storage or a web request. You do not manage servers, you pay only for the time your code runs, and it scales automatically. A single invocation can run for up to 15 minutes, so it suits short tasks.",
      { h: "Containers" },
      { ul: [
        "Amazon ECS: AWS's container orchestration service.",
        "Amazon EKS: managed Kubernetes.",
        "AWS Fargate: runs containers without you managing the servers underneath."
      ] },
      "Containers package an application with everything it needs, so it runs the same everywhere.",
      { h: "Other options" },
      "AWS Elastic Beanstalk and AWS App Runner deploy web applications with less setup by handling much of the infrastructure for you.",
      { h: "How to choose" },
      { ul: [
        "Short, event-driven tasks: Lambda.",
        "Packaged applications and microservices: containers, with Fargate if you want less management.",
        "Full control, special software or long-running workloads: EC2.",
        "Simple web app and little appetite for infrastructure: App Runner or Elastic Beanstalk."
      ] },
      { note: "Stop or terminate EC2 instances you are not using. A running instance keeps costing money even when nothing is happening on it." }
    ],
    takeaways: [
      "EC2 is full-control virtual servers, Lambda is serverless functions, and containers sit in between.",
      "More managed services mean less operational work and less control.",
      "Match the compute option to the workload, and switch off what you are not using."
    ]
  },
  {
    title: "Storage and databases",
    video: "",
    intro: "Where your data lives on AWS: object, block and file storage, and the main database services.",
    body: [
      { h: "Amazon S3: object storage" },
      "Amazon Simple Storage Service (S3) stores files, called objects, in containers called buckets. It is designed for very high durability (11 nines), scales without limits and is used for everything from website assets and backups to data lakes. S3 offers storage classes, such as Standard and Glacier archive classes, so you can pay less for data you rarely access.",
      "Bucket names are globally unique, and new buckets block public access by default, which is the safe setting.",
      { code: "# create a bucket and upload a file\naws s3 mb s3://my-unique-bucket-name\naws s3 cp index.html s3://my-unique-bucket-name/\naws s3 ls s3://my-unique-bucket-name/" },
      { h: "Block and file storage" },
      { ul: [
        "Amazon EBS: block storage volumes attached to EC2 instances, like a hard disk for a server.",
        "Amazon EFS: a shared file system that many instances can use at once."
      ] },
      { h: "Databases" },
      { ul: [
        "Amazon RDS: managed relational databases such as PostgreSQL and MySQL. AWS handles backups and patching.",
        "Amazon Aurora: a high-performance relational database compatible with MySQL and PostgreSQL.",
        "Amazon DynamoDB: a serverless NoSQL key-value and document database for fast, large-scale workloads.",
        "Amazon Redshift: a data warehouse for analytics across large datasets."
      ] },
      { h: "Choosing" },
      "Use S3 for files and backups, EBS for server disks, RDS or Aurora when you need relational data and SQL, DynamoDB for simple, massively scalable lookups, and Redshift for reporting and analysis.",
      { note: "Try it: create a bucket, upload a small web page and enable static website hosting to see how little setup is needed. Delete the bucket afterwards to avoid charges." }
    ],
    takeaways: [
      "S3 is object storage, EBS is a server disk, and EFS is a shared file system.",
      "RDS and Aurora are relational, DynamoDB is NoSQL, and Redshift is for analytics.",
      "S3 buckets block public access by default. Keep it that way unless you need otherwise."
    ]
  },
  {
    title: "Networking basics: VPC, subnets and security groups",
    video: "",
    intro: "How your resources connect to each other and to the internet, and how to control that traffic.",
    body: [
      "Networking decides who and what can reach your resources. AWS gives you a private network of your own, and tools to control traffic into and out of it.",
      { h: "Amazon VPC" },
      "An Amazon Virtual Private Cloud (VPC) is your own isolated virtual network inside a Region. You choose its private IP address range and divide it into subnets.",
      { h: "Subnets and routing" },
      { ul: [
        "Public subnet: has a route to an internet gateway, so resources can be reached from the internet. Use it for things like load balancers.",
        "Private subnet: has no direct route from the internet. Use it for databases and application servers.",
        "NAT gateway: lets resources in private subnets reach the internet, for updates for example, without being reachable from it.",
        "Route tables: rules that say where network traffic goes."
      ] },
      { h: "Controlling traffic" },
      { ul: [
        "Security groups: virtual firewalls attached to resources. They are stateful, meaning replies to allowed traffic are automatically allowed, and they allow only what you explicitly permit.",
        "Network ACLs: optional stateless rules applied at the subnet level."
      ] },
      { h: "Related services" },
      { ul: [
        "Amazon Route 53: DNS, which translates names like example.com into addresses.",
        "Elastic Load Balancing: spreads traffic across multiple servers and zones.",
        "Amazon CloudFront: a content delivery network that caches content close to users."
      ] },
      { h: "A common layout" },
      { code: "Internet\n   |\nLoad balancer          (public subnets, two Availability Zones)\n   |\nApplication servers    (private subnets)\n   |\nDatabase               (private subnets, no internet access)" },
      "Only open the ports you need, and avoid allowing access from anywhere on the internet to management ports such as SSH."
    ],
    takeaways: [
      "A VPC is your private network, split into public and private subnets.",
      "Security groups act as stateful firewalls. Allow only what is needed.",
      "Keep databases and application servers in private subnets."
    ]
  },
  {
    title: "Cost, monitoring and next steps",
    video: "",
    intro: "How to keep bills predictable, see what is happening in your account and plan where to go from here.",
    body: [
      { h: "Understanding cost" },
      "AWS is mostly pay as you go, so you are charged for what you use: compute time, storage, data transfer and requests. For steady workloads you can commit to usage in return for lower prices with options such as Savings Plans. AWS also offers a free tier, but the terms differ by account and change over time, so read the current rules before you rely on it.",
      { h: "Keep bills under control" },
      { ul: [
        "Set up AWS Budgets with alerts so you hear about unexpected spend early.",
        "Use Cost Explorer to see where money is going.",
        "Tag resources with labels such as project and owner so you can attribute costs.",
        "Delete resources when you finish learning or testing, including storage, databases and load balancers."
      ] },
      { h: "Monitoring and auditing" },
      { ul: [
        "Amazon CloudWatch: collects metrics and logs, draws dashboards and triggers alarms, for example when a server's CPU is very high.",
        "AWS CloudTrail: records API activity in your account, so you can see who did what and when."
      ] },
      { h: "The Well-Architected Framework" },
      "AWS describes good design through six pillars: operational excellence, security, reliability, performance efficiency, cost optimisation and sustainability. It is a useful checklist whenever you review a design.",
      { h: "Where next" },
      { ul: [
        "Practise by building something small, such as a static website on S3 with CloudFront in front of it.",
        "Consider the AWS Certified Cloud Practitioner certification as a structured next goal.",
        "Take AI on AWS to learn how to build AI applications with Amazon Bedrock and related services."
      ] },
      { note: "AWS services, features and prices change often. Treat this course as a guide, and check the official AWS documentation for the latest details." }
    ],
    takeaways: [
      "Set budgets and alerts on day one, and clean up unused resources.",
      "CloudWatch shows what is happening, and CloudTrail shows who did what.",
      "Use the Well-Architected pillars as a checklist."
    ]
  }
];
