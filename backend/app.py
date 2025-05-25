from flask import Flask, jsonify
from flask_cors import CORS
import os, json

app = Flask(__name__)
CORS(app) 

@app.route('/instructors')
def get_instructors():
    with open(os.path.join(os.path.dirname(__file__), '../data/raw/instructors.json')) as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
