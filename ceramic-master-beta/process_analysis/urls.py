from django.urls import path
from . import views

app_name = 'process_analysis'
urlpatterns = [
    path('outlier/batch', views.outlier_batch, name='outlier_batch'),
    path('outlier/batch/result', views.outlier_batch_ajax, name='outlier_batch_ajax'),
    path('correlation', views.correlation, name='outlier_correlation'),
    path('correlation/result', views.correlation_ajax, name='outlier_correlation_ajax'),
    path('correlation/heatmap', views.heatmap_correlation, name='heatmap_correlation'),
    path('correlation/heatmap/result', views.heatmap_correlation_ajax, name='heatmap_correlation_ajax'),
]