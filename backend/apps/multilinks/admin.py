from django.contrib import admin

from .models import LinkItem, MultiLink


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
    list_display = ["title", "url", "multilink", "order", "click_count"]
    list_filter = ["multilink"]
