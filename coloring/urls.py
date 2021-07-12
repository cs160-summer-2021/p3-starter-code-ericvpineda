from django.urls import path
from . import views

urlpatterns = [
    # class routes
    path('demo', views.demo, name='demo'),
    path('new_interaction', views.demo, name='new_interaction'),

    # student routes 
    path('', views.home, name='home'),
    path('main', views.main, name='main'),
    path('export', views.export, name='export'),
    path('search', views.search, name='search'),
    path('settings', views.settings, name='settings'),
    path('upload', views.upload, name='upload')
]
