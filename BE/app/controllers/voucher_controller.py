from flask import request, jsonify
from app.services.voucher_service import VoucherService


class VoucherController:

    def __init__(self):
        self.voucher_service = VoucherService()

    # ========================
    # Lấy danh sách
    # ========================
    def get_all(self):

        try:
            data = self.voucher_service.get_all_vouchers()

            return jsonify({
                "data": data
            }), 200

        except Exception as e:
            return jsonify({
                "message": "Lỗi hệ thống",
                "error": str(e)
            }), 500


    # ========================
    # Tạo voucher
    # ========================
    def create(self):

        try:
            data = request.get_json()

            required = [
                "code", "discount_type", "discount_value",
                "min_order_value", "max_discount",
                "quantity", "start_date", "end_date"
            ]

            for field in required:
                if field not in data:
                    return jsonify({
                        "message": f"Thiếu {field}"
                    }), 400

            voucher_id = self.voucher_service.create_voucher(data)

            return jsonify({
                "message": "Tạo voucher thành công",
                "id": voucher_id
            }), 201

        except Exception as e:
            return jsonify({
                "message": "Lỗi hệ thống",
                "error": str(e)
            }), 500


    # ========================
    # Cập nhật voucher
    # ========================
    def update(self, voucher_id):

        try:
            data = request.get_json()

            result = self.voucher_service.update_voucher(voucher_id, data)

            return jsonify({
                "message": "Cập nhật voucher thành công"
            }), 200

        except Exception as e:
            return jsonify({
                "message": "Lỗi hệ thống",
                "error": str(e)
            }), 500


    # ========================
    # Xóa voucher
    # ========================
    def delete(self, voucher_id):

        try:
            self.voucher_service.delete_voucher(voucher_id)

            return jsonify({
                "message": "Xóa voucher thành công"
            }), 200

        except Exception as e:
            return jsonify({
                "message": "Lỗi hệ thống",
                "error": str(e)
            }), 500


    # ========================
    # Check voucher
    # ========================
    def check_voucher(self):

        try:
            data = request.get_json()

            code = data.get("code")
            total = data.get("total_amount")

            if not code or not total:
                return jsonify({
                    "message": "Thiếu code hoặc total_amount"
                }), 400

            voucher, error = self.voucher_service.validate_voucher(code, total)

            if error:
                return jsonify({
                    "message": error
                }), 400

            return jsonify({
                "message": "Voucher hợp lệ",
                "voucher": voucher
            }), 200

        except Exception as e:
            return jsonify({
                "message": "Lỗi hệ thống",
                "error": str(e)
            }), 500