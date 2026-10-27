from django.db import models

class Pesquisa(models.Model):
    # ============================================================
    # BLOCO 1: CONSENTIMENTO
    # ============================================================
    consentimento = models.BooleanField(
        verbose_name="Você confirma que entendeu e concorda em participar?"
    )

    # ============================================================
    # BLOCO 2: IDENTIFICAÇÃO E VÍNCULO
    # ============================================================
    SETOR_CHOICES = (
        ('vendas', 'Vendas'),
        ('sac', 'SAC'),
        ('renovacao', 'Renovação'),
        ('endosso', 'Endosso'),
        ('backoffice', 'Backoffice'),
        ('cobranca', 'Cobrança'),
        ('qualidade_monitoria', 'Qualidade/Monitoria'),
        ('treinamento', 'Treinamento'),
        ('outro', 'Outro'),
    )
    setor = models.CharField(max_length=30, choices=SETOR_CHOICES, verbose_name="Setor/área")
    setor_outro = models.CharField(max_length=200, blank=True, verbose_name="Outro setor (especifique)")

    CARGO_CHOICES = (
        ('operador_telemarketing', 'Operador de telemarketing'),
        ('atendente_call_center', 'Atendente de call center'),
        ('assistente_administrativo', 'Assistente administrativo'),
        ('vendedor', 'Vendedor'),
        ('consultor_relacionamento', 'Consultor de relacionamento'),
        ('supervisor', 'Supervisor'),
        ('analista', 'Analista'),
        ('outro', 'Outro'),
    )
    cargo_formal = models.CharField(max_length=40, choices=CARGO_CHOICES, verbose_name="Cargo formal registrado")
    cargo_formal_outro = models.CharField(max_length=200, blank=True, verbose_name="Outro cargo (especifique)")

    # Múltipla escolha: armazena uma lista de strings
    funcao_efetiva = models.JSONField(
        default=list,
        verbose_name="Função efetivamente exercida (múltipla escolha)"
    )
    funcao_efetiva_outro = models.CharField(max_length=200, blank=True, verbose_name="Outra função (especifique)")

    SITUACAO_CHOICES = (
        ('ativo', 'Trabalhador(a) ativo(a)'),
        ('ex_12meses', 'Ex-funcionário(a), desligado nos últimos 12 meses'),
        ('ex_mais_1ano', 'Ex-funcionário(a), desligamento há mais de 1 ano'),
    )
    situacao_atual = models.CharField(max_length=20, choices=SITUACAO_CHOICES, verbose_name="Situação atual de vínculo")

    SUPERVISAO_CHOICES = (
        ('sou_fui', 'Sou ou fui supervisor(a)'),
        ('nunca_fui', 'Nunca fui supervisor(a)'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    supervisao = models.CharField(max_length=30, choices=SUPERVISAO_CHOICES, verbose_name="Em relação à supervisão")

    TEMPO_EMPRESA_CHOICES = (
        ('menos_3_meses', 'Menos de 3 meses'),
        ('3a6_meses', '3 a 6 meses'),
        ('6meses_1ano', '6 meses a 1 ano'),
        ('1a2_anos', '1 a 2 anos'),
        ('2a5_anos', '2 a 5 anos'),
        ('5a10_anos', '5 a 10 anos'),
        ('mais_10_anos', 'Mais de 10 anos'),
    )
    tempo_empresa = models.CharField(max_length=20, choices=TEMPO_EMPRESA_CHOICES, verbose_name="Tempo de empresa")

    # ============================================================
    # BLOCO 3: ATIVIDADES E FUNÇÃO
    # ============================================================
    ATIVIDADE_SECURITARIO_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('em_partes', 'Em partes'),
        ('outra_funcao', 'Realizo outra função (não relacionada a securitário/call center)'),
    )
    atividade_securitario = models.CharField(
        max_length=20,
        choices=ATIVIDADE_SECURITARIO_CHOICES,
        verbose_name="Considera que exerce atividades típicas de securitário?"
    )

    ATIVIDADE_EXTRA_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('em_partes', 'Em partes'),
        ('nao_sei', 'Não sei'),
    )
    atividade_extra_cargo = models.CharField(
        max_length=20,
        choices=ATIVIDADE_EXTRA_CHOICES,
        verbose_name="Exerce atividades que não constam no cargo formal?"
    )
    atividade_extra_cargo_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição das atividades que não constam no cargo formal"
    )

    METAS_DEFINICAO_CHOICES = (
        ('unilateral_gestao', 'São definidas unilateralmente pela gestão'),
        ('participacao_equipe', 'São definidas com alguma participação da equipe'),
        ('pouco_transparente', 'São definidas de forma pouco transparente'),
        ('nao_sei', 'Não sei como são definidas'),
        ('outro', 'Outro'),
    )
    metas_definicao = models.CharField(
        max_length=30,
        choices=METAS_DEFINICAO_CHOICES,
        verbose_name="Como as metas são definidas na sua área?"
    )
    metas_definicao_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição breve sobre a definição de metas"
    )

    metas_realismo = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],
        verbose_name="Metas realistas (1=Nada realistas, 5=Totalmente realistas)"
    )

    COBRANCA_FORA_CHOICES = (
        ('sim_frequentemente', 'Sim, frequentemente'),
        ('sim_as_vezes', 'Sim, às vezes'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
    )
    cobranca_fora_controle = models.CharField(
        max_length=25,
        choices=COBRANCA_FORA_CHOICES,
        verbose_name="Cobrança por fatores fora do controle?"
    )
    cobranca_fora_controle_exemplos = models.TextField(
        blank=True,
        verbose_name="Exemplos de cobrança por fatores fora do controle"
    )

    metas_pressao = models.CharField(
        max_length=25,
        choices=COBRANCA_FORA_CHOICES,
        verbose_name="Metas acompanhadas de pressão de superiores?"
    )

    METAS_ABUSIVAS_CHOICES = (
        ('sim_sempre', 'Sim, sempre'),
        ('sim_alguns_casos', 'Sim, em alguns casos'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
    )
    metas_abusivas = models.CharField(
        max_length=25,
        choices=METAS_ABUSIVAS_CHOICES,
        verbose_name="Considera as cobranças e metas abusivas?"
    )
    metas_caso_especifico = models.TextField(
        blank=True,
        verbose_name="Caso específico sobre cobranças e metas"
    )

    # ============================================================
    # BLOCO 4: REMUNERAÇÃO
    # ============================================================
    REMUNERACAO_CHOICES = (
        ('ate_1_sm', 'Até 1 salário mínimo'),
        ('1a2_sm', '1 a 2 salários mínimos'),
        ('2a3_sm', '2 a 3 salários mínimos'),
        ('3a5_sm', '3 a 5 salários mínimos'),
        ('5a10_sm', '5 a 10 salários mínimos'),
        ('mais_10_sm', 'Mais de 10 salários mínimos'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    remuneracao_faixa = models.CharField(
        max_length=25,
        choices=REMUNERACAO_CHOICES,
        verbose_name="Remuneração fixa mensal aproximada"
    )

    BONIFICACOES_CHOICES = (
        ('nao_recebo', 'Não recebo bonificações/prêmios'),
        ('ate_10pct', 'Até 10 por cento da remuneração fixa'),
        ('10a20pct', '10 a 20 por cento da remuneração fixa'),
        ('20a30pct', '20 a 30 por cento da remuneração fixa'),
        ('30a50pct', '30 a 50 por cento da remuneração fixa'),
        ('mais_50pct', 'Mais de 50 por cento da remuneração fixa'),
        ('nao_sei', 'Não sei informar'),
    )
    bonificacoes_faixa = models.CharField(
        max_length=20,
        choices=BONIFICACOES_CHOICES,
        verbose_name="Média de bonificações/prêmios mensais"
    )

    COMISSAO_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei informar'),
    )
    recebe_comissao = models.CharField(
        max_length=20,
        choices=COMISSAO_CHOICES,
        verbose_name="Recebe comissão percentual sobre vendas?"
    )

    AUMENTO_ATRIBUICOES_CHOICES = (
        ('sim_muito', 'Sim, aumentaram muito'),
        ('sim_um_pouco', 'Sim, aumentaram um pouco'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
    )
    aumento_atribuicoes = models.CharField(
        max_length=20,
        choices=AUMENTO_ATRIBUICOES_CHOICES,
        verbose_name="Atribuições aumentaram sem aumento de salário?"
    )
    aumento_atribuicoes_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição do aumento de atribuições"
    )

    # ============================================================
    # BLOCO 5: TREINAMENTO
    # ============================================================
    TREINAMENTO_DURACAO_CHOICES = (
        ('menos_1_semana', 'Menos de 1 semana'),
        ('1a2_semanas', '1 a 2 semanas'),
        ('3a4_semanas', '3 a 4 semanas'),
        ('1a2_meses', '1 a 2 meses'),
        ('mais_2_meses', 'Mais de 2 meses'),
        ('nao_houve', 'Não houve treinamento formal'),
    )
    treinamento_duracao = models.CharField(
        max_length=20,
        choices=TREINAMENTO_DURACAO_CHOICES,
        verbose_name="Duração do treinamento inicial"
    )

    treinamento_preparacao = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],
        verbose_name="Treinamento preparou? (1=Não preparou nada, 5=Preparou completamente)"
    )

    TREINAMENTO_SUPERVISOR_CHOICES = (
        ('formal_completo', 'Recebi treinamento formal completo'),
        ('formal_insuficiente', 'Recebi treinamento formal insuficiente'),
        ('aprendi_pratica', 'Aprendi principalmente na prática'),
        ('nao_aplicavel', 'Não se aplica, nunca fui supervisor'),
    )
    treinamento_supervisor = models.CharField(
        max_length=30,
        choices=TREINAMENTO_SUPERVISOR_CHOICES,
        verbose_name="Treinamento para supervisão"
    )

    # ============================================================
    # BLOCO 6: JORNADA, PAUSAS E HORAS EXTRAS
    # ============================================================
    PAUSAS_SUFICIENTES_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('parcialmente', 'Parcialmente'),
    )
    pausas_suficientes = models.CharField(
        max_length=20,
        choices=PAUSAS_SUFICIENTES_CHOICES,
        verbose_name="Pausas são suficientes na prática?"
    )

    PAUSAS_DURACAO_CHOICES = (
        ('menos_40min', 'Menos de 40 minutos'),
        ('40min', '40 minutos (2 pausas de 10 minutos + 1 pausa de 20 minutos)'),
        ('mais_40min', 'Mais de 40 minutos'),
        ('sem_pausas_regulares', 'Não tenho pausas regulares'),
        ('outro', 'Outro'),
    )
    pausas_duracao = models.CharField(
        max_length=25,
        choices=PAUSAS_DURACAO_CHOICES,
        verbose_name="Duração total das pausas na jornada"
    )
    pausas_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição de como funciona o intervalo no dia a dia"
    )

    HORAS_EXTRAS_CHOICES = (
        ('sempre', 'Sempre'),
        ('as_vezes', 'Às vezes'),
        ('nunca', 'Nunca'),
        ('nao_realizo', 'Não realizo horas extras'),
        ('nao_sei', 'Não sei informar'),
    )
    horas_extras_pagas = models.CharField(
        max_length=20,
        choices=HORAS_EXTRAS_CHOICES,
        verbose_name="Horas extras pagas ou compensadas?"
    )

    HORAS_EXTRAS_NAO_COMPENSADAS_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
    )
    horas_extras_nao_compensadas = models.CharField(
        max_length=20,
        choices=HORAS_EXTRAS_NAO_COMPENSADAS_CHOICES,
        verbose_name="Já teve horas extras não compensadas?"
    )
    horas_extras_relato = models.TextField(
        blank=True,
        verbose_name="Relato de horas extras não compensadas"
    )

    # ============================================================
    # BLOCO 7: MONITORIA E AVALIAÇÃO
    # ============================================================
    MONITORAMENTO_TIPO_CHOICES = (
        ('nao_ha', 'Não há monitoramento'),
        ('automatico_amostragem', 'Monitoramento automático por amostragem'),
        ('individual_feedback', 'Monitoramento individual com feedback'),
        ('nao_sei', 'Não sei'),
        ('outro', 'Outro'),
    )
    monitoramento_tipo = models.CharField(
        max_length=30,
        choices=MONITORAMENTO_TIPO_CHOICES,
        verbose_name="Como funciona o monitoramento das ligações?"
    )
    monitoramento_outro = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Outro tipo de monitoramento (especifique)"
    )

    cx_avaliacao = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],
        verbose_name="CX/monitoria (1=Totalmente punitiva, 5=Totalmente educativa)"
    )

    REMUNERACAO_MONITORIA_CHOICES = (
        ('sim_mais_uma_vez', 'Sim, mais de uma vez'),
        ('sim_uma_vez', 'Sim, uma vez'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
    )
    remuneracao_afetada_monitoria = models.CharField(
        max_length=25,
        choices=REMUNERACAO_MONITORIA_CHOICES,
        verbose_name="Remuneração ou benefícios afetados por monitoria?"
    )
    remuneracao_monitoria_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição de remuneração afetada por monitoria"
    )

    # ============================================================
    # BLOCO 8: SAÚDE MENTAL E ADOECIMENTO
    # ============================================================
    AFASTAMENTO_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    afastamento_saude_mental = models.CharField(
        max_length=30,
        choices=AFASTAMENTO_CHOICES,
        verbose_name="Já se afastou por saúde mental?"
    )

    AFASTAMENTO_DURACAO_CHOICES = (
        ('menos_1_mes', 'Menos de 1 mês'),
        ('1a3_meses', '1 a 3 meses'),
        ('3a6_meses', '3 a 6 meses'),
        ('mais_6_meses', 'Mais de 6 meses'),
        ('nao_me_afastei', 'Não me afastei'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    afastamento_duracao = models.CharField(
        max_length=25,
        choices=AFASTAMENTO_DURACAO_CHOICES,
        blank=True,
        verbose_name="Duração do afastamento"
    )

    AFASTAMENTO_RETORNO_CHOICES = (
        ('adequado', 'Adequado'),
        ('parcialmente_adequado', 'Parcialmente adequado'),
        ('inadequado', 'Inadequado'),
        ('nao_aplicavel', 'Não se aplica'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    afastamento_retorno = models.CharField(
        max_length=25,
        choices=AFASTAMENTO_RETORNO_CHOICES,
        blank=True,
        verbose_name="Como foi o retorno da empresa?"
    )
    afastamento_detalhes = models.TextField(
        blank=True,
        verbose_name="Detalhes sobre o afastamento"
    )

    RELACAO_PRESSao_ADoecimento_CHOICES = (
        ('sim_forte', 'Sim, forte'),
        ('sim_moderada', 'Sim, moderada'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
    )
    relacao_pressao_adoecimento = models.CharField(
        max_length=20,
        choices=RELACAO_PRESSao_ADoecimento_CHOICES,
        verbose_name="Relação entre pressão e adoecimento de colegas?"
    )
    relacao_pressao_exemplos = models.TextField(
        blank=True,
        verbose_name="Exemplos de relação entre pressão e adoecimento"
    )

    HUMILHACAO_CHOICES = (
        ('sim_presenciei', 'Sim, já presenciei'),
        ('sim_vivenciei', 'Sim, já vivenciei'),
        ('sim_ambos', 'Sim, ambos'),
        ('nao', 'Não'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    humilhacao = models.CharField(
        max_length=25,
        choices=HUMILHACAO_CHOICES,
        verbose_name="Presenciou ou vivenciou humilhação/sobrecarga?"
    )
    humilhacao_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição de humilhação/sobrecarga"
    )

    # ============================================================
    # BLOCO 9: ROTATIVIDADE E DESLIGAMENTO
    # ============================================================
    ROTATIVIDADE_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei dizer'),
    )
    rotatividade = models.CharField(
        max_length=20,
        choices=ROTATIVIDADE_CHOICES,
        verbose_name="Percebe alta rotatividade?"
    )

    PRESSAO_DESLIGAMENTO_CHOICES = (
        ('sim_sofri', 'Sim, sofri'),
        ('sim_presenciei', 'Sim, presenciei colegas'),
        ('sim_ambos', 'Sim, ambos'),
        ('nao', 'Não'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    pressao_desligamento = models.CharField(
        max_length=25,
        choices=PRESSAO_DESLIGAMENTO_CHOICES,
        verbose_name="Pressão para pedir desligamento voluntário?"
    )

    JUSTA_CAUSA_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    justa_causa_injustificada = models.CharField(
        max_length=25,
        choices=JUSTA_CAUSA_CHOICES,
        verbose_name="Viu demissão por justa causa injustificada?"
    )
    desligamento_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição sobre desligamentos"
    )

    CASOS_JUSTICA_CHOICES = (
        ('sim_conheco', 'Sim, conheço'),
        ('nao_conheco', 'Não conheço'),
        ('nao_sei', 'Não sei'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    casos_justica = models.CharField(
        max_length=25,
        choices=CASOS_JUSTICA_CHOICES,
        verbose_name="Conhece casos de colegas que entraram na Justiça?"
    )
    casos_justica_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição sobre casos na Justiça"
    )

    # ============================================================
    # BLOCO 10: DIVERSIDADE E DISCRIMINAÇÃO
    # ============================================================
    DESIGUALDADE_CHOICES = (
        ('nao_percebo', 'Não percebo'),
        ('percebo_parcialmente', 'Percebo parcialmente'),
        ('percebo_fortemente', 'Percebo fortemente'),
        ('nao_sei', 'Não sei informar'),
    )
    desigualdade_representacao = models.CharField(
        max_length=25,
        choices=DESIGUALDADE_CHOICES,
        verbose_name="Percebe desigualdade de representação?"
    )
    desigualdade_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição sobre desigualdade de representação"
    )

    RACISMO_ASSEDIO_CHOICES = (
        ('sim_sofri', 'Sim, sofri'),
        ('sim_presenciei', 'Sim, presenciei'),
        ('sim_ambos', 'Sim, ambos'),
        ('nao', 'Não'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    racismo_assédio = models.CharField(
        max_length=25,
        choices=RACISMO_ASSEDIO_CHOICES,
        verbose_name="Presenciou ou sofreu racismo, assédio ou discriminação?"
    )

    EMPRESA_RESPOSTA_CHOICES = (
        ('nao_respondeu', 'Não respondeu'),
        ('inadequada', 'Respondeu de forma inadequada'),
        ('parcialmente', 'Respondeu parcialmente'),
        ('adequadamente', 'Respondeu adequadamente'),
        ('nao_sei', 'Não sei'),
        ('nao_aplicavel', 'Não se aplica'),
    )
    empresa_resposta = models.CharField(
        max_length=25,
        choices=EMPRESA_RESPOSTA_CHOICES,
        blank=True,
        verbose_name="Como a empresa respondeu?"
    )
    discriminacao_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição sobre discriminação"
    )

    NEPOTISMO_CHOICES = (
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('nao_sei', 'Não sei'),
        ('prefiro_nao_responder', 'Prefiro não responder'),
    )
    nepotismo = models.CharField(
        max_length=25,
        choices=NEPOTISMO_CHOICES,
        verbose_name="Conhecimento de práticas de favorecimento?"
    )
    nepotismo_descricao = models.TextField(
        blank=True,
        verbose_name="Descrição sobre favorecimento"
    )

    # ============================================================
    # BLOCO 11: CAMPO FINAL
    # ============================================================
    observacoes_finais = models.TextField(
        blank=True,
        verbose_name="Espaço aberto para relatos, complementos e observações"
    )

    # ============================================================
    # METADADOS
    # ============================================================
    data_submissao = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Data de submissão"
    )

    def __str__(self):
        return f"Denúncia #{self.id} - {self.data_submissao.strftime('%d/%m/%Y %H:%M')}"