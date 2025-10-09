from django.contrib import admin
from .models import Pelicula, Resena

@admin.register(Pelicula)
class PeliculaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ano', 'director', 'genero', 'codigo_hash', 'fecha_registro')
    search_fields = ('nombre', 'director', 'genero')
    list_filter = ('ano', 'genero')

@admin.register(Resena)
class ResenaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'pelicula', 'puntaje', 'fecha')
    search_fields = ('usuario__username', 'pelicula__nombre')
    list_filter = ('puntaje', 'fecha')