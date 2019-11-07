from django.urls import path
from . import views, views_fac_analysis

urlpatterns = [
    path('', views.index, name='index'),
    path('sample/', views.sample, name='sample'),
]
