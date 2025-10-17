import json


async def test_get_example(jp_fetch):
    # When
    response = await jp_fetch("myextension", "hello")

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload == "Hello, world!"
