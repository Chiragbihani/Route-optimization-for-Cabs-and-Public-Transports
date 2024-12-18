# Cab Fare Optimization and Public Transport Integration App

## Project Overview
This project is a React Native application designed to optimize travel routes by integrating public transport and cab services. The app leverages the Google Maps API and a custom route optimization algorithm to provide users with cost-optimized and time-optimized travel suggestions. It seamlessly combines walking, public transport, and cab rides based on user preferences, offering efficient and economical travel solutions.

---

## Features
- **Travel Route Optimization**: Offers both cost-optimized and time-optimized routes based on user preferences.
- **Integration with Public Transport and Cabs**: Combines walking, public transport, and cab rides for a seamless travel experience.
- **Dynamic Fare Estimation**: Uses custom constants for Uber, Ola, Rapido, and Namma Yatri, considering factors like distance, time, and surge multipliers.
- **Google Maps Integration**: Utilizes Google Maps API to calculate distances and determine public transport availability.
- **User-friendly Interface**: Provides an intuitive interface for selecting preferences and displaying optimized routes.

---

## Technologies Used
- **Frontend**: React Native with Expo
- **Backend**: Custom-built route optimization logic
- **APIs**: Google Maps API for geolocation and distance calculations
- **Programming Languages**: TypeScript, JavaScript

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cab-fare-optimization.git
   cd cab-fare-optimization
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Google Maps API Key:
   - Create a `.env` file in the root directory.
   - Add the following line to the `.env` file:
     ```
     GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

4. Start the application:
   ```bash
   expo start
   ```

---

## Usage
1. Launch the application on a mobile device or emulator.
2. Enter the starting point and destination.
3. Select your travel preference: **Cost** or **Time**.
4. Click on "Find Optimized Route" to view the recommended travel plan.

---

## Folder Structure
```
.
├── src
│   ├── components
│   │   ├── MapComponent.tsx
│   │   └── PreferenceSelector.tsx
│   ├── utils
│   │   ├── distanceCalculator.ts
│   │   ├── fareConstants.ts
│   │   └── routeOptimizer.ts
│   └── screens
│       ├── HomeScreen.tsx
│       └── OptimizedRouteScreen.tsx
├── App.tsx
├── package.json
└── README.md
```

---

## Algorithms
### Route Optimization Algorithm
- Determines whether walking or a cab is needed to reach public transport stations based on a walkable distance threshold (1 km).
- Calculates the total travel cost and time for each public transport option, including first- and last-mile connectivity using cabs.
- Sorts and selects the optimal route based on the user’s preference (cost or time).

### Cab Fare Calculation
- Factors in distance, time, base price, per-km rate, per-minute rate, minimum fare, and surge multiplier to estimate cab fares.

---

## Future Enhancements
- **Real-time Public Transport Data**: Incorporate live schedules and delays.
- **Multi-language Support**: Enhance accessibility for users worldwide.
- **Customizable Preferences**: Allow users to set additional preferences like eco-friendly travel modes.

---

## Contributors
- **CHIRAG BIHANI** - Developer

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact
For questions or suggestions, please contact [chiragbihani131206@gmail.com].

