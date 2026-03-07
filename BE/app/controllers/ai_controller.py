from flask import request, jsonify
from app.services.ai_service import AIService

ai_service = AIService()

def ask_ai():

    data = request.json
    question = data.get("question")

    if not question:
        return jsonify({"error": "Thiếu câu hỏi"}), 400

    try:

        # 1 phân tích câu hỏi
        filters = ai_service.analyze_question(question)

        # 2 tìm sản phẩm
        products = ai_service.search_products(filters)

        # 3 tạo câu trả lời
        answer = ai_service.generate_answer(question, products)

        return jsonify({
            "filters": filters,
            "answer": answer,
            "products": products
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500