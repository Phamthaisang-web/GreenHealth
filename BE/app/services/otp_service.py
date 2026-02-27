from datetime import datetime, timedelta
from app.utils.otp_helper import generate_otp
from app.utils.mail_helper import send_otp_email
from app.models.otp_model import OTPModel

class OTPService:
    def __init__(self):
        self.model = OTPModel()

    def send_email_otp(self, email):
        otp = generate_otp()
        expired_at = datetime.utcnow() + timedelta(minutes=5)

        self.model.create_otp(email, otp, expired_at)
        send_otp_email(email, otp)

        return {"message": "Đã gửi OTP qua email"}

    def verify_email_otp(self, email, otp):
        record = self.model.get_valid_otp(email, otp)

        if not record:
            return {"error": "OTP không hợp lệ hoặc đã hết hạn"}

        self.model.mark_used(record["id"])
        return {"message": "Xác thực OTP thành công"}
