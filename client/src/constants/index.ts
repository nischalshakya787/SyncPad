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
<h1 style="text-align: center;">[Full Name]</h1>
<p style="text-align: center;">
  📍 [City, State] | 📞 [Phone Number] | ✉️ [Email Address] | 💻 [Portfolio/LinkedIn/GitHub]
</p>
<hr />

<h2>Objective</h2>
<p>
  [A brief statement about your career goals, key skills, and what you bring to a prospective role.]
</p>

<h2>Education</h2>
<ul>
  <li>
    <strong>[Degree, Major]</strong><br />
    [University Name, Location]<br />
    <em>[Start Year] - [Graduation Year]</em>
  </li>
  <li>
    <strong>[High School Diploma or Equivalent]</strong><br />
    [School Name, Location]<br />
    <em>[Graduation Year]</em>
  </li>
</ul>

<h2>Skills</h2>
<ul>
  [Include Your Skills]
</ul>

<h2>Experience</h2>
<ul>
  <li>
    <strong>[Job Title]</strong> - [Company Name]<br />
    <em>[Start Month/Year] - [End Month/Year or Present]</em><br />
    - [Responsibility or achievement #1]<br />
    - [Responsibility or achievement #2]<br />
    - [Responsibility or achievement #3]
  </li>
  <li>
    <strong>[Internship or Volunteer Position]</strong> - [Organization Name]<br />
    <em>[Start Month/Year] - [End Month/Year]</em><br />
    - [Responsibility or achievement #1]<br />
    - [Responsibility or achievement #2]
  </li>
</ul>

<h2>Projects</h2>
<ul>
  <li>
    <strong>[Project Name]</strong>: [Short description of the project, highlighting technologies used and impact or purpose].
  </li>
  <li>
    <strong>[Project Name]</strong>: [Short description of the project, highlighting technologies used and impact or purpose].
  </li>
</ul>

<h2>Achievements</h2>
<ul>
  <li>[Award or Certification]</li>
  <li>[Recognition]</li>
</ul>

<h2>Interests</h2>
<ul>
  <li>[Interest #1]</li>
  <li>[Interest #2]</li>
  <li>[Interest #3]</li>
</ul>
`;
