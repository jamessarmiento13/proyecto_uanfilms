from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import hashlib

User = get_user_model()

class Pelicula(models.Model):
    nombre = models.CharField(max_length=200)
    ano = models.PositiveSmallIntegerField()
    elenco = models.TextField(blank=True)
    director = models.CharField(max_length=100)
    genero = models.CharField(max_length=50)
    sinopsis = models.TextField(blank=True)
    codigo_hash = models.CharField(max_length=255, unique=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('nombre', 'ano', 'director')

    def save(self, *args, **kwargs):
        # genera el hash si no existe (evita regenerarlo en cada save)
        if not self.codigo_hash:
            texto = (self.nombre.lower().replace(" ", "") + str(self.ano)).encode()
            self.codigo_hash = hashlib.md5(texto).hexdigest()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} ({self.ano})"

class Resena(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    pelicula = models.ForeignKey(Pelicula, on_delete=models.CASCADE, related_name='resenas')
    puntaje = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    texto = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    archivo_blob = models.URLField(blank=True, null=True)   

    def __str__(self):
        usuario_str = getattr(self.usuario, "username", "Usuario eliminado")
        pelicula_str = getattr(self.pelicula, "nombre", "Película eliminada")
        return f"Reseña {self.id} - {usuario_str} - {pelicula_str}"
