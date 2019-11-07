from django.urls import path
from . import views

urlpatterns = [
    path('factory/', views.factory, name='factory'),
    path('factory/add/', views.factory_add, name='factory_add'),
    path('factory/edit/<int:pk>/', views.factory_edit, name='factory_edit'),

]
