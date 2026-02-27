import smtplib
from email.mime.text import MIMEText
import os

def send_otp_email(to_email, otp):
    msg = MIMEText(f"Mã OTP của bạn là: {otp}\nCó hiệu lực trong 5 phút.")
    msg["Subject"] = "Xác thực OTP"
    msg["From"] = os.getenv("MAIL_USER")
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(
            os.getenv("MAIL_USER"),
            os.getenv("MAIL_PASSWORD")
        )
        server.send_message(msg)
