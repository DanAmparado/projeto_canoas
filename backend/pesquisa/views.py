from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.throttling import AnonRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg
from django.utils import timezone
from django.http import HttpResponse
import django_filters
import csv

from .models import Pesquisa
from .serializers import PesquisaSerializer
from .pagination import PesquisaPagination
from core.permissions import IsRelatorios, IsAdmin

class DenunciaThrottle(AnonRateThrottle):
    scope = 'denuncia'

# Filtro personalizado para Pesquisa
class PesquisaFilter(django_filters.FilterSet):
    data_inicio = django_filters.DateFilter(field_name='data_submissao', lookup_expr='gte')
    data_fim = django_filters.DateFilter(field_name='data_submissao', lookup_expr='lte')

    class Meta:
        model = Pesquisa
        fields = ['setor', 'situacao_atual', 'atividade_securitario', 'afastamento_saude_mental']


# View pública para submissão do formulário (sem autenticação)
class PesquisaCreateView(CreateAPIView):
    serializer_class = PesquisaSerializer
    permission_classes = [AllowAny]
    throttle_classes = [DenunciaThrottle]


# View para listar respostas (apenas relatórios/admin), com paginação e filtros
class PesquisaListView(ListAPIView):
    serializer_class = PesquisaSerializer
    permission_classes = [IsAuthenticated, IsRelatorios | IsAdmin]
    pagination_class = PesquisaPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PesquisaFilter
    ordering_fields = ['data_submissao', 'setor', 'situacao_atual']
    ordering = ['-data_submissao']

    def get_queryset(self):
        return Pesquisa.objects.all()


# View para resumo (dashboard)
class PesquisaResumoView(APIView):
    permission_classes = [IsAuthenticated, IsRelatorios | IsAdmin]

    def get(self, request):
        total = Pesquisa.objects.count()

        # Contagens por campo
        por_setor = Pesquisa.objects.values('setor').annotate(count=Count('id'))
        por_situacao = Pesquisa.objects.values('situacao_atual').annotate(count=Count('id'))
        por_atividade = Pesquisa.objects.values('atividade_securitario').annotate(count=Count('id'))
        por_afastamento = Pesquisa.objects.values('afastamento_saude_mental').annotate(count=Count('id'))
        por_tempo_empresa = Pesquisa.objects.values('tempo_empresa').annotate(count=Count('id'))
        por_rotatividade = Pesquisa.objects.values('rotatividade').annotate(count=Count('id'))
        por_desigualdade = Pesquisa.objects.values('desigualdade_representacao').annotate(count=Count('id'))

        # Médias das escalas
        media_realismo = Pesquisa.objects.aggregate(media=Avg('metas_realismo'))['media'] or 0
        media_treinamento = Pesquisa.objects.aggregate(media=Avg('treinamento_preparacao'))['media'] or 0
        media_cx = Pesquisa.objects.aggregate(media=Avg('cx_avaliacao'))['media'] or 0

        data = {
            'total': total,
            'por_setor': list(por_setor),
            'por_situacao': list(por_situacao),
            'por_atividade': list(por_atividade),
            'por_afastamento': list(por_afastamento),
            'por_tempo_empresa': list(por_tempo_empresa),
            'por_rotatividade': list(por_rotatividade),
            'por_desigualdade': list(por_desigualdade),
            'media_realismo_metas': round(media_realismo, 2),
            'media_treinamento': round(media_treinamento, 2),
            'media_cx': round(media_cx, 2),
        }
        return Response(data)


# View para exportar CSV (com os mesmos filtros da listagem)
class ExportarPesquisasCSV(APIView):
    permission_classes = [IsAuthenticated, IsRelatorios | IsAdmin]

    def get(self, request):
        queryset = Pesquisa.objects.all()

        # Aplica os mesmos filtros da listagem
        setor = request.query_params.get('setor')
        if setor:
            queryset = queryset.filter(setor=setor)

        situacao = request.query_params.get('situacao_atual')
        if situacao:
            queryset = queryset.filter(situacao_atual=situacao)

        atividade = request.query_params.get('atividade_securitario')
        if atividade:
            queryset = queryset.filter(atividade_securitario=atividade)

        afastamento = request.query_params.get('afastamento_saude_mental')
        if afastamento:
            queryset = queryset.filter(afastamento_saude_mental=afastamento)

        data_inicio = request.query_params.get('data_inicio')
        if data_inicio:
            queryset = queryset.filter(data_submissao__date__gte=data_inicio)

        data_fim = request.query_params.get('data_fim')
        if data_fim:
            queryset = queryset.filter(data_submissao__date__lte=data_fim)

        queryset = queryset.order_by('-data_submissao')

        # Cria a resposta HTTP com cabeçalho CSV
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="denuncias_{}.csv"'.format(
            timezone.now().strftime('%Y%m%d_%H%M%S')
        )

        writer = csv.writer(response, delimiter=';', quoting=csv.QUOTE_MINIMAL)

        # Cabeçalho
        writer.writerow([
            'ID', 'Data/Hora', 'Setor', 'Outro Setor', 'Cargo Formal', 'Outro Cargo',
            'Função Efetiva', 'Outra Função', 'Situação Atual', 'Supervisão', 'Tempo de Empresa',
            'Atividade Securitário', 'Atividade Extra Cargo', 'Descrição Atividade Extra',
            'Metas Definição', 'Descrição Metas', 'Metas Realismo',
            'Cobrança Fora Controle', 'Exemplos Cobrança', 'Metas Pressão', 'Metas Abusivas',
            'Caso Específico Metas', 'Remuneração Faixa', 'Bonificações Faixa', 'Recebe Comissão',
            'Aumento Atribuições', 'Descrição Aumento',
            'Treinamento Duração', 'Treinamento Preparação', 'Treinamento Supervisor',
            'Pausas Suficientes', 'Pausas Duração', 'Descrição Pausas',
            'Horas Extras Pagas', 'Horas Extras Não Compensadas', 'Relato Horas Extras',
            'Monitoramento Tipo', 'Outro Monitoramento', 'Avaliação CX',
            'Remuneração Afetada Monitoria', 'Descrição Monitoria',
            'Afastamento Saúde Mental', 'Duração Afastamento', 'Retorno Afastamento',
            'Detalhes Afastamento', 'Relação Pressão Adoecimento', 'Exemplos Pressão',
            'Humilhação', 'Descrição Humilhação',
            'Rotatividade', 'Pressão Desligamento', 'Justa Causa Injustificada',
            'Descrição Desligamento', 'Casos Justiça', 'Descrição Casos Justiça',
            'Desigualdade Representação', 'Descrição Desigualdade',
            'Racismo Assédio', 'Resposta Empresa', 'Descrição Discriminação',
            'Nepotismo', 'Descrição Nepotismo', 'Observações Finais'
        ])

        # Linhas
        for p in queryset:
            writer.writerow([
                p.id,
                p.data_submissao.strftime('%d/%m/%Y %H:%M:%S'),
                p.setor or '',
                p.setor_outro or '',
                p.cargo_formal or '',
                p.cargo_formal_outro or '',
                ', '.join(p.funcao_efetiva) if p.funcao_efetiva else '',
                p.funcao_efetiva_outro or '',
                p.situacao_atual or '',
                p.supervisao or '',
                p.tempo_empresa or '',
                p.atividade_securitario or '',
                p.atividade_extra_cargo or '',
                p.atividade_extra_cargo_descricao or '',
                p.metas_definicao or '',
                p.metas_definicao_descricao or '',
                p.metas_realismo or '',
                p.cobranca_fora_controle or '',
                p.cobranca_fora_controle_exemplos or '',
                p.metas_pressao or '',
                p.metas_abusivas or '',
                p.metas_caso_especifico or '',
                p.remuneracao_faixa or '',
                p.bonificacoes_faixa or '',
                p.recebe_comissao or '',
                p.aumento_atribuicoes or '',
                p.aumento_atribuicoes_descricao or '',
                p.treinamento_duracao or '',
                p.treinamento_preparacao or '',
                p.treinamento_supervisor or '',
                p.pausas_suficientes or '',
                p.pausas_duracao or '',
                p.pausas_descricao or '',
                p.horas_extras_pagas or '',
                p.horas_extras_nao_compensadas or '',
                p.horas_extras_relato or '',
                p.monitoramento_tipo or '',
                p.monitoramento_outro or '',
                p.cx_avaliacao or '',
                p.remuneracao_afetada_monitoria or '',
                p.remuneracao_monitoria_descricao or '',
                p.afastamento_saude_mental or '',
                p.afastamento_duracao or '',
                p.afastamento_retorno or '',
                p.afastamento_detalhes or '',
                p.relacao_pressao_adoecimento or '',
                p.relacao_pressao_exemplos or '',
                p.humilhacao or '',
                p.humilhacao_descricao or '',
                p.rotatividade or '',
                p.pressao_desligamento or '',
                p.justa_causa_injustificada or '',
                p.desligamento_descricao or '',
                p.casos_justica or '',
                p.casos_justica_descricao or '',
                p.desigualdade_representacao or '',
                p.desigualdade_descricao or '',
                p.racismo_assédio or '',
                p.empresa_resposta or '',
                p.discriminacao_descricao or '',
                p.nepotismo or '',
                p.nepotismo_descricao or '',
                p.observacoes_finais or ''
            ])

        return response