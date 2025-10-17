import { Widget } from '@lumino/widgets';
import { MainAreaWidget, ToolbarButton } from '@jupyterlab/apputils';
import { refreshIcon, imageIcon } from '@jupyterlab/ui-components';

import { requestAPI } from './handler';

class ImageCaptionWidget extends Widget {
  // Initialization
  constructor() {
    super();

    // Create and append an HTML <center> tag to our widget's node in the HTML
    // document
    const center = document.createElement('center');
    this.node.appendChild(center);

    // Put an <img> tag into the <center> tag, and also make it a class
    // attribute so we can update it later.
    this.img = document.createElement('img');
    center.appendChild(this.img);

    // Do the same for a caption!
    this.caption = document.createElement('p');
    center.appendChild(this.caption);

    // Initialize the image from the server extension
    this.load_image();
  }

  // Fetching data from the server extension
  load_image(): void {
    requestAPI<any>('image-caption')
      .then(data => {
        console.log(data);
        this.img.src = `data:image/jpeg;base64, ${data.b64_bytes}`;
        this.caption.innerHTML = data.caption;
      })
      .catch(reason => {
        console.error(`Error fetching image data.\n${reason}`);
      });
  }

  // Information for the type checker
  img: HTMLImageElement;
  caption: HTMLParagraphElement;
}

export class ImageCaptionMainAreaWidget extends MainAreaWidget<ImageCaptionWidget> {
  constructor() {
    const content = new ImageCaptionWidget();
    super({ content });

    this.title.label = 'Random image with caption';
    this.title.caption = this.title.label;
    this.title.icon = imageIcon;

    // Add a refresh button to the toolbar
    const refreshButton = new ToolbarButton({
      icon: refreshIcon,
      tooltip: 'Refresh image',
      onClick: () => {
        content.load_image();
      }
    });
    this.toolbar.addItem('refresh', refreshButton);
  }
}
