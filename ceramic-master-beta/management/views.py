from django.shortcuts import render


# Create your views here.
def factory(request):
    return render(request, 'management/factory.html')


def factory_add(request):
    return render(request, 'management/factory_add.html')


def factory_edit(request, pk):
    return render(request, 'management/factory_edit.html')
