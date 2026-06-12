import secrets
import string

SLUG_ALPHABET = string.ascii_letters + string.digits
SLUG_LENGTH = 8


def generate_slug(length: int = SLUG_LENGTH) -> str:
    """Generate a random nanoid-like slug from [a-zA-Z0-9]."""
    return "".join(secrets.choice(SLUG_ALPHABET) for _ in range(length))


def generate_unique_slug(model, field_name: str = "slug", length: int = SLUG_LENGTH) -> str:
    """Generate a random slug, retrying until it is unique for the given model."""
    while True:
        slug = generate_slug(length)
        if not model.objects.filter(**{field_name: slug}).exists():
            return slug
