from rest_framework import routers
from .views import PeliculaViewSet, ResenaViewSet, RegisterView
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from . import views

router = routers.DefaultRouter()
router.register(r'peliculas', PeliculaViewSet)
router.register(r'resenas', ResenaViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view(), name='user_register'),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]

