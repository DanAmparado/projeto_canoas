from rest_framework import serializers
from .models import Resposta
from .hcaptcha import verify_hcaptcha

class RespostaSerializer(serializers.ModelSerializer):
    hcaptcha = serializers.CharField(write_only=True)

    class Meta:
        model = Resposta
        fields = '__all__'
        read_only_fields = ('data_submissao',)

    def validate_hcaptcha(self, value):
        if not verify_hcaptcha(value):
            raise serializers.ValidationError(
                'Verificação de captcha falhou. Tente novamente.'
            )
        return value

    def create(self, validated_data):
        validated_data.pop('hcaptcha', None)
        return Resposta.objects.create(**validated_data)