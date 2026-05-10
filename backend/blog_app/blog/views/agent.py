from rest_framework.views import APIView
from rest_framework.response import Response
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("groq_api_key"),
    base_url="https://api.groq.com/openai/v1",
)


class ChatBotView(APIView):
    def post(self, request):

        message = request.data.get("message")

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": """
You are an expert AI language interpreter.

Your job is to deeply analyze the user's message and explain:

1. Hidden meaning
2. Emotional tone
3. Psychological intent
4. What the person may truly mean
5. Contextual interpretation
6. Deep explanation in simple language

Always provide thoughtful and emotionally intelligent responses.

""",
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        reply = completion.choices[0].message.content

        return Response({"reply": reply})
