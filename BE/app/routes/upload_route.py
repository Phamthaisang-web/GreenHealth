import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.utils.file_helper import allowed_file

upload_bp = Blueprint("upload", __name__, url_prefix="/upload")

@upload_bp.route("/image", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"message": "Không có file gửi lên"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"message": "Chưa chọn file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"message": "File không đúng định dạng ảnh"}), 400

    filename = secure_filename(file.filename)
    upload_folder = current_app.config["UPLOAD_FOLDER"]

    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    return jsonify({
        "message": "Upload ảnh thành công",
        "filename": filename,
        "url": f"/uploads/{filename}"
    }), 201
