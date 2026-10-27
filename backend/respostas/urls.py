from django.urls import path
from .views import (
    RespostaCreateView,
    RespostaListView,
    RespostaResumoView,
    ExportarRespostasCSV,
)

urlpatterns = [
    path('criar/', RespostaCreateView.as_view(), name='resposta-create'),
    path('listar/', RespostaListView.as_view(), name='resposta-list'),
    path('resumo/', RespostaResumoView.as_view(), name='resposta-resumo'),
    path('exportar/', ExportarRespostasCSV.as_view(), name='resposta-export'),
]