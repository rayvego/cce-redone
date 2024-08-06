## Introduction

This web-based collaborative code editor empowers developers to write, edit, and execute code together in real-time. Whether you're pair programming, conducting a code review, or collaborating on a project, this tool provides a seamless and efficient environment.

## Key Features

1. Multi-Language Support: Write code in popular languages like Python, JavaScript, Java, PHP, and C#.
2. Real-time Collaboration: Edit code simultaneously with others, with conflict-free merging thanks to Yjs.
3. Access Control: Granular permissions for viewing and editing code, ensuring security and privacy.
4. Authentication: Secure GitHub and Google authentication through Clerk.
5. Instant Code Execution: Run your code with immediate feedback using the Piston API.
6. Performance: Optimized for speed and responsiveness with a blend of client-side and server-side rendering.
7. Type Safety: Written in TypeScript for enhanced code reliability and maintainability.ey Features


## Tech Stack

- Next.js: React framework for building modern web applications.
- Liveblocks: Real-time collaboration infrastructure.
- Yjs: A CRDT framework for conflict-free data synchronization.
- Monaco Editor: Powerful code editor component used in VS Code.
- TypeScript: Typed superset of JavaScript for safer code.
- Clerk: Authentication and user management platform.
- Shadcn UI & Tailwind CSS: Component library and utility-first CSS framework for rapid UI development.
- Piston API: Code execution engine.
- Liveblocks & Yjs Storage: Real-time data storage for collaborative sessions.


## Project Structure

- `app`: Contains Next.js page components and API routes.
- `lib`: Server-side logic and utilities.
- `public`: Static assets (images, etc.).
- `types`: TypeScript type definitions.
- `components`: Reusable UI components.


## Future Enhancements

- Real-time notifications for mentions and comments.
- User mentions and commenting functionality.
- Integrated chat and video/audio calls for enhanced collaboration.
- Live cursor and pointer visualization.


## Learning Journey

This project was a deep dive into Next.js and real-time collaboration. I initially attempted to build the code editor using documentation and online resources, but encountered challenges due to unfamiliarity with Next.js conventions and server-side rendering.  After building a smaller Next.js project to solidify my understanding, I restarted this project with a more robust architecture.

Integrating collaborative features presented the next hurdle.  While familiar with Socket.IO, I found that Next.js deployment constraints led me to explore alternatives like Pusher. However, due to documentation issues and buggy behavior, I ultimately switched to Liveblocks. A Google Docs clone tutorial helped me grasp Liveblocks' concepts, enabling me to successfully implement real-time collaboration.

While time constraints prevented adding features like chat and live cursors, these are planned enhancements.

### Key Takeaways:

- Documentation vs. Tutorials: Hands-on learning through building a project can be more effective than solely following tutorials.
- Importance of Fundamentals: Strong foundational knowledge in a framework is crucial for building complex projects.
- Flexibility: Being open to switching tools and approaches can be key to overcoming obstacles.

You can find the initial project (before refactoring and Liveblocks integration) here:
https://github.com/rayvego/collaborative-code-editor

## Learning Resources:

1. Next.js Learning Project:
- Code: https://github.com/rayvego/jsm-banking-copy
- Tutorial: https://www.youtube.com/watch?v=PuOVqP_cjkE


2. Liveblocks Learning Project:
- Code: https://github.com/rayvego/jsm-google-docs
- Tutorial: https://www.youtube.com/watch?v=y5vE8y_f_OM&t=6s