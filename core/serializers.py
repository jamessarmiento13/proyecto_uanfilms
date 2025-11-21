from rest_framework import serializers
from .models import Pelicula, Resena
from django.contrib.auth import get_user_model

User = get_user_model()

class PeliculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pelicula
        fields = ['id', 'nombre', 'ano', 'director', 'genero', 'sinopsis']
        
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
        fields = ['id', 'usuario', 'pelicula', 'puntaje', 'texto', 'fecha']
        read_only_fields = ['usuario']
        
class UserRegisterSerializer(serializers.ModelSerializer):
    # Campo adicional para confirmar la contraseña (solo escritura)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True}, # Aseguramos que el email sea obligatorio
        }

    def validate(self, data):
        """
        Valida que las dos contraseñas sean iguales.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Ambas contraseñas deben coincidir."})
        return data

    def create(self, validated_data):
        """
        Crea y guarda el objeto User de forma segura.
        """
        # Eliminamos password2 del diccionario de datos
        validated_data.pop('password2')
        
        # Usamos create_user para hashear la contraseña
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
