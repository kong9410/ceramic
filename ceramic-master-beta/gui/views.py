from django.shortcuts import render
from .models import FactoryAnalysis, Images
from django.db.models import Count
# Create your views here.


def index(request):
    total = FactoryAnalysis.objects.filter(process='테이프캐스팅').count()
    ok_product = FactoryAnalysis.objects.filter(process='테이프캐스팅', quality='OK').count()
    ng_product = FactoryAnalysis.objects.filter(process='테이프캐스팅', quality='NG').count()
    percentage_of_ng_product = "{:.2f} %".format(ng_product/total * 100)

    list_images = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}
    ng_images = Images.objects.filter(quality='NG').values('image_class')
    for item in ng_images:
        print(item['image_class'])
        if (item['image_class'] == '0' or item['image_class'] == '1' or item['image_class'] == '2' or item['image_class'] == '3' or item['image_class'] == '4' or item['image_class'] == '5' or item['image_class'] == '6'):
            list_images[item['image_class']] += 1

    print(list_images)

    return render(request, 'gui/index.html', {
        "header": {
            "total": total,
            "ok_product": ok_product,
            "ng_product": ng_product,
            "percentage_of_ng_product": percentage_of_ng_product
        },
        "list_images": list_images
    })


def sample(request):
    return render(request, 'gui/plain_page.html')
