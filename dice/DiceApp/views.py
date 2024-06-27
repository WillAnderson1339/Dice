from django.shortcuts import render, HttpResponse

# Create your views here.

def page_router(request):
	#print("page_router handler")
	if "/" == request.path.lower():
		return render(request, "home.html")
	if "home" in request.path.lower():
		return render(request, "home.html")
	elif "about" in request.path.lower():
		return render(request, "about.html")
	elif "roll_1" in request.path.lower():
		return render(request, "rolling_test_1.html")
	else:
		return HttpResponse("unknown page request " + request.path)

