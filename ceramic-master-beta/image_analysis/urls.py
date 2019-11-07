from django.urls import path
from . import views

app_name = 'image_analysis'
urlpatterns = [
    # ex: /image_analysis/
    path('', views.index, name='index'),
     # ex: /image_analysis/image_analysis_details
    path('image_analysis_details/', views.image_analysis_details, name='image_analysis_details'),
    # ex: /image_analysis/image_classification/
    path('image_classification/', views.image_classification, name='image_classification'),
    # ex: /image_analysis/image_object_analysis/
    path('image_object_analysis/', views.image_object_analysis, name='image_object_analysis'),
    # ex: /image_analysis/image_evaluation/
    path('image_evaluation/', views.image_evaluation, name='image_evaluation'),
    # ex: /image_analysis/model_training/
    path('model_training/', views.model_training, name='model_training'),
]