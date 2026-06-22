from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)  # Initialize db with app
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/history')
def history():
    return render_template('history.html')

@app.route('/report')
def report():
    return render_template('report.html')

@app.route('/customize')
def customize():
    return render_template('customize.html')

def create_db():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    from auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)
    app.run(debug=True)
