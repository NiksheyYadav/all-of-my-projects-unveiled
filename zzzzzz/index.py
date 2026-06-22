from flask import Flask

app = Flask(__name__)

@app.route('/')
def very_good():
    a = "Welcome to sgtuniversty.ac.in"
    return a

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000, debug=True)