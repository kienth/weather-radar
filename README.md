## Prerequisites

Before setting up this project, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (v9.0.0 or higher) or **pnpm** (recommended)
  - npm comes with Node.js
  - For pnpm: `npm install -g pnpm`
  - Verify installation: `npm --version` or `pnpm --version`
- **Git** (for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## Installation

### Method 1: Clone from Repository (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/kienth/weather-radar.git
   cd weather-radar
   ```

### Method 2: Download ZIP

1. **Download the project**

   - Download the ZIP file from the repository
   - Extract to your desired location
   - Navigate to the project directory

2. **Open terminal/command prompt**
   ```bash
   cd path/to/weather-radar
   ```

---

## Development Setup

### 1. Install Dependencies

Choose one of the following package managers:

#### Using pnpm (Recommended)

```bash
pnpm install
```

#### Using npm

```bash
npm install --legacy-peer-deps
```

#### Using yarn

```bash
yarn install
```

### 2. Verify Installation

Check that all dependencies were installed correctly:

```bash
ls node_modules
```

You should see directories for packages like `next`, `react`, `leaflet`, etc.

## Running the Application

### Development Mode

Start the development server with hot reloading:

#### Using pnpm

```bash
pnpm dev
```

#### Using npm

```bash
npm run dev
```

#### Using yarn

```bash
yarn dev
```

### Access the Application

1. **Open your browser** and navigate to:

   ```
   http://localhost:3000
   ```

2. **Expected behavior**:
   - The application should load with a dark-themed interface
   - You should see a map of the Continental United States
   - Radar data should start loading automatically
   - The sidebar should show coverage information and reflectivity scale

### Development Features

- **Hot Reloading**: Changes to code will automatically refresh the browser
- **Error Overlay**: TypeScript and runtime errors will be displayed in the browser
- **Console Logging**: Check browser console for radar data fetch logs
