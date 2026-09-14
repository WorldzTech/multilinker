from django.contrib import admin

from .models import LinkItem, MultiLink, ShortLink


class LinkItemInline(admin.TabularInline):
    model = LinkItem
    extra = 0


@admin.register(MultiLink)
class MultiLinkAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "created_at"]
    search_fields = ["title", "slug"]
    inlines = [LinkItemInline]


@admin.register(LinkItem)
class LinkItemAdmin(admin.ModelAdmin):
    list_display = ["title", "url", "multilink", "order", "click_count", "comment"]
    list_filter = ["multilink"]


@admin.register(ShortLink)
class ShortLinkAdmin(admin.ModelAdmin):
    list_display = ["slug", "url", "click_count", "created_at"]
    search_fields = ["slug", "url"]
