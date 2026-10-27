from rest_framework import serializers
from .models import Pesquisa
from .hcaptcha import verify_hcaptcha


class PesquisaSerializer(serializers.ModelSerializer):
    hcaptcha = serializers.CharField(write_only=True)

    class Meta:
        model = Pesquisa
        fields = '__all__'
        read_only_fields = ('data_submissao',)

    def validate_hcaptcha(self, value):
        if not verify_hcaptcha(value):
            raise serializers.ValidationError(
                'Verificação de captcha falhou. Tente novamente.'
            )
        return value

    def validate(self, data):
        if data.get('setor') == 'outro' and not data.get('setor_outro'):
            raise serializers.ValidationError({'setor_outro': 'Por favor, especifique o setor.'})

        if data.get('cargo_formal') == 'outro' and not data.get('cargo_formal_outro'):
            raise serializers.ValidationError({'cargo_formal_outro': 'Por favor, especifique o cargo.'})

        funcao = data.get('funcao_efetiva') or []
        if 'outro' in funcao and not data.get('funcao_efetiva_outro'):
            raise serializers.ValidationError({'funcao_efetiva_outro': 'Por favor, especifique a outra função.'})

        if data.get('monitoramento_tipo') == 'outro' and not data.get('monitoramento_outro'):
            raise serializers.ValidationError({'monitoramento_outro': 'Por favor, especifique o tipo de monitoramento.'})

        if not data.get('consentimento'):
            raise serializers.ValidationError({'consentimento': 'É necessário concordar com os termos para participar.'})

        return data

    def create(self, validated_data):
        # Remove o campo hcaptcha antes de criar o objeto (não existe no modelo)
        validated_data.pop('hcaptcha', None)
        return Pesquisa.objects.create(**validated_data)