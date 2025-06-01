from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Genre, Mood
from .serializers import GenreSerializer, MoodSerializer, UserSerializer, UserProfileSerializer
from rest_framework import status
from .serializers import RegisterSerializer, UserSerializer


class CookieLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            res = Response({"message": "Login successful"})

            # Set HttpOnly cookies
            res.set_cookie(
                key='access',
                value=str(refresh.access_token),
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
                max_age=60 * 60  # 1 hour
            )
            res.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60  # 1 week
            )
            return res
        return Response({"error": "Invalid credentials"}, status=401)


class LogoutView(APIView):
    def post(self, request):
        res = Response({"message": "Logged out"})
        res.delete_cookie('access')
        res.delete_cookie('refresh')
        return res



class UserProfileMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Autentificare automată: obține tokenurile JWT
            refresh = RefreshToken.for_user(user)
            res = Response({
                "user": UserSerializer(user).data,
                "message": "Registration successful"
            }, status=status.HTTP_201_CREATED)

            # Setează cookie-uri HttpOnly
            res.set_cookie(
                key='access',
                value=str(refresh.access_token),
                httponly=True,
                secure=False,  # Pune True dacă folosești HTTPS
                samesite='Lax',
                max_age=60 * 60  # 1 oră
            )
            res.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60  # 7 zile
            )
            return res
        else:
            print("REGISTRATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class CheckEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        exists = User.objects.filter(email=email).exists()
        return Response({"available": not exists})



class CheckUsernameView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        exists = User.objects.filter(username=username).exists()
        return Response({"available": not exists})



class GenreListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)


class MoodListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        moods = Mood.objects.all()
        serializer = MoodSerializer(moods, many=True)
        return Response(serializer.data)



class UserProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)