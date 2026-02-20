# 🎬 AskMovies - Complete Website

A modern, responsive movie listing website with advanced filtering, search, and pagination features.

## 📁 Project Structure

```
askmovies/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All CSS styles
├── js/
│   ├── movies-data.js     # Movies database (EDIT THIS TO ADD/UPDATE MOVIES)
│   └── app.js             # Main application logic
└── README.md              # This file
```

## 🚀 Quick Start

### Option 1: Open Locally
1. Download all files maintaining the folder structure
2. Open `index.html` in your browser
3. Done!

### Option 2: Host on Web Server
1. Upload all files to your web hosting (maintain folder structure)
2. Make sure `css/` and `js/` folders are uploaded
3. Access via your domain

### Option 3: GitHub Pages
1. Create a new repository
2. Upload all files (maintain folder structure)
3. Go to Settings → Pages
4. Select main branch
5. Your site will be live!

## ✏️ How to Update Movies

Open `js/movies-data.js` and edit the `moviesData` array:

```javascript
const moviesData = [
    {
        title: "Your Movie Title",
        year: 2024,
        quality: "HD",              // or "PreDvd"
        category: ["Tamil", "Action"], // or ["English", "Action"]
        image: "https://your-image-url.com/poster.jpg",
        telegramLink: "https://t.me/askmovies"
    },
    // Add more movies...
];
```

### Movie Properties:
- **title** (string): Movie name
- **year** (number): Release year
- **quality** (string): "HD" or "PreDvd"
- **category** (array): ["Tamil", "Action"] or ["English", "Action"]
- **image** (string): Poster image URL
- **telegramLink** (string): Your Telegram channel link

## 🎨 Features

✅ **Text Logo**: "Ask" (red) + "Movies" (grey) + 🎥 (animated)
✅ **Hamburger Menu**: 3 horizontal lines
✅ **Search**: Expandable search with live filtering
✅ **Category Filters**: All, Tamil, English, Action, HD, PreDvd
✅ **Pagination**: 20 movies per page with page numbers
✅ **Telegram Button**: Contact button in footer with pulse animation
✅ **Fully Responsive**: Works on desktop, tablet, and mobile
✅ **Smooth Animations**: Logo float, underline expand, card hover effects
✅ **Auto ID Generation**: No need to manually assign IDs

## 🎯 File Descriptions

### index.html
- Main HTML structure
- Links to external CSS and JS files
- Contains all HTML elements

### css/style.css
- Complete stylesheet
- CSS variables for easy customization
- Responsive breakpoints
- All animations and transitions

### js/movies-data.js
- **EDIT THIS FILE** to add/update movies
- Simple array structure
- Easy to maintain

### js/app.js
- Main application logic
- Filter system
- Search functionality
- Pagination
- Event handlers

## 🎨 Customization

### Change Colors
Edit CSS variables in `css/style.css`:

```css
:root {
    --color-accent-red: #e60000;    /* Main red color */
    --color-bg-primary: #0a0a0a;    /* Background */
    /* ... more variables */
}
```

### Change Movies Per Page
Edit in `js/app.js`:

```javascript
const state = {
    moviesPerPage: 20,  // Change this number
    // ...
};
```

### Change Telegram Link
Edit in `index.html` (footer section) and `js/movies-data.js`

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (4 columns)
- **Tablet**: 768-1024px (3 columns)
- **Mobile**: 480-768px (2 columns)
- **Small**: < 480px (2 columns, compact)

## 🐛 Troubleshooting

### Movies Not Showing
- Check if `js/movies-data.js` is loaded
- Check browser console for errors
- Verify folder structure is correct

### Styles Not Working
- Verify `css/style.css` path is correct
- Check if CSS file exists in `css/` folder

### Search/Filters Not Working
- Check if `js/app.js` is loaded
- Verify JavaScript is enabled in browser

## 🔄 Updates & Maintenance

### To Add New Movies:
1. Open `js/movies-data.js`
2. Add new object to `moviesData` array
3. Save and refresh browser

### To Remove Movies:
1. Open `js/movies-data.js`
2. Delete the movie object
3. Save and refresh browser

### To Update Existing Movies:
1. Open `js/movies-data.js`
2. Find and edit the movie properties
3. Save and refresh browser

## 📊 Technical Details

- **Pure JavaScript**: No frameworks required
- **No Backend**: Static files only
- **Fast Loading**: Optimized CSS and JS
- **SEO Friendly**: Semantic HTML structure
- **Cross-Browser**: Works on all modern browsers

## 📞 Support

Need help? Contact us on Telegram: https://t.me/askmovies

## 📄 License

All rights reserved © 2025 AskMovies

---

**Made with ❤️ by AskMovies Team**
