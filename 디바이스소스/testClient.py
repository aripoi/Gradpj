import requests
import json

# POST 요청을 보낼 URL을 정의합니다.
url = "http://ceprjmaker.iptime.org:10000/make_cocktail"

# 전송할 JSON 데이터를 정의합니다.
data = {
    "UserID": "하마도리",
    "recipeTitle": "test",
    "first": 15,
    "second": 30,
    "third": 60,
    "fourth": 60
}

# POST 요청으로 JSON 데이터를 전송합니다.
response = requests.post(url, json=data)

# 응답을 확인합니다.
if response.status_code == 200:
    print("POST 요청이 성공했습니다.")
    response_data = response.json()
    print("서버에서 받은 응답 데이터:")
    print(response_data)
else:
    print(f"POST 요청이 실패했습니다. 상태 코드: {response.status_code}")
