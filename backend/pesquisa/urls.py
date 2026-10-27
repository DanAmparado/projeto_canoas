from django.urls import path
from .views import (
    PesquisaCreateView,
    PesquisaListView,
    PesquisaResumoView,
    ExportarPesquisasCSV,
)

urlpatterns = [
    path('criar/', PesquisaCreateView.as_view(), name='pesquisa-create'),
    path('listar/', PesquisaListView.as_view(), name='pesquisa-list'),
    path('resumo/', PesquisaResumoView.as_view(), name='pesquisa-resumo'),
    path('exportar/', ExportarPesquisasCSV.as_view(), name='pesquisa-export'),
]