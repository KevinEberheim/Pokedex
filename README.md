# Pokedex

A modern, interactive Pokedex web application that allows users to explore and search Pokémon from the official Pokémon database.

## Features

- **Browse Pokémon**: View a dynamically loaded list of Pokémon with lazy loading
- **Search Functionality**: Search for Pokémon by name in real-time
- **Detailed View**: Click on any Pokémon to view detailed information in a modal dialog
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices
- **Navigation**: Navigate through Pokémon details using arrow keys
- **Modern UI**: Clean and intuitive user interface with custom styling

## Technologies Used

- **HTML5**: Semantic markup and accessibility features
- **CSS3**: Modular stylesheets with responsive design
- **JavaScript (Vanilla)**: No frameworks, pure JavaScript implementation
- **PokéAPI**: Free, open-source Pokémon API for data retrieval

## Project Structure

```
├── index.html              # Main HTML file
├── script.js               # Main JavaScript logic
├── style.css               # Global styles
├── fonts/                  # Font files
│   └── Raleway/
├── img/                    # Image assets (logo, favicon)
├── scripts/
│   └── templates.js        # HTML templates and components
└── styles/
    ├── assets.css          # Asset-related styles
    ├── color.css           # Color scheme and theming
    ├── dialog.css          # Dialog/modal styles
    ├── fonts.css           # Font definitions
    ├── responsive.css      # Media queries and responsive rules
    ├── spinner.css         # Loading spinner styles
    └── standard.css        # Standard/base styles
```

## How to Use

1. **Open in Browser**: Simply open `index.html` in a web browser
2. **Browse Pokémon**: The application loads Pokémon automatically upon initialization
3. **Search**: Enter a Pokémon name in the search box and click "Search" to filter results
4. **Reset**: Click "Reset" to clear the search and view all Pokémon
5. **View Details**: Click on any Pokémon card to see detailed information
6. **Navigate**: Use arrow keys to navigate between Pokémon details
7. **Close Dialog**: Click the close button (×) or anywhere outside the dialog to close it

## API Reference

This application uses the **PokéAPI** (https://pokeapi.co/):
- Fetches Pokémon data with pagination
- Loads Pokémon details on demand
- Retrieves type information for filtering

## Installation

No installation required! Simply:
1. Clone or download the repository
2. Open `index.html` in any modern web browser
3. Start exploring Pokémon!

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

### Lazy Loading
The application implements lazy loading to improve performance by loading Pokémon in batches of 20 as the user scrolls.

### Real-time Search
Search results are filtered in real-time as you type, with helpful error messages if no matches are found.

### Accessible Dialogs
The Pokémon detail modal includes proper ARIA labels and supports keyboard navigation.

## License

© 2025 Kevin Eberheim

---

Developed as part of the Developer Akademie portfolio.
