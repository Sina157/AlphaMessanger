from django.shortcuts import render , redirect , HttpResponse
from json import loads
from django.contrib.auth import login , logout , authenticate
from django.utils.crypto import get_random_string
from . import models


def login_page(req):
    if req.method == 'POST':
        Username = req.POST.get("username")
        user = authenticate(username=Username,password=req.POST.get("password"))
        if user is not None:
            login(req,user)
            user = models.Member.objects.get(username=Username)
            token = get_random_string(25)
            user.ChatToken = token
            user.save()
            response = redirect("/")
            response.set_cookie('ChatToken', token , max_age= 1000 * 24 * 60 * 60) 
            return response 
        else:
            return render(req,"login.html",context={"ErrorMessage":"Invalid Username or Password"})
    elif req.method == 'GET': 
        if req.user.is_authenticated:
            return redirect("/")
        return render(req,"login.html")


def register_page(req):
    # register without ajax
    if req.method == 'POST':
        NewMember = models.Member()
        NewMember.username = req.POST.get("username")
        NewMember.set_password(req.POST.get("password"))
        NewMember.email = req.POST.get("email")
        try:
            NewMember.clean_fields()
            NewMember.save()
            return redirect(login_page)
        except models.ValidationError as ErrorMessage:
            ErrorMessage = ', '.join([f"{key}: {', '.join(value)}" for key, value in ErrorMessage.message_dict.items()])
            return render(req,'register.html' , context={"ErrorMessage":ErrorMessage})
    
    elif req.method == 'GET':
        if req.user.is_authenticated:
            return redirect("/")
        r =  render(req, "register.html")
        r.set_cookie(key='id', value=1)
        return r


def register_ajax(req):
    if req.method == 'POST':
        NewMember = models.Member()
        body = loads(req.body.decode('utf-8'))
        NewMember.username = body.get("username")
        NewMember.set_password(body.get("password"))
        NewMember.email = body.get("email")
        NewMember.UserType = 1
        try:
            NewMember.clean_fields()
            NewMember.save()
            return HttpResponse(status=200)
        except models.ValidationError as ErrorMessage:
            ErrorMessage = ', '.join([f"{key}: {', '.join(value)}" for key, value in ErrorMessage.message_dict.items()])
            return HttpResponse(status=400 , content= ErrorMessage)

def index_page(req):
    if req.method == 'POST':
        logout(req)
        return redirect(login_page)
    elif req.method == 'GET':
        if req.user.is_authenticated:
            return render(req,"index.html")
        else:
            return redirect(register_page)
        
def messages(req):
    if req.user.is_authenticated:
        try:
            result = "["
            value = int(req.GET.get('q')) * -20
            LastMessages  = list(models.Message.objects.all())
            LastMessages = LastMessages[value:len(LastMessages) - value]
            for item in LastMessages:
                username = models.Member.objects.get(id=item.Member_id).username
                result += '{'+f'"{username}":"{item.message}"'+'},'
            result = result[:-1]
            result += "]"
            return HttpResponse(status=200 , content=result)
        except:
            return HttpResponse(status=400 , content="ERROR")
        
