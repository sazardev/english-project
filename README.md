# English Project 📚

**Open Source English Learning Platform**

The English Project is a collaborative, community-driven platform designed to help English learners improve their language skills through high-quality, free resources. Built with modern web technologies and powered by community contributions.

![English Project](https://img.shields.io/badge/English-Learning-blue) ![Open Source](https://img.shields.io/badge/Open-Source-green) ![Astro](https://img.shields.io/badge/Built%20with-Astro-orange)

## 🌟 Features

- **📊 Structured Learning**: Content organized by skill level (Beginner, Intermediate, Advanced)
- **🏷️ Categorized Content**: Grammar, Vocabulary, Speaking, Listening, Writing, Reading, Pronunciation, Culture
- **📱 Mobile-First Design**: Responsive design that works on all devices
- **🤝 Community-Driven**: Anyone can contribute new lessons and improvements
- **⚡ Lightning Fast**: Built with Astro for optimal performance
- **🌐 SEO Optimized**: Proper meta tags and semantic HTML for better discoverability
- **♿ Accessible**: WCAG compliant for inclusive learning

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/sazardev/english-project.git

# Navigate to the project directory
cd english-project

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:4321` to see the website in action!

## 🏗️ Project Structure

```
/
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── components/         # Reusable Astro components
│   │   ├── BlogCard.astro
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── content/            # Content collections
│   │   ├── config.ts       # Content schema definitions
│   │   └── blog/           # Blog posts (MDX files)
│   ├── layouts/            # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── MainLayout.astro
│   │   └── BlogLayout.astro
│   └── pages/              # File-based routing
│       ├── index.astro     # Homepage
│       ├── about.astro     # About page
│       ├── categories.astro
│       ├── levels.astro
│       ├── contribute.astro
│       └── blog/
│           ├── index.astro     # Blog listing
│           └── [slug].astro    # Dynamic blog post pages
├── astro.config.mjs        # Astro configuration
└── package.json
```

## 📝 Contributing

We welcome contributions from everyone! Here's how you can help:

### Types of Contributions

1. **📚 Content Creation**: Write new lessons, exercises, and learning materials
2. **🔍 Content Review**: Review and improve existing content
3. **🐛 Bug Reports**: Report issues or errors you find
4. **💡 Feature Requests**: Suggest new features or improvements
5. **🎨 Design**: Improve the user interface and experience
6. **🌍 Translation**: Help make content accessible in multiple languages

### Creating Content

#### Lesson Structure

All lessons should be written in MDX format with the following frontmatter:

```markdown
---
title: "Your Lesson Title"
description: "Brief description of what learners will gain"
category: "grammar" | "vocabulary" | "speaking" | "listening" | "writing" | "reading" | "pronunciation" | "culture"
level: "beginner" | "intermediate" | "advanced"
tags: ["tag1", "tag2", "tag3"]
author: "Your Name"
readingTime: 10
featured: false
publishDate: 2024-06-10
---

# Your Lesson Title

Content goes here...
```

#### Content Guidelines

- **Clear Structure**: Use headings, subheadings, and bullet points
- **Practical Examples**: Include real-world usage examples
- **Interactive Elements**: Add exercises and practice activities
- **Cultural Context**: Explain cultural nuances when relevant
- **Progressive Difficulty**: Start simple and build complexity

#### Special Components

Use these custom components to enhance your lessons:

```markdown
<div class="example-box">
Example content here
</div>

<div class="tip-box">
💡 **Pro Tip:** Your helpful tip here
</div>

<div class="vocabulary-box">
**Word:** Definition and usage
</div>

<div class="exercise-box">
Practice exercise content
</div>
```

### Submission Process

1. **Fork** the repository
2. **Create** a new branch for your contribution
3. **Add** your content following our guidelines
4. **Test** your changes locally
5. **Submit** a pull request with a clear description

## 🎯 Content Categories

### Grammar

- Tenses and verb forms
- Sentence structure
- Parts of speech
- Punctuation rules

### Vocabulary

- Themed word lists
- Synonyms and antonyms
- Collocations
- Academic/Business vocabulary

### Speaking

- Pronunciation guides
- Conversation skills
- Public speaking
- Accent training

### Listening

- Comprehension exercises
- Listening strategies
- Audio materials
- Accent recognition

### Writing

- Essay structure
- Creative writing
- Business communication
- Academic writing

### Reading

- Comprehension strategies
- Speed reading
- Critical analysis
- Literature appreciation

### Pronunciation

- Phonetic symbols
- Word stress
- Intonation patterns
- Connected speech

### Culture

- Idioms and expressions
- Cultural context
- Social customs
- Regional differences

## 🎓 Skill Levels

### Beginner (A1-A2)

- Basic vocabulary (1000-2000 words)
- Simple present tense
- Elementary grammar
- Common phrases

### Intermediate (B1-B2)

- Expanded vocabulary (3000-5000 words)
- Multiple tenses
- Complex sentences
- Professional contexts

### Advanced (C1-C2)

- Sophisticated vocabulary (5000+ words)
- Complex grammar
- Idiomatic expressions
- Cultural nuances

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) - Modern static site generator
- **Content**: [MDX](https://mdxjs.com) - Markdown with React components
- **Styling**: Pure CSS with CSS custom properties
- **Typography**: Inter font family
- **Deployment**: Vercel/Netlify ready

## 📊 Performance

- **Lighthouse Score**: 100/100 across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimal JavaScript for maximum speed
- **SEO**: Fully optimized for search engines

## 🌍 Accessibility

- **WCAG 2.1 AA** compliant
- **Keyboard navigation** support
- **Screen reader** friendly
- **High contrast** color scheme
- **Scalable text** for better readability

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Community

- **GitHub Discussions**: For questions and community discussions
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Wiki**: For detailed documentation

## 🙏 Acknowledgments

- All contributors who help make English learning accessible
- The Astro team for creating an amazing framework
- The open-source community for inspiration and support

## 📞 Contact

- **Email**: sazardev@gmail.com
- **GitHub**: [@sazardev](https://github.com/sazardev)
- **Website**: [https://the-english-project.netlify.app](https://the-english-project.netlify.app)

---

**Made with ❤️ by the English Project community**
