from flask import Flask
from flask_cors import CORS
from backend.routes.loginRoutes import login_bp
from backend.routes.ocurrenceRoutes import occurrence_bp
from backend.routes.cargoRoutes import cargos_bp
from backend.routes.pilotsRoutes import pilots_bp
from backend.routes.hospitalRoutes import hospitalRoute

app = Flask(__name__)
CORS(app)

app.register_blueprint(login_bp)
app.register_blueprint(occurrence_bp)
app.register_blueprint(cargos_bp)
app.register_blueprint(pilots_bp)
app.register_blueprint(hospitalRoute)

if __name__ == '__main__':
    app.run(debug=True)