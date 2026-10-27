from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('padrao', 'Usuário Padrão'),
        ('relatorios', 'Usuário de Relatórios'),
        ('admin', 'Administrador'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='padrao')

    def __str__(self):
        return self.username