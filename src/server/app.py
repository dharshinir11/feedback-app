from flask import Flask, request, jsonify, render_template, redirect, session, url_for, send_file
from flask_cors import CORS
import json
import os
import pandas as pd
from flask import Flask, render_template
import random


app = Flask(__name__)
CORS(app)
app.secret_key = 'admin_secret_key'

DATA_FILE = "data/feedback.json"



@app.route('/')
def home():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()

    if not os.path.exists(DATA_FILE):
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)

    with open(DATA_FILE, 'r') as f:
        all_data = json.load(f)

    all_data.append(data)

    with open(DATA_FILE, 'w') as f:
        json.dump(all_data, f, indent=4)

    return jsonify({"status": "success"})


@app.route('/export-excel', methods=['GET'])
def export_excel():
    if not os.path.exists(DATA_FILE):
        return jsonify({"error": "No feedback yet!"}), 404

    with open(DATA_FILE, 'r') as f:
        feedback_data = json.load(f)

    department_feedback = {}
    for entry in feedback_data:
        dept = entry['dept']
        if dept not in department_feedback:
            department_feedback[dept] = []

        department_feedback[dept].append({
            'Name': entry['user'],
            'Email': entry['email'],
            'Register No': entry['reg'],
            'Day': entry.get('day', 'N/A'),
            'Session Topic': entry['session']['topic'],
            'Session Time': entry['session']['time'],
            'Q1: How did you feel?': entry['answers'][0],
            'Q2: Was it helpful?': entry['answers'][1],
            'Q3: Suggestions?': entry['answers'][2]
        })

    excel_path = 'data/feedback_export.xlsx'
    with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
        for dept, records in department_feedback.items():
            df = pd.DataFrame(records)
            df.to_excel(writer, sheet_name=dept, index=False)

    return send_file(excel_path, as_attachment=True)


@app.route('/data', methods=['GET'])
def get_feedback():
    if not os.path.exists(DATA_FILE):
        return jsonify([])
    with open(DATA_FILE, 'r') as f:
        return jsonify(json.load(f))


@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        password = request.form['password']
        if password == "admin123":
            session['admin'] = True
            return redirect('/admin')
        else:
            return render_template('login.html', error="Incorrect password.")
    return render_template('login.html')


@app.route('/admin')
def admin_dashboard():
    if not session.get('admin'):
        return redirect(url_for('admin_login'))
    return render_template('admin.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('admin_login'))

# @app.route('/session_data')
# def get_session_data():
#     with open('static/session_data.json', 'r') as f:
#         return jsonify(json.load(f))


@app.route('/session_data', methods=['POST'])
def get_session_data():
    data = request.get_json()
    dept = data.get('dept', '').upper()

    with open(SESSION_FILE, 'r') as f:
        session_data = json.load(f)

    
    departments = {k.upper(): v for k, v in session_data.items()}
    
    if dept in departments:
        return jsonify(departments[dept])
    else:
        return jsonify({"error": "Department not found", "sessions": []})

@app.route('/questions')
def questions():
    with open('static/questions.json') as f:
        data = json.load(f)
    return jsonify(data)

@app.context_processor
def inject_random():
    return {'random': lambda: random.randint(0, 999999)}

if __name__ == '__main__':
    app.run(debug=True)



