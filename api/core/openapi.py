from fastapi.routing import APIRoute


# Generates each route's OpenAPI operation ID from its function name, in
# camelCase (get_entries -> getEntries). The bot's generated API client uses
# these as function names, so they must be unique across the whole API.
#
# You can pass `operation_id=` on a route to override this behavior.
def operation_id(route: APIRoute) -> str:
    first, *rest = route.name.split("_")
    return first + "".join(word.capitalize() for word in rest)
