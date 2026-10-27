from django.urls import path
from .views import MeView, UserListCreateView, UserRetrieveUpdateDestroyView

urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
    path('usuarios/', UserListCreateView.as_view(), name='user-list-create'),
    path('usuarios/<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
]