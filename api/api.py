from flask import Flask, jsonify
from flask_cors import CORS
from controllers import get_insurers, generate_quotes, generate_pdf

app = Flask(__name__)
CORS(app)

# Routes
app.add_url_rule('/api/insurers', 'get_insurers', get_insurers, methods=['GET'])
app.add_url_rule('/api/quotes', 'generate_quotes', generate_quotes, methods=['POST'])
app.add_url_rule('/api/generate-pdf', 'generate_pdf', generate_pdf, methods=['POST'])

# Handler pour les méthodes non autorisées
@app.route('/api/quotes', methods=['GET'])
def quotes_get_handler():
    return jsonify({
        "error": "Method Not Allowed",
        "message": "Please use POST method with form data to generate quotes"
    }), 405

if __name__ == '__main__':
    app.run(port=5000, debug=True)