export const formats = [
  "highlight",
  "header",
  "font",
  "size",
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
