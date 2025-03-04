# HomePort

## Description

HomePort is a full-stack Airbnb clone that allows users to list properties, make bookings, and explore available accommodations. The platform provides a seamless experience for both hosts and guests with an intuitive user interface and comprehensive booking management.

## Live Demo

[View Live Site](https://mod5-frontend-project.onrender.com)

## Technologies Used

- **Frontend:** JavaScript, React, Redux
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT

## Features

- **User Authentication:** Secure login and registration with JWT
- **Property Listings:** Complete CRUD functionality for hosts to manage their properties
- **Booking System:** Interactive calendar for availability and reservation management
- **Search & Filters:** Find properties by location, dates, price range, and amenities
- **Reviews & Ratings:** Leave and view property reviews
- **Responsive Design:** Optimized for desktop and mobile devices with CSS3 flexbox/grid layouts

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/homeport.git

# Navigate to the project directory
cd homeport

# Install dependencies
npm install

# Create and configure .env file based on .env.example
cp .env.example .env

# Setup the database
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Start the development server
npm start
```

## API Endpoints

- **GET /api/properties** - Get all properties
- **GET /api/properties/:id** - Get property details
- **POST /api/properties** - Create a new property listing
- **PUT /api/properties/:id** - Update property details
- **DELETE /api/properties/:id** - Delete a property
- **GET /api/bookings** - Get user bookings
- **POST /api/bookings** - Create a new booking

## Challenges and Learnings

- Implemented normalized Redux state management for optimal data handling and component rendering
- Created an intuitive booking system with date validation and conflict prevention
- Developed a responsive design system with dynamic image previews and adaptive layouts
- Structured the database schema to efficiently handle the relationships between users, properties, and bookings

## Future Enhancements

- Integrated payment processing
- Messaging system between hosts and guests
- Google Maps API integration for location-based search
- Wishlist functionality for saving favorite properties
- Host and guest verification system

## Contact

Muhammad Elshareif - melshareif1@gmail.com - https://www.linkedin.com/in/muhammad-elshareif-746145206/

Project Link: [https://github.com/yourusername/homeport](https://github.com/muhammadelshareif/homeport)
