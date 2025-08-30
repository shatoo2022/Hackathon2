from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
jwt = JWTManager(app)
CORS(app)  # Enable CORS for all routes

# Initialize the donations.json file if it doesn't exist
if not os.path.exists('donations.json'):
    with open('donations.json', 'w') as f:
        json.dump([], f)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/signup', methods=['POST'])
def api_signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not all([email, password, name]):
            return jsonify({"error": "All fields are required"}), 400

        # Load existing users
        with open('users.json', 'r') as f:
            users = json.load(f)

        # Check if user already exists
        if any(user['email'] == email for user in users):
            return jsonify({"error": "Email already registered"}), 400

        # Create new user
        new_user = {
            'name': name,
            'email': email,
            'password': generate_password_hash(password)
        }
        users.append(new_user)

        # Save updated users
        with open('users.json', 'w') as f:
            json.dump(users, f, indent=4)

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({"error": "Email and password are required"}), 400

        # Load users
        with open('users.json', 'r') as f:
            users = json.load(f)

        # Find user
        user = next((user for user in users if user['email'] == email), None)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Create access token
        access_token = create_access_token(identity=email)
        return jsonify({
            "token": access_token,
            "name": user['name']
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/donate')
def donate():
    return render_template('donate.html')

@app.route('/listings')
def listings():
    return render_template('listings.html')

@app.route('/api/donate', methods=['POST'])
def add_donation():
    try:
        new_donation = request.json
        
        # Basic validation
        required_fields = ['name', 'foodItem', 'quantity', 'location', 'description']
        for field in required_fields:
            if field not in new_donation:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Load existing donations
        with open('donations.json', 'r+') as f:
            donations = json.load(f)
            donations.append(new_donation)
            f.seek(0)  # Move pointer to beginning of file
            f.truncate()  # Clear the file
            json.dump(donations, f, indent=4)  # Write the updated data

        return jsonify({"message": "Donation added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/listings', methods=['GET'])
def get_listings():
    try:
        with open('donations.json', 'r') as f:
            donations = json.load(f)
        return jsonify(donations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
