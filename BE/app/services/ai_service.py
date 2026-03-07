import os
import json
from openai import OpenAI
from app.services.product_service import ProductService

product_service = ProductService()

# kiểm tra API key
api_key = os.getenv("AI_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1"
)


class AIService:

    # ===============================
    # Phân tích câu hỏi → JSON filter
    # ===============================
    def analyze_question(self, question):

        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """
Bạn là AI phân tích câu hỏi để tạo JSON filter sản phẩm.

Các field có thể có:

name
min_price
max_price
category_name
supplier_name
sort

sort có thể là:

price_desc = sản phẩm đắt nhất
price_asc = sản phẩm rẻ nhất
newest = sản phẩm mới
expiry_soon = gần hết hạn

Chỉ trả về JSON. Không giải thích.

Ví dụ:

sữa dưới 50000

{
"name":"sữa",
"max_price":50000
}

sản phẩm đắt nhất

{
"sort":"price_desc"
}
"""
                },
                {
                    "role": "user",
                    "content": question
                }
            ],
            temperature=0.2
        )

        text = response.choices[0].message.content.strip()

        # xử lý nếu GPT trả về ```json
        text = text.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(text)
        except:
            return {}

    # ===============================
    # Tìm sản phẩm trong DB
    # ===============================
    def search_products(self, filters):

        products = product_service.get_all_products(
            name=filters.get("name"),
            category_name=filters.get("category_name"),
            supplier_name=filters.get("supplier_name"),
            min_price=filters.get("min_price"),
            max_price=filters.get("max_price"),
            sort=filters.get("sort"),
            page=1,
            page_size=10
        )

        return products

    # ===============================
    # Tạo câu trả lời cho user
    # ===============================
    def generate_answer(self, question, products):

        if not products:
            return "❌ Không tìm thấy sản phẩm phù hợp."

        product_list = "\n".join(
            [f"- {p['name']} ({p['price']} VND)" for p in products]
        )

        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Bạn là trợ lý bán hàng thân thiện tư vấn sản phẩm bằng tiếng Việt."
                },
                {
                    "role": "user",
                    "content": f"""
Danh sách sản phẩm:

{product_list}

Khách hỏi:
{question}

Hãy tư vấn ngắn gọn.
"""
                }
            ]
        )

        return response.choices[0].message.content