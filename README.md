# Clarity: A Minimalist To-Do List

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GoncaloLeitao/clarity-a-minimalist-to-do-list)

Clarity is a minimalist, visually-appealing to-do list application designed for focus and simplicity. It provides full CRUD (Create, Read, Update, Delete) functionality for tasks in a serene, single-view interface. The application emphasizes a premium user experience with fluid animations powered by Framer Motion for all interactions, such as adding, completing, and deleting tasks. The frontend is meticulously crafted with shadcn/ui and Tailwind CSS, adhering to a strict minimalist design philosophy with generous whitespace, a refined color palette, and elegant typography. All task data is seamlessly persisted on Cloudflare's edge network via a single Durable Object, ensuring low-latency and reliable state management.

## Key Features

-   **Full CRUD Functionality**: Create, read, update, and delete tasks with ease.
-   **Fluid Animations**: Smooth and delightful animations for all user interactions, powered by Framer Motion.
-   **Minimalist Design**: A clean, focused interface built with shadcn/ui and Tailwind CSS.
-   **Task Filtering**: Filter tasks by their status (All, Active, Completed).
-   **Bulk Actions**: Clear all completed tasks with a single click.
-   **Edge Persistence**: State is managed by a single Cloudflare Durable Object for fast, global access.
-   **Responsive Perfection**: Flawless user experience across all device sizes.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, shadcn/ui, Tailwind CSS, Framer Motion, Zustand
-   **Backend**: Cloudflare Workers, Hono
-   **Persistence**: Cloudflare Durable Objects
-   **Icons**: Lucide React
-   **Tooling**: Bun, Wrangler CLI

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/clarity_todo.git
    cd clarity_todo
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

## Development

To start the local development server, which includes both the Vite frontend and the Wrangler server for the backend worker, run the following command:

```sh
bun run dev
```

This will start the Vite development server (typically on `http://localhost:3000`) and the Cloudflare Worker locally. The Vite server is configured to proxy API requests (`/api/*`) to the local worker instance, enabling seamless full-stack development.

## Project Structure

-   `src/`: Contains the frontend React application source code.
    -   `pages/`: Main application pages.
    -   `components/`: Reusable React components.
    -   `hooks/`: Custom React hooks.
    -   `lib/`: Utility functions.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `index.ts`: The entry point for the worker.
    -   `userRoutes.ts`: Hono API route definitions.
    -   `durableObject.ts`: The implementation of the `GlobalDurableObject` for state persistence.
-   `shared/`: Contains TypeScript types that are shared between the frontend and backend.

## Deployment

This application is designed to be deployed to the Cloudflare network.

1.  **Log in to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the frontend application and deploy it along with the worker to Cloudflare.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GoncaloLeitao/clarity-a-minimalist-to-do-list)

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.