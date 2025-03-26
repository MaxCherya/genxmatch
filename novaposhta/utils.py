import os
import requests
from django.conf import settings

NOVA_POSHTA_URL = "https://api.novaposhta.ua/v2.0/json/"
API_KEY = os.getenv("NOVA_POSHTA_API_KEY", "")

def nova_poshta_request(model_name, called_method, method_properties=None):
    payload = {
        "apiKey": API_KEY,
        "modelName": model_name,
        "calledMethod": called_method,
        "methodProperties": method_properties or {}
    }

    response = requests.post(NOVA_POSHTA_URL, json=payload)
    return response.json()
