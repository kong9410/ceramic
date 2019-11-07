from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views import generic

# Create your views here.
def index(request):
    return render(request, 'image_analysis/index.html')

def image_classification(request):
    return render(request, 'image_analysis/image_classification.html')

def image_object_analysis(request):
    return render(request, 'image_analysis/image_object_analysis.html')

def image_evaluation(request):
    return render(request, 'image_analysis/image_evaluation.html')

def model_training(request):
    return render(request, 'image_analysis/model_training.html')

def image_analysis_details(request):
    return render(request, 'image_analysis/image_analysis_details.html')
