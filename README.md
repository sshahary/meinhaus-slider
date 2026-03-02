# Astro Image Slider Project

An Astro project featuring a responsive image slider component with dynamic image management.

## 🚀 Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── astro.svg
│   ├── components/
│   │   ├── ImageSlider.astro 
│   │   └── image-slider.ts     
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🧞 Getting Started

### Option 1: Local Development

Install dependencies and run the dev server:

```sh
npm install
npm run dev
```

The site will be available at `http://localhost:4321`

### Option 2: Docker

Run the project using Docker Compose:

```sh
docker-compose up
```

The site will be available at `http://localhost:4321`

To rebuild the container after changes:

```sh
docker-compose up --build
```

To stop the container:

```sh
docker-compose down
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Docker Commands

| Command                      | Action                                        |
| :--------------------------- | :-------------------------------------------- |
| `docker-compose up`          | Start the development server in Docker        |
| `docker-compose up --build`  | Rebuild and start the container               |
| `docker-compose down`        | Stop and remove containers                    |
| `docker-compose logs -f`     | View container logs                           |

## Features

- Responsive image slider component
- Dynamic image addition via URL
- Automatic layout adjustment (1/2/3 columns based on screen size)
- Dark mode support
- Docker support for easy deployment

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
