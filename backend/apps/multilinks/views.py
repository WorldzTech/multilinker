from django.db.models import F
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import LinkItem, MultiLink, ShortLink
from .serializers import (
    ClickCountSerializer,
    MultiLinkCreateSerializer,
    MultiLinkPublicSerializer,
    ShortLinkSerializer,
)


class MultiLinkCreateView(generics.CreateAPIView):
    """POST /api/v1/multilinks/ - create a multilink with its items."""

    queryset = MultiLink.objects.all()
    serializer_class = MultiLinkCreateSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "create"


class MultiLinkPublicView(generics.RetrieveAPIView):
    """GET /api/v1/s/{slug}/ - retrieve a multilink with its items by slug."""

    queryset = MultiLink.objects.all()
    serializer_class = MultiLinkPublicSerializer
    lookup_field = "slug"


@extend_schema(
    request=None,
    responses={200: ClickCountSerializer},
    summary="Register a click on one link of a multilink page",
)
class LinkItemClickView(APIView):
    """POST /api/v1/s/{slug}/click/{item_id}/ - increment the click counter."""

    serializer_class = ClickCountSerializer

    def post(self, request, slug, item_id):
        item = get_object_or_404(LinkItem, id=item_id, multilink__slug=slug)
        LinkItem.objects.filter(pk=item.pk).update(click_count=F("click_count") + 1)
        item.refresh_from_db(fields=["click_count"])
        return Response({"click_count": item.click_count}, status=status.HTTP_200_OK)


class ShortLinkCreateView(generics.CreateAPIView):
    """POST /api/v1/shorten/ - create a short link for a single URL."""

    queryset = ShortLink.objects.all()
    serializer_class = ShortLinkSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "create"


class ShortLinkDetailView(generics.RetrieveAPIView):
    """GET /api/v1/shortlinks/{slug}/ - read a short link without counting a hit."""

    queryset = ShortLink.objects.all()
    serializer_class = ShortLinkSerializer
    lookup_field = "slug"


@extend_schema(
    summary="Resolve a short link",
    description="Returns the target URL and increments the short link's click counter.",
)
class ShortLinkResolveView(generics.RetrieveAPIView):
    """GET /api/v1/r/{slug}/ - resolve a short link and count the hit."""

    queryset = ShortLink.objects.all()
    serializer_class = ShortLinkSerializer
    lookup_field = "slug"

    def get_object(self):
        link = super().get_object()
        ShortLink.objects.filter(pk=link.pk).update(click_count=F("click_count") + 1)
        return link
