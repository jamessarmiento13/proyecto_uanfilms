from django.core.management.base import BaseCommand
from core import models
from core.models import Resena
from django.db.models import F

class Command(BaseCommand):
    help = 'Corrige reseñas pasando el texto a minúsculas y detecta duplicados de películas'

    def handle(self, *args, **options):
        count = 0
        for r in Resena.objects.all():
            nuevo = r.texto.lower()
            if r.texto != nuevo:
                r.texto = nuevo
                r.save()
                count += 1
        self.stdout.write(self.style.SUCCESS(f'{count} reseñas corregidas.'))

        # ejemplo simple para detectar duplicados en Pelicula (nombre+ano)
        from core.models import Pelicula
        duplicates = Pelicula.objects.values('nombre','ano').annotate(c=models.Count('id_pelicula')).filter(c__gt=1)
        if duplicates:
            self.stdout.write('Duplicados detectados:')
            for d in duplicates:
                self.stdout.write(str(d))
        else:
            self.stdout.write('No se detectaron duplicados.')
