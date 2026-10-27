import json
import urllib.request
import urllib.parse
from django.conf import settings


def verify_hcaptcha(token):
    """
    Verifica o token do hCaptcha junto ao serviço oficial.
    Retorna True se válido, False caso contrário.
    """
    if not token:
        return False

    secret = settings.HCAPTCHA_SECRET
    if not secret:
        return False

    data = urllib.parse.urlencode({
        'secret': secret,
        'response': token,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://hcaptcha.com/siteverify',
        data=data,
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('success', False)
    except Exception:
        return False