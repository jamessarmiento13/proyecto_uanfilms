from rest_framework import viewsets, filters
from .models import Pelicula, Resena
from .serializers import PeliculaSerializer, ResenaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class PeliculaViewSet(viewsets.ModelViewSet):
    queryset = Pelicula.objects.all()
    serializer_class = PeliculaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['nombre', 'director', 'genero']
    filterset_fields = ['ano', 'genero']

class ResenaViewSet(viewsets.ModelViewSet):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['usuario', 'pelicula', 'puntaje']
    
def home(request):
    """
    Vista que muestra la página de inicio index.html
    """
    return render(request, 'core/index.html')