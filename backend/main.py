from flask import Flask
from flask_cors import CORS
from routes.loginRoutes import login_bp
from routes.ocurrenceRoutes import occurrence_bp
from routes.cargoRoutes import cargos_bp
from routes.pilotsRoutes import pilots_bp
from routes.hospitalRoutes import hospital_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(login_bp)
app.register_blueprint(occurrence_bp)
app.register_blueprint(cargos_bp)
app.register_blueprint(pilots_bp)
app.register_blueprint(hospital_bp)

if __name__ == '__main__':
    app.run(debug=True)