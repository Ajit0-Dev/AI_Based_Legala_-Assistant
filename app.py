"""Flask Web Application for AI Legal Assistant"""
import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from crew import legal_assistant_crew

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['JSON_SORT_KEYS'] = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_case():
    try:
        data = request.get_json()
        if not data or 'case_description' not in data:
            return jsonify({'success': False, 'error': 'Please provide a case description'}), 400
        
        case_description = data.get('case_description', '').strip()
        if not case_description:
            return jsonify({'success': False, 'error': 'Case description cannot be empty'}), 400
        
        result = legal_assistant_crew.kickoff(inputs={"user_input": case_description})
        return jsonify({'success': True, 'result': str(result)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'message': 'AI Legal Assistant is running'}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'production') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
