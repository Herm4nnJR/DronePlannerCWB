from functools import wraps
from flask import jsonify

def jsonify_list_of_objects(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        list_of_objects = f(*args, **kwargs)
        return jsonify([obj.to_dict() for obj in list_of_objects])
    return decorated_function