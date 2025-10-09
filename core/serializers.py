from rest_framework import serializers
from .models import Pelicula, Resena

class PeliculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pelicula
        fields = '__all__'
    
    def validate(self, data):
        """
        Evita crear películas duplicadas con mismo nombre, año y director.
        """
        if Pelicula.objects.filter(
            nombre__iexact=data['nombre'],
            ano=data['ano'],
            director__iexact=data['director']
        ).exists():
            raise serializers.ValidationError("Película ya existe.")
        return data

class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = '__all__'
