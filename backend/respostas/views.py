from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.utils import timezone
from django.http import HttpResponse
import django_filters
import csv

from .models import Resposta
from .serializers import RespostaSerializer
from .pagination import RespostaPagination
from core.permissions import IsRelatorios, IsAdmin


class RespostaFilter(django_filters.FilterSet):
    data_inicio = django_filters.DateFilter(field_name='data_submissao', lookup_expr='gte')
    data_fim = django_filters.DateFilter(field_name='data_submissao', lookup_expr='lte')

    class Meta:
        model = Resposta
        fields = []


class RespostaCreateView(CreateAPIView):
    serializer_class = RespostaSerializer
    permission_classes = [AllowAny]


class RespostaListView(ListAPIView):
    serializer_class = RespostaSerializer
    permission_classes = [IsAuthenticated, IsRelatorios | IsAdmin]
    pagination_class = RespostaPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = RespostaFilter
    ordering_fields = ['data_submissao']
    ordering = ['-data_submissao']

    def get_queryset(self):
        return Resposta.objects.all()


class RespostaResumoView(APIView):
    permission_classes = [IsAuthenticated, IsRelatorios | IsAdmin]

    def get(self, request):
        total = Resposta.objects.count()
        
        # Contagem por dia (últimos 30 dias)
        from django.db.models.functions import TruncDate
        from datetime import timedelta
        data_limite = timezone.now() - timedelta(days=30)
        diario = Resposta.objects.filter(data_submissao__gte=data_limite) \
                                 .annotate(dia=TruncDate('data_submissao')) \
                                 .values('dia') \
                                 .annotate(count=Count('id')) \
                                 .order_by('dia')

        data = {
            'total': total,
            'diario_30dias': list(diario),
        }
        return Response(data)


class ExportarRespostasCSV(APIView):
    permission_classes = [IsAuthenticated, IsRelatorios | IsAdmin]

    def get(self, request):
        queryset = Resposta.objects.all()

        data_inicio = request.query_params.get('data_inicio')
        if data_inicio:
            queryset = queryset.filter(data_submissao__date__gte=data_inicio)

        data_fim = request.query_params.get('data_fim')
        if data_fim:
            queryset = queryset.filter(data_submissao__date__lte=data_fim)

        queryset = queryset.order_by('-data_submissao')

        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="respostas_{}.csv"'.format(
            timezone.now().strftime('%Y%m%d_%H%M%S')
        )

        writer = csv.writer(response, delimiter=';', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(['ID', 'Data/Hora', 'Nome', 'E-mail', 'Mensagem'])

        for r in queryset:
            writer.writerow([
                r.id,
                r.data_submissao.strftime('%d/%m/%Y %H:%M:%S'),
                r.nome or '',
                r.email or '',
                r.mensagem or ''
            ])

        return response