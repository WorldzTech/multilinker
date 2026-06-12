from django.urls import path

from .views import LinkItemClickView, MultiLinkCreateView, MultiLinkPublicView

urlpatterns = [
    path("multilinks/", MultiLinkCreateView.as_view(), name="multilink-create"),
    path("s/<str:slug>/", MultiLinkPublicView.as_view(), name="multilink-public"),
    path(
        "s/<str:slug>/click/<uuid:item_id>/",
        LinkItemClickView.as_view(),
        name="linkitem-click",
    ),
]
