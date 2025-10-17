import base64
import json
import random
from pathlib import Path
from typing import TypedDict

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

# The directory containing this script
THIS_DIR = parent_dir = Path(__file__).parent.absolute()


class ImageFilenameCaption(TypedDict):
    filename: str
    caption: str

class ImageBytesCaption(TypedDict):
    b64_bytes: str
    caption: str


class HelloHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps("Hello, world!"))


class ImageAndCaptionHandler(APIHandler):
    @tornado.web.authenticated
    def get(self) -> ImageBytesCaption:
        # Public domain images from https://www.loc.gov/free-to-use/cats/
        images_and_captions: list[ImageFilenameCaption] = [
            { "filename": "brunnhilde.jpg", "caption": "Brünnhilde" },
            { "filename": "cats.jpg", "caption": "Cats" },
            { "filename": "cat-cher-evolution.jpg", "caption": "Evolution of a cat-cher" },
            { "filename": "the-entanglement.jpg", "caption": "The entantlement" },
        ]
        random_selection = random.choice(images_and_captions)

        # Read the data and encode the bytes in base64
        with open(THIS_DIR / "images" / random_selection["filename"], "rb") as f:
            b64_bytes = base64.b64encode(f.read()).decode("utf-8")

        self.finish(json.dumps({
            "b64_bytes": b64_bytes,
            "caption": random_selection["caption"],
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    hello_pattern = url_path_join(base_url, "myextension", "hello")
    image_pattern = url_path_join(base_url, "myextension", "image-caption")

    handlers = [
        (hello_pattern, HelloHandler),
        (image_pattern, ImageAndCaptionHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)
