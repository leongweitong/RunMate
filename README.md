
# RunMate

**RunMate** is a feature-rich mobile app designed to help runners track their activities, analyze performance, and stay motivated toward achieving their fitness goals. With real-time GPS tracking, detailed performance insights, and a user-friendly interface, RunMate is your personal running companion.

## Features

- **GPS Tracking:** Accurately track your running route and distance in real time.
- **Performance Analysis:** Visualize your speed, pace, and time through graphs and charts.
- **Activity Mapping:** Display your run with a smooth polyline path on a map.
- **Goal Tracking:** Set running goals and monitor progress towards achieving them.
- **Progress Visualization:** Analyze past runs to understand trends and improve over time.
- **Multilingual Support:** Switch between languages like English and Chinese.
- **AI Coaching (Coming Soon):** Personalized tips based on your running data.
  
## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Mobile Framework:** Cordova
- **Map:** Leaflet, Turf.js for geospatial calculations
- **Data Storage:** IndexedDB (via `react-indexed-db-hook`)
- **Charts:** Recharts for performance visualization

## Getting Started

To get started with the RunMate project locally, follow these steps:

### Prerequisites

- Node.js
- npm or Yarn
- Cordova CLI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/leongweitong/RunMate.git
   cd RunMate
   ```

2. **Install the dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   Or using Yarn:
   ```bash
   yarn install
   ```

3. **Build the React app:**
   ```bash
   npm run build
   ```

4. **Integrate the build with Cordova:**
   Ensure that the build output is copied into the Cordova `www` directory:
   ```bash
   npm run build-cordova
   ```

5. **Run the app on a device or emulator:**
   ```bash
   cordova run android
   ```
   Replace `android` with `ios` if you are developing for iOS.

### Local Development

1. **Run the React development server:**
   ```bash
   npm run dev
   ```

2. **Cordova Development:**
   After making changes to the React code, rebuild and redeploy the app using Cordova:
   ```bash
   npm run build-cordova
   cd runmate
   cordova build
   cordova run android
   ```

### IndexedDB Configuration

RunMate uses `react-indexed-db-hook` to store activity data locally. Ensure that your IndexedDB schema is set up correctly in `indexedDB.js` for handling activity data such as total distance, path, and time.

## Usage

1. **Start a Run:** Begin tracking your run with GPS, and monitor your distance and time.
2. **Review Runs:** After completing a run, view detailed insights on speed, pace, and path.
3. **Set and Achieve Goals:** Set goals like a 10 km run and track your progress over time.
4. **Analyze Performance:** Use the analysis page to visualize trends and optimize your training.
5. **Languages:** Switch between English and Chinese to cater to your preferred language.

## Contributing

Contributions are welcome! If you'd like to contribute to RunMate, you can contact my email for details: tongweileong0724@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
