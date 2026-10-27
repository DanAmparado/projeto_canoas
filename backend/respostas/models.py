from django.db import models

class Resposta(models.Model):
    nome = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name="Nome (opcional)"
    )
    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name="E-mail (opcional)"
    )
    mensagem = models.TextField(
        verbose_name="Mensagem"
    )
    data_submissao = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Data de submissão"
    )

    def __str__(self):
        return f"Resposta #{self.id} - {self.data_submissao.strftime('%d/%m/%Y %H:%M')}"