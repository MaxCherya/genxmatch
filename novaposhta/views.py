from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import nova_poshta_request

def get_cities(request):
    if request.method == "POST":
        data = json.loads(request.body)
        result = nova_poshta_request("Address", "getCities", data.get("methodProperties"))
        return JsonResponse(result)
    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_warehouses(request):
    if request.method == "POST":
        data = json.loads(request.body)
        result = nova_poshta_request("Address", "getWarehouses", data.get("methodProperties"))
        return JsonResponse(result)
    return JsonResponse({"error": "Method not allowed"}, status=405)