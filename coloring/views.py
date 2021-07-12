from django.shortcuts import render

# class route 
def demo(request):
    return render(request, 'demo/index.html')


# student route 
def home(request):
    return render(request, 'coloring/home.html')

def main(request):
    return render(request, 'coloring/main.html')

def export(request):
    return render(request, 'coloring/export.html')

def search(request):
    return render(request, 'coloring/search.html')

def settings(request):
    return render(request, 'coloring/settings.html')

def upload(request):
    return render(request, 'coloring/upload.html')