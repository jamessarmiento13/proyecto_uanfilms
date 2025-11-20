from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("pelicula/<int:id>/", views.detalle_pelicula, name="detalle_pelicula"),
]