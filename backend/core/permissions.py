from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsRelatorios(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['relatorios', 'admin']

class IsPadrao(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'padrao'