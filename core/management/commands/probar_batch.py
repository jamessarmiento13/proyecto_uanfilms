from django.core.management.base import BaseCommand
from core.models import Resena
import os

class Command(BaseCommand):
    help = 'Crea archivos de texto con reseñas (versión local)'

    def handle(self, *args, **options):
        os.makedirs('archivos_reseñas', exist_ok=True)
        for r in Resena.objects.all():
            with open(f'archivos_reseñas/resena_{r.id}.txt', 'w', encoding='utf-8') as f:
                f.write(r.texto.lower())
        self.stdout.write(self.style.SUCCESS('Archivos creados correctamente'))