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
<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">[Full Name]</h1>
<p style="margin: 0;">
  📍 [City, State] | 📞 [Phone Number] | ✉️ [Email Address] | 💻 [Portfolio/LinkedIn/GitHub]
</p>
<hr style="margin: 16px 0;" />

<h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Objective</h2>
<p style="margin: 0;">
  [Write a brief career objective here. Example: "Motivated software engineer with a strong background in full-stack development, seeking to leverage technical skills to build scalable applications and impactful user experiences."]
</p>

<h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; margin-top: 16px;">Education</h2>
<ul style="margin: 0; padding-left: 20px;">
  <li>
    <strong>[Degree, Major]</strong> – [University Name]<br />
    <em>[Start Year] – [End Year]</em><br />
    [Optional: GPA or other honors, e.g., "Graduated with Distinction"]
  </li>
  <li>
    <strong>[High School Diploma]</strong> – [School Name]<br />
    <em>[Graduation Year]</em>
  </li>
</ul>

<h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; margin-top: 16px;">Experience</h2>
<ul style="margin: 0; padding-left: 20px;">
  <li>
    <strong>[Job Title]</strong> – [Company Name]<br />
    <em>[Start Date] – [End Date]</em><br />
    <ul style="margin: 4px 0; padding-left: 20px;">
      <li>[Responsibility or Achievement #1]</li>
      <li>[Responsibility or Achievement #2]</li>
      <li>[Responsibility or Achievement #3]</li>
    </ul>
  </li>
  <li>
    <strong>[Internship or Volunteer Position]</strong> – [Organization Name]<br />
    <em>[Start Date] – [End Date]</em><br />
    <ul style="margin: 4px 0; padding-left: 20px;">
      <li>[Responsibility or Achievement #1]</li>
      <li>[Responsibility or Achievement #2]</li>
    </ul>
  </li>
</ul>

<h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; margin-top: 16px;">Projects</h2>
<ul style="margin: 0; padding-left: 20px;">
  <li>
    <strong>[Project Name]</strong>: [Short description of what the project is, its purpose, and technologies used.]
  </li>
  <li>
    <strong>[Project Name]</strong>: [Short description of what the project is, its purpose, and technologies used.]
  </li>
</ul>

<h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; margin-top: 16px;">Skills</h2>
<ul style="margin: 0; padding-left: 20px;">
  <li><strong>Programming Languages:</strong> [e.g., JavaScript, Python, Java]</li>
  <li><strong>Frameworks & Libraries:</strong> [e.g., React.js, Node.js, Django]</li>
  <li><strong>Tools & Platforms:</strong> [e.g., Git, Docker, AWS]</li>
  <li><strong>Soft Skills:</strong> [e.g., Team Collaboration, Problem Solving]</li>
</ul>

<h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; margin-top: 16px;">Achievements</h2>
<ul style="margin: 0; padding-left: 20px;">
  <li>[Award or Certification, e.g., "AWS Certified Solutions Architect"]</li>
  <li>[Recognition, e.g., "Hackathon Winner: Built an AI-powered chatbot in 24 hours"]</li>
</ul>

<h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; margin-top: 16px;">Interests</h2>
<ul style="margin: 0; padding-left: 20px;">
  <li>[Interest #1, e.g., Artificial Intelligence]</li>
  <li>[Interest #2, e.g., Open Source Contribution]</li>
  <li>[Interest #3, e.g., Playing Guitar]</li>
</ul>
`;

export const letterTemplate = `
<p style="text-align: right; margin-bottom: 20px; font-family: 'Arial', sans-serif; font-size: 14px;">
  [Your Address] <br />
  [City, State, ZIP Code] <br />
  [Date]
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 14px; margin-bottom: 20px;">
  [Recipient's Name] <br />
  [Recipient's Title or Department] <br />
  [Company/Organization Name] <br />
  [Address Line 1] <br />
  [City, State, ZIP Code]
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; margin-bottom: 15px;">
  Dear [Recipient's Name/Title],
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
  I am writing to [state the purpose of the letter]. [Briefly introduce yourself if the recipient may not be familiar with you, e.g., "As a recent graduate with a degree in Computer Engineering, I am reaching out to express my interest in your open Software Developer position."]
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
  [Body Paragraph #1: Provide details about the purpose of the letter. If this is a cover letter, highlight your qualifications, achievements, or relevant experiences. Tailor the content to the recipient.]
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
  [Body Paragraph #2: Expand on why you are writing. For a cover letter, explain why you are interested in the position and what makes you a strong fit for the role.]
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
  [Optional Closing Paragraph: Include a call-to-action or express gratitude. For example, "I would be thrilled to discuss how my skills align with your team's goals. Thank you for considering my application."]
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 14px; font-weight: bold; margin-bottom: 10px;">
  Sincerely,
</p>

<p style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6;">
  [Your Full Name] <br />
  [Your Phone Number] <br />
  [Your Email Address] <br />
  [Optional: Your LinkedIn or Portfolio Link]
</p>
`;
