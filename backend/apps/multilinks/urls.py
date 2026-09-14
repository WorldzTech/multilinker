from django.urls import path

from .views import (
    LinkItemClickView,
    MultiLinkCreateView,
    MultiLinkPublicView,
    ShortLinkCreateView,
    ShortLinkDetailView,
    ShortLinkResolveView,
)

urlpatterns = [
    path("shorten/", ShortLinkCreateView.as_view(), name="shortlink-create"),
    path(
        "shortlinks/<str:slug>/",
        ShortLinkDetailView.as_view(),
        name="shortlink-detail",
    ),
    path("r/<str:slug>/", ShortLinkResolveView.as_view(), name="shortlink-resolve"),
    path("multilinks/", MultiLinkCreateView.as_view(), name="multilink-create"),
    path("s/<str:slug>/", MultiLinkPublicView.as_view(), name="multilink-public"),
    path(
        "s/<str:slug>/click/<uuid:item_id>/",
        LinkItemClickView.as_view(),
        name="linkitem-click",
    ),
]
