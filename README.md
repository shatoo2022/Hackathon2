# Food Donation Platform

A web platform that connects food donors with people in need, helping to reduce food waste and support the community.

## Features

- User authentication (signup/login)
- Donate food items
- Browse available food donations
- Responsive design using Tailwind CSS

## Technologies Used

- Python Flask for backend
- HTML, JavaScript for frontend
- Tailwind CSS for styling
- JSON file-based storage

## Setup Instructions

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the virtual environment:
   ```bash
   source .venv/bin/activate  # On Linux/Mac
   # OR
   .venv\Scripts\activate  # On Windows
   ```
4. Install dependencies:
   ```bash
   pip install flask flask-cors flask-jwt-extended werkzeug
   ```
5. Run the application:
   ```bash
   python app.py
   ```
6. Visit http://127.0.0.1:5000 in your browser

## Project Structure

- `app.py`: Main Flask application
- `templates/`: HTML templates
- `static/`: JavaScript and static files
- `users.json`: User database
- `donations.json`: Donations database
