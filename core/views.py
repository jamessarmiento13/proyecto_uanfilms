from rest_framework import viewsets, filters
from .models import Pelicula, Resena
from .serializers import PeliculaSerializer, ResenaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import render, get_object_or_404
from .models import Pelicula


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
    filterset_fields = ['pelicula', 'puntaje']

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
    
def home(request):
    """
    Vista que muestra la página de inicio index.html
    """
    return render(request, 'core/index.html')

def detalle_pelicula(request, id):
    pelicula = get_object_or_404(Pelicula, id=id)
    resenas = pelicula.resenas.all()  # gracias al related_name='resenas'

    return render(request, "core/detalle_pelicula.html", {
        "pelicula": pelicula,
        "resenas": resenas
    })
    
def index(request):
    return render(request, 'core/index.html')