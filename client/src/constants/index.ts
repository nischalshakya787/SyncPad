export const formats = [
  "highlight",
  "header",
  "font",
  "size", // Added size
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }], // Added font size options
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ color: [] }],
    [{ background: [] }],
    [{ script: "sub" }],
    [{ script: "super" }],
    [{ align: [] }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

export const personaBots = [
  "Kimberly",
  "Avery",
  "Brooklynn",
  "Leo",
  "Christian",
  "Leah",
  "Sawyer",
  "Vivian",
  "Nolan",
  "Wyatt",
  "Kingston",
  "Oliver",
  "Chase",
  "Valentina",
  "Eliza",
  "Sara",
];

export const resumeTemplate = `
<h1>
  <strong style="color: rgb(240, 102, 102);">[Full Name]</strong>
</h1>
<p>📍 [City, State] | 📞 [Phone Number] | ✉️ [Email Address] | 💻 [Portfolio/LinkedIn/GitHub]</p>
<p><br></p>

<h2>
  <strong style="color: rgb(240, 102, 102);">Objective</strong>
</h2>
<p>
  [Write a brief career objective here. Example: "Motivated software engineer with a strong background in full-stack development, seeking to leverage technical skills to build scalable applications and impactful user experiences."]
</p>
<p><br></p>

<h2>
  <strong style="color: rgb(240, 102, 102);">Education</strong>
</h2>
<ul>
  <li><strong>[Degree, Major]</strong> – [University Name]</li>
  <li><em>[Start Year] – [End Year]</em></li>
  <li>[Optional: GPA or other honors, e.g., "Graduated with Distinction"]</li>
  <li><strong>[High School Diploma]</strong> – [School Name]</li>
  <li><em>[Graduation Year]</em></li>
</ul>
<p><br></p>

<h2>
  <strong style="color: rgb(240, 102, 102);">Experience</strong>
</h2>
<ul>
  <li><strong>[Job Title]</strong> – [Company Name]</li>
  <li><em>[Start Date] – [End Date]</em></li>
  <li class="ql-indent-1">[Responsibility or Achievement #1]</li>
  <li class="ql-indent-1">[Responsibility or Achievement #2]</li>
  <li class="ql-indent-1">[Responsibility or Achievement #3]</li>
  
  <li><strong>[Internship or Volunteer Position]</strong> – [Organization Name]</li>
  <li><em>[Start Date] – [End Date]</em></li>
  <li class="ql-indent-1">[Responsibility or Achievement #1]</li>
  <li class="ql-indent-1">[Responsibility or Achievement #2]</li>
</ul>
<p><br></p>

<h2>
  <strong style="color: rgb(240, 102, 102);">Projects</strong>
</h2>
<ul>
  <li><strong>[Project Name]</strong>: [Short description of what the project is, its purpose, and technologies used.]</li>
  <li><strong>[Project Name]</strong>: [Short description of what the project is, its purpose, and technologies used.]</li>
</ul>
<p><br></p>

<h2>
  <strong style="color: rgb(240, 102, 102);">Skills</strong>
</h2>
<ul>
  <li><strong>Programming Languages:</strong> [e.g., JavaScript, Python, Java]</li>
  <li><strong>Frameworks &amp; Libraries:</strong> [e.g., React.js, Node.js, Django]</li>
  <li><strong>Tools &amp; Platforms:</strong> [e.g., Git, Docker, AWS]</li>
  <li><strong>Soft Skills:</strong> [e.g., Team Collaboration, Problem Solving]</li>
</ul>
<p><br></p>

<h2>
  <strong style="color: rgb(240, 102, 102);">Achievements</strong>
</h2>
<ul>
  <li>[Award or Certification, e.g., "AWS Certified Solutions Architect"]</li>
  <li>[Recognition, e.g., "Hackathon Winner: Built an AI-powered chatbot in 24 hours"]</li>
</ul>
<p><br></p>

<h2>
  <strong style="color: rgb(240, 102, 102);">Interests</strong>
</h2>
<ul>
  <li>[Interest #1, e.g., Artificial Intelligence]</li>
  <li>[Interest #2, e.g., Open Source Contribution]</li>
  <li>[Interest #3, e.g., Playing Guitar]</li>
</ul>
`;

export const letterTemplate = `
<h3>[Your Address]</h3>
<h3>[City, State, ZIP Code]</h3>
<h3><br></h3>
<h3>[Date]</h3>
<h3><br></h3>

<h3>[Recipient's Name]</h3>
<h3>[Recipient's Title or Department]</h3>
<h3>[Company/Organization Name]</h3>
<h3>[Address Line 1]</h3>
<h3>[City, State, ZIP Code]</h3>
<h3><br></h3>

<h3><strong>Dear [Recipient's Name/Title],</strong></h3>
<h3>
  I am writing to [state the purpose of the letter]. [Briefly introduce yourself if the recipient may not be familiar with you, e.g., "As a recent graduate with a degree in Computer Engineering, I am reaching out to express my interest in your open Software Developer position."]
</h3>
<h3>[Body Paragraph #1: Provide details about the purpose of the letter. If this is a cover letter, highlight your qualifications, achievements, or relevant experiences. Tailor the content to the recipient.]</h3>
<h3>[Body Paragraph #2: Expand on why you are writing. For a cover letter, explain why you are interested in the position and what makes you a strong fit for the role.]</h3>
<h3>[Optional Closing Paragraph: Include a call-to-action or express gratitude. For example, "I would be thrilled to discuss how my skills align with your team's goals. Thank you for considering my application."]</h3>

<p><br></p>

<h3><strong>Sincerely,</strong></h3>
<h3>[Your Full Name]</h3>
<h3>[Your Phone Number]</h3>
<h3>[Your Email Address]</h3>
<h3>[Optional: Your LinkedIn or Portfolio Link]</h3>

`;
