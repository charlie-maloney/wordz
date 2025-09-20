# Wordz

Wordz is a web application built using Next.js and React.

## Features

- Built with **Next.js** for server-side rendering and static site generation.
- Developed using **React** for building interactive user interfaces.
- **TypeScript** is used for type safety and better developer experience.
- Integrated with **Supabase** for backend services, including authentication and database management.
- Code quality ensured with **ESLint**.
- Pre-commit hooks managed by **Husky**.
- Staged file linting with **lint-staged**.

## Project Structure

- `src/app`: Contains the main application files, including global styles and layout.
- `src/components`: Houses reusable UI components.
- `src/integrations`: Includes integrations like Supabase.
- `src/lib`: Utility functions and helpers.
- `public`: Static assets such as images and icons.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js >=22.0.0
- yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd wordz
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build

To create a production build:

```bash
npm run build
# or
yarn build
```

### Linting

Run the linter to check for code quality:

```bash
npm run lint
# or
yarn lint
```
