from flask import Flask, render_template
from dotenv import load_dotenv
import os

# 加载环境变量
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True) 