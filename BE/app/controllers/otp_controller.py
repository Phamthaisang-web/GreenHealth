from flask import request, jsonify
from app.services.otp_service import OTPService

otp_service = OTPService()

def send_otp():
    email = request.json.get("email")
    if not email:
        return jsonify({"message": "Thiếu email"}), 400

    return jsonify(otp_service.send_email_otp(email)), 200


def verify_otp():
    data = request.json or {}
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"message": "Thiếu email hoặc OTP"}), 400

    result = otp_service.verify_email_otp(email, otp)
    return jsonify(result), (200 if "error" not in result else 400)
