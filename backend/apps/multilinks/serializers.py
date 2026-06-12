from rest_framework import serializers

from .models import LinkItem, MultiLink


class LinkItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkItem
        fields = ["id", "title", "url", "order", "click_count"]
        read_only_fields = ["id", "click_count"]


class MultiLinkCreateSerializer(serializers.ModelSerializer):
    items = LinkItemSerializer(many=True)

    class Meta:
        model = MultiLink
        fields = ["id", "title", "slug", "description", "created_at", "items"]
        read_only_fields = ["id", "slug", "created_at"]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one link is required.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        multilink = MultiLink.objects.create(**validated_data)
        LinkItem.objects.bulk_create(
            LinkItem(multilink=multilink, **item_data) for item_data in items_data
        )
        return multilink


class MultiLinkPublicSerializer(serializers.ModelSerializer):
    items = LinkItemSerializer(many=True, read_only=True)

    class Meta:
        model = MultiLink
        fields = ["id", "title", "slug", "description", "created_at", "items"]
