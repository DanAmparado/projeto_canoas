from django.db import models

class Resposta(models.Model):
    nome = models.CharField(
        max_length=200,
        verbose_name="Nome completo"
    )
    telefone = models.CharField(
        max_length=20,
        verbose_name="Telefone/WhatsApp"
    )
    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name="E-mail (opcional)"
    )
    mensagem = models.TextField(
        blank=True,
        null=True,
        verbose_name="Mensagem (opcional)"
    )
    data_submissao = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Data de submissão"
    )

    def __str__(self):
        return f"Assinatura #{self.id} - {self.nome}"