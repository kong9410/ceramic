from djongo import models

# Create your models here.


class FactoryAnalysis(models.Model):

    factory = models.CharField(max_length=200, null=True, blank=True)
    line = models.CharField(max_length=200, null=True, blank=True)
    process = models.CharField(max_length=200, null=True, blank=True)
    quality = models.CharField(max_length=200, null=True, blank=True)
    


    objects = models.DjongoManager()
    class Meta:
        managed = False
        db_table = 'workpiece'


class Images(models.Model):

    quality = models.CharField(max_length=100, null=True, blank=True)
    image_class = models.CharField(max_length=100, null=True, blank=True)


    objects = models.DjongoManager()
    class Meta:
        managed = False
        db_table = 'images'
