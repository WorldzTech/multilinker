import uuid

from django.db import models

from .utils import SLUG_LENGTH, generate_unique_slug


class MultiLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    slug = models.CharField(max_length=SLUG_LENGTH, unique=True, editable=False)
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(MultiLink)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.slug})"


class LinkItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    multilink = models.ForeignKey(MultiLink, related_name="items", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    url = models.URLField()
    order = models.PositiveIntegerField(default=0)
    click_count = models.PositiveIntegerField(default=0)
    comment = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title
